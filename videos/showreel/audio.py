"""Procedural sound design for the showreel, locked to showreel/timeline.json.

    python3 showreel/audio.py out.wav

Everything is synthesized: no samples. 120 BPM, A minor. Each visual event in
the timeline gets its sound at the same timestamp, so cuts land on hits.
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
TL = json.loads((Path(__file__).parent / "timeline.json").read_text())
DUR = TL["duration"]
A = TL["audio"]
BEAT = 60 / TL["bpm"]
N = int(DUR * SR)
rng = np.random.default_rng(961)

L = np.zeros(N)
R = np.zeros(N)
REV = np.zeros(N)  # mono reverb send


def t_axis(n):
    return np.arange(n) / SR


def place(sig, at, gain=1.0, pan=0.0, rev=0.0):
    """Mix a mono signal at time `at` with equal-power panning and a reverb send."""
    i = int(round(at * SR))
    if i >= N:
        return
    if i < 0:
        sig = sig[-i:]
        i = 0
    sig = sig[: N - i] * gain
    a = (pan + 1) * np.pi / 4
    L[i : i + len(sig)] += sig * np.cos(a)
    R[i : i + len(sig)] += sig * np.sin(a)
    REV[i : i + len(sig)] += sig * rev


def env(n, attack, release_k):
    t = t_axis(n)
    a = np.minimum(1, t / max(attack, 1e-4))
    return a * np.exp(-t * release_k)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lowpass(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def highpass(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def saw(freq_t, phase0=0.0):
    ph = np.cumsum(freq_t) / SR + phase0
    return 2 * (ph - np.floor(ph + 0.5))


def sine(freq_t):
    return np.sin(2 * np.pi * np.cumsum(freq_t) / SR)


# ---------------------------------------------------------------- drums
def kick():
    n = int(0.45 * SR)
    t = t_axis(n)
    f = 46 + 110 * np.exp(-t * 28)
    body = sine(f) * np.exp(-t * 7.5)
    click = highpass(rng.standard_normal(n), 2500) * np.exp(-t * 400) * 0.35
    return np.tanh(1.6 * (body + click))


def clap():
    n = int(0.3 * SR)
    t = t_axis(n)
    noise = bandpass(rng.standard_normal(n), 900, 5200)
    e = np.zeros(n)
    for k, d in enumerate([0, 0.011, 0.022]):
        i = int(d * SR)
        e[i:] += np.exp(-(t[: n - i]) * (60 if k < 2 else 16))
    return noise * e * 0.6


def hat(open_=False):
    n = int((0.16 if open_ else 0.05) * SR)
    t = t_axis(n)
    return highpass(rng.standard_normal(n), 7000, 4) * np.exp(-t * (28 if open_ else 95)) * 0.5


def tick():
    n = int(0.012 * SR)
    t = t_axis(n)
    return highpass(rng.standard_normal(n), 3500) * np.exp(-t * 600)


# ---------------------------------------------------------------- fx
def impact(length=1.6):
    n = int(length * SR)
    t = t_axis(n)
    boom = sine(38 + 70 * np.exp(-t * 9)) * np.exp(-t * 2.6)
    crack = bandpass(rng.standard_normal(n), 300, 6000) * np.exp(-t * 22) * 0.55
    sub = sine(np.full(n, 41.2)) * np.exp(-t * 1.8) * 0.5
    return np.tanh(1.4 * (boom + crack + sub))


def riser(length):
    n = int(length * SR)
    t = t_axis(n)
    k = t / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    # swept band, processed in short blocks so the band can move
    block = 1024
    for s in range(0, n, block):
        c = 300 * (9000 / 300) ** k[s]
        seg = noise[s : s + block]
        out[s : s + block] = bandpass(seg, max(80, c * 0.6), min(SR / 2 - 100, c * 1.4))
    tone = sine(110 * 2 ** (3 * k)) * 0.25
    return (out * 0.8 + tone) * (k**2.2)


def whoosh(length=0.42):
    n = int(length * SR)
    t = t_axis(n)
    k = t / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    block = 512
    for s in range(0, n, block):
        c = 600 + 3800 * np.sin(np.pi * k[s])
        out[s : s + block] = bandpass(noise[s : s + block], c * 0.5, min(SR / 2 - 100, c * 1.6))
    return out * np.sin(np.pi * k) ** 2 * 0.7


def bell(freq, length=1.4):
    n = int(length * SR)
    t = t_axis(n)
    s = sum(a * np.sin(2 * np.pi * freq * m * t) * np.exp(-t * d) for m, a, d in [(1, 1, 3.2), (2.01, 0.45, 5), (3.02, 0.22, 8), (4.2, 0.1, 12)])
    return s * np.minimum(1, t / 0.003) * 0.5


def rotor(start, end):
    n = int((end - start) * SR)
    t = t_axis(n) + start
    # pitch falls as the airframe brakes into the catch, then holds
    arrive = np.clip((t - 0.15) / 0.9, 0, 1)
    f = 132 - 34 * (1 - (1 - arrive) ** 3)
    buzz = saw(f) * 0.5 + saw(f * 2.003) * 0.25
    blade = 0.55 + 0.45 * np.sin(2 * np.pi * np.cumsum(f * 0.5) / SR)
    air = lowpass(rng.standard_normal(n), 1800) * 0.35
    sig = lowpass(buzz * blade, 2400) + air
    fade = np.clip((t - start) / 0.35, 0, 1) * np.clip((end - t) / 0.45, 0, 1)
    return sig * fade * 0.32


def scratch(start, end):
    n = int((end - start) * SR)
    t = t_axis(n)
    stroke = np.abs(np.sin(2 * np.pi * 7.5 * t)) ** 0.6 * (0.6 + 0.4 * rng.random(n))
    stroke = lowpass(stroke, 40)
    noise = bandpass(rng.standard_normal(n), 2500, 9000)
    return noise * stroke * 0.35


# ---------------------------------------------------------------- music
NOTES = {"A1": 55.0, "F1": 43.65, "C2": 65.41, "G1": 49.0, "E1": 41.2}
CHORDS = [  # (start, end, root, triad freqs)
    (2.0, 4.0, "A1", [220.0, 261.63, 329.63]),
    (4.0, 6.0, "F1", [174.61, 220.0, 261.63]),
    (6.0, 8.0, "C2", [196.0, 261.63, 329.63]),
    (8.0, 10.0, "G1", [196.0, 246.94, 293.66]),
    (10.0, 12.0, "A1", [220.0, 261.63, 329.63]),
    (12.0, 13.2, "F1", [174.61, 220.0, 261.63]),
    (13.2, 15.0, "A1", [220.0, 261.63, 329.63, 440.0]),
]


def pad(start, end, freqs):
    n = int((end - start + 0.6) * SR)
    t = t_axis(n)
    voices = sum(saw(np.full(n, f * 2 ** (c / 1200)), rng.random()) for f in freqs for c in (-8, 0, 8))
    sig = lowpass(voices / (len(freqs) * 3), 1400, 2)
    a = np.minimum(1, t / 0.25)
    r = np.clip((end - start + 0.6 - t) / 0.6, 0, 1)
    return sig * a * r * 0.22


def bass_note(freq, length):
    n = int(length * SR)
    t = t_axis(n)
    return (sine(np.full(n, freq)) + 0.3 * sine(np.full(n, freq * 2))) * env(n, 0.004, 6) * 0.55


def build():
    # music bed
    for start, end, root, triad in CHORDS:
        place(pad(start, end, triad), start, gain=1.0, rev=0.35)
    k0, k1 = A["kickFrom"], A["kickTo"]
    beats = np.arange(k0, k1 + 1e-6, BEAT)
    for b in beats:
        place(kick(), b, gain=0.95, rev=0.05)
        root = next((NOTES[c[2]] for c in CHORDS if c[0] <= b < c[1]), 55.0)
        place(bass_note(root, BEAT * 0.95), b + 0.005, gain=0.8)
    for b in np.arange(A["clapFrom"], A["clapTo"] + 1e-6, 2 * BEAT):
        place(clap(), b, gain=0.55, pan=0.05, rev=0.25)
    for i, h in enumerate(np.arange(A["hatsFrom"], A["hatsTo"] + 1e-6, BEAT / 2)):
        off = i % 2 == 1
        place(hat(open_=off and i % 8 == 7), h, gain=0.38 if off else 0.22, pan=0.25 if off else -0.2)

    # sound design
    place(rotor(*A["rotor"]), A["rotor"][0], pan=-0.15, rev=0.15)
    for a, b in A["risers"]:
        place(riser(b - a), a, gain=0.55, rev=0.2)
    for at in A["impacts"]:
        place(impact(), at, gain=1.0, rev=0.5)
    place(impact(1.4), A["finalHit"], gain=0.9, rev=0.6)
    for i, at in enumerate(A["whooshes"]):
        place(whoosh(), at - 0.2, gain=0.55, pan=-0.6 + 1.2 * (i % 2), rev=0.25)
    for a, b, n in A["ticks"]:
        for k in range(n):
            place(tick(), a + (b - a) * k / max(1, n - 1), gain=0.32, pan=0.3 * (rng.random() - 0.5))
    for f, at in zip([659.25, 783.99, 880.0], A["loopWords"]):
        place(bell(f), at, gain=0.42, pan=0.0, rev=0.55)
    for at in A["dotLand"]:
        place(bell(1760.0, 0.9), at, gain=0.3, rev=0.45)
        place(kick() * 0.6, at, gain=0.5)
    place(scratch(*A["signature"]), A["signature"][0], gain=0.7, pan=0.2, rev=0.1)


def master():
    # reverb: exponentially decaying noise impulse, stereo decorrelated
    ir_n = int(1.9 * SR)
    t = t_axis(ir_n)
    irl = rng.standard_normal(ir_n) * np.exp(-t * 3.4)
    irr = rng.standard_normal(ir_n) * np.exp(-t * 3.4)
    irl[: int(0.012 * SR)] = 0
    irr[: int(0.017 * SR)] = 0
    wet = lowpass(REV, 5000)
    l = L + fftconvolve(wet, irl)[:N] * 0.018
    r = R + fftconvolve(wet, irr)[:N] * 0.018
    stereo = np.stack([l, r], axis=1)
    stereo = highpass(stereo.T, 28).T
    stereo = np.tanh(stereo * 1.15) / np.tanh(1.15)
    # end clean on the last frame
    fade = int(0.3 * SR)
    stereo[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
    stereo /= np.max(np.abs(stereo)) / 10 ** (-1 / 20)
    return stereo


def write_wav(path, stereo):
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with open(path, "wb") as f:
        data = pcm.tobytes()
        f.write(b"RIFF" + (36 + len(data)).to_bytes(4, "little") + b"WAVE")
        f.write(b"fmt " + (16).to_bytes(4, "little") + (1).to_bytes(2, "little") + (2).to_bytes(2, "little"))
        f.write(SR.to_bytes(4, "little") + (SR * 4).to_bytes(4, "little") + (4).to_bytes(2, "little") + (16).to_bytes(2, "little"))
        f.write(b"data" + len(data).to_bytes(4, "little") + data)


if __name__ == "__main__":
    build()
    write_wav(sys.argv[1] if len(sys.argv) > 1 else "showreel.wav", master())
