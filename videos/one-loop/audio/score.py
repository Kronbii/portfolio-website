"""One Loop — score and sound design, composed to picture.

    python3 audio/score.py audio/score.wav

Synthesized (numpy/scipy), no samples. 120 BPM, A minor. The signal has a
voice: a quiet tone whose pitch follows the head's height off its row and
whose pan follows the head across the screen (audio/head.json, exported from
assets/js/signal.js), so the telemetry wobble, the step response's overshoot,
and the final settle are heard as well as seen. It settles on the tonic.
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 15.0
N = int(DUR * SR)
BEAT = 0.5
HERE = Path(__file__).parent
HEAD = json.loads((HERE / "head.json").read_text())
rng = np.random.default_rng(1961)

L = np.zeros(N)
R = np.zeros(N)
SEND = np.zeros(N)
DUCK = np.ones(N)  # sidechain envelope from the kick, applied to bass and pad


def ta(n):
    return np.arange(n) / SR


def place(sig, at, gain=1.0, pan=0.0, rev=0.0, duck=False):
    i = int(round(at * SR))
    if i >= N or len(sig) == 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    if duck:
        sig = sig * DUCK[i : i + len(sig)]
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    L[i : i + len(sig)] += sig * np.cos(a)
    R[i : i + len(sig)] += sig * np.sin(a)
    SEND[i : i + len(sig)] += sig * rev


def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, o=2):
    return sosfilt(butter(o, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, o=2):
    return sosfilt(butter(o, f, btype="high", fs=SR, output="sos"), x)


def osc_sin(f):
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def osc_saw(f, ph=0.0):
    p = np.cumsum(f) / SR + ph
    return 2 * (p - np.floor(p + 0.5))


def env(n, a, k):
    t = ta(n)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t * k)


NOTE = {"A1": 55.0, "F1": 43.65, "C2": 65.41, "G1": 49.0, "A2": 110.0, "F2": 87.31, "C3": 130.81, "G2": 98.0}
CHORDS = [  # start, end, bass root, chord tones (Hz)
    (2.0, 4.0, "A1", [220.0, 261.63, 329.63, 440.0]),
    (4.0, 6.0, "F1", [174.61, 220.0, 261.63, 349.23]),
    (6.0, 8.0, "C2", [196.0, 261.63, 329.63, 392.0]),
    (8.0, 10.0, "G1", [196.0, 246.94, 293.66, 392.0]),
    (10.0, 12.0, "A1", [220.0, 261.63, 329.63, 440.0]),
    (12.0, 13.0, "F1", [174.61, 220.0, 261.63, 349.23]),
    (13.0, 15.0, "A1", [220.0, 261.63, 329.63, 493.88]),
]


def chord_at(t):
    for c in CHORDS:
        if c[0] <= t < c[1]:
            return c
    return CHORDS[0] if t < 2 else CHORDS[-1]


# ------------------------------------------------------------- instruments
def kick():
    n = int(0.42 * SR)
    t = ta(n)
    body = osc_sin(44 + 120 * np.exp(-t * 30)) * np.exp(-t * 7.0)
    click = hp(rng.standard_normal(n), 2500) * np.exp(-t * 420) * 0.3
    return np.tanh(1.7 * (body + click))


def clap():
    n = int(0.28 * SR)
    t = ta(n)
    e = np.zeros(n)
    for k, d in enumerate([0, 0.009, 0.019]):
        i = int(d * SR)
        e[i:] += np.exp(-t[: n - i] * (70 if k < 2 else 17))
    return bp(rng.standard_normal(n), 900, 5500) * e * 0.55


def hat(open_=False):
    n = int((0.15 if open_ else 0.045) * SR)
    return hp(rng.standard_normal(n), 7500, 4) * np.exp(-ta(n) * (26 if open_ else 100)) * 0.45


def tick(f=4200):
    n = int(0.018 * SR)
    t = ta(n)
    return (hp(rng.standard_normal(n), 3000) * 0.6 + osc_sin(np.full(n, f)) * 0.5) * np.exp(-t * 380)


def bell(f, length=1.6, bright=1.0):
    n = int(length * SR)
    t = ta(n)
    s = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a, d in [(1, 1, 2.6), (2.0, 0.42 * bright, 4.5), (3.01, 0.2 * bright, 7), (4.2, 0.08 * bright, 11)])
    return s * np.minimum(1, t / 0.002) * 0.5


def pluck(f, length=0.32, cutoff=3200):
    n = int(length * SR)
    s = osc_saw(np.full(n, f)) * 0.6 + osc_saw(np.full(n, f * 1.006)) * 0.4
    return lp(s, cutoff) * env(n, 0.002, 11)


def impact(length=1.8, big=1.0):
    n = int(length * SR)
    t = ta(n)
    boom = osc_sin(36 + 80 * np.exp(-t * 8)) * np.exp(-t * 2.4)
    crack = bp(rng.standard_normal(n), 250, 7000) * np.exp(-t * 20) * 0.5 * big
    sub = osc_sin(np.full(n, 55.0)) * np.exp(-t * 1.6) * 0.45 * big
    return np.tanh(1.5 * (boom + crack + sub))


def riser(length, top=8000):
    n = int(length * SR)
    t = ta(n)
    k = t / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for s in range(0, n, blk):
        c = 300 * (top / 300) ** k[s]
        out[s : s + blk] = bp(noise[s : s + blk], max(80, c * 0.6), min(SR / 2 - 200, c * 1.4))
    tone = osc_sin(110 * 2 ** (3 * k)) * 0.22
    return (out * 0.8 + tone) * k**2.3


def whoosh(length=0.5):
    n = int(length * SR)
    k = ta(n) / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 512
    for s in range(0, n, blk):
        c = 500 + 4200 * np.sin(np.pi * k[s])
        out[s : s + blk] = bp(noise[s : s + blk], c * 0.5, min(SR / 2 - 200, c * 1.6))
    return out * np.sin(np.pi * k) ** 2 * 0.75


def rotor(t0, t1):
    n = int((t1 - t0) * SR)
    t = ta(n) + t0
    land = np.clip((t - 0.05) / 0.5, 0, 1)
    u = np.clip((t - 2.0) / 0.6, 0, 1)
    climb = 1 - (1 - u) ** 2  # matches the drone's punched climb in drone.js
    f = 150 - 30 * (1 - (1 - land) ** 3) + 70 * climb
    buzz = osc_saw(f) * 0.5 + osc_saw(f * 2.004) * 0.22
    chop = 0.55 + 0.45 * np.sin(2 * np.pi * np.cumsum(f * 0.5) / SR)
    air = lp(rng.standard_normal(n), 1600) * 0.3
    sig = lp(buzz * chop, 2600) + air
    fade = np.clip((t - t0) / 0.25, 0, 1) * np.clip((t1 - t) / 0.5, 0, 1)
    return sig * fade * 0.3


def scratch(t0, t1):
    n = int((t1 - t0) * SR)
    t = ta(n)
    stroke = lp(np.abs(np.sin(2 * np.pi * 6.5 * t)) ** 0.6 * (0.6 + 0.4 * rng.random(n)), 40)
    return bp(rng.standard_normal(n), 2500, 9500) * stroke * 0.32


# ---------------------------------------------------------------- arrange
def build():
    # kick + sidechain
    kicks = list(np.arange(2.0, 12.5 - 1e-6, BEAT)) + [13.0]
    for b in kicks:
        i = int(b * SR)
        n = int(0.32 * SR)
        DUCK[i : i + n] = np.minimum(DUCK[i : i + n], 1 - 0.55 * np.exp(-ta(min(n, N - i)) * 9))
    for b in kicks:
        place(kick(), b, 0.95, rev=0.04)
    # claps on 2 and 4 from 5.0; hats 8ths from 5.0, 16ths from 9.5
    for b in np.arange(5.5, 12.5, 2 * BEAT):
        place(clap(), b, 0.5, 0.06, rev=0.25)
    for i, h in enumerate(np.arange(5.0, 12.5, BEAT / 2)):
        off = i % 2 == 1
        place(hat(off and i % 8 == 7), h, 0.36 if off else 0.2, 0.25 if off else -0.2)
    for h in np.arange(9.5, 12.5, BEAT / 4):
        if (h * 4) % 2 >= 1:
            place(hat(), h, 0.14, 0.4)

    # bass: 8th-note pulse on the root, ducked by the kick
    for b in np.arange(2.0, 12.5, BEAT / 2):
        root = NOTE[chord_at(b)[2]]
        n = int(BEAT / 2 * 0.9 * SR)
        s = (osc_sin(np.full(n, root)) + 0.35 * np.tanh(2 * osc_saw(np.full(n, root * 2)))) * env(n, 0.003, 7)
        place(lp(s, 900), b, 0.5, duck=True)
    # final root, held
    n = int(2.0 * SR)
    place(osc_sin(np.full(n, 55.0)) * env(n, 0.01, 1.4), 13.0, 0.6)

    # pad: soft saw chords, intro to end
    for c0, c1, _, tones in [(0.0, 2.0, None, [110.0, 164.81, 220.0])] + CHORDS:
        n = int((c1 - c0 + 0.5) * SR)
        v = sum(osc_saw(np.full(n, f * 2 ** (d / 1200)), rng.random()) for f in tones for d in (-7, 0, 7))
        s = lp(v / (len(tones) * 3), 1100 if c0 < 13 else 2200)
        e = np.minimum(1, ta(n) / 0.3) * np.clip((c1 - c0 + 0.5 - ta(n)) / 0.5, 0, 1)
        place(s * e, c0, 0.2 if c0 >= 2 else 0.14, rev=0.4, duck=c0 >= 2)

    # arp: 16th plucks on chord tones from 5.0, opening its filter as the film builds
    seq = [0, 2, 1, 3, 2, 1, 3, 2]
    for k, b in enumerate(np.arange(5.0, 12.5, BEAT / 4)):
        tones = chord_at(b)[3]
        f = tones[seq[k % len(seq)] % len(tones)] * 2
        cut = 1800 + 4200 * (b - 5.0) / 7.5
        place(pluck(f, 0.22, cut), b, 0.11, pan=-0.35 + 0.7 * ((k % 4) / 3), rev=0.3)

    # the signal's voice: pitch follows height off the row, pan follows screen x
    rate = HEAD["rate"]
    tt = np.arange(N) / SR
    idx = np.clip((tt * rate).astype(int), 0, len(HEAD["dy"]) - 1)
    dy = np.interp(tt, np.arange(len(HEAD["dy"])) / rate, HEAD["dy"])
    sxs = np.interp(tt, np.arange(len(HEAD["sx"])) / rate, HEAD["sx"])
    live = np.array(HEAD["live"], dtype=float)[idx]
    live = np.convolve(live, np.ones(2400) / 2400, mode="same")
    f = 220.0 * 2 ** (dy / 520.0)
    voice = (osc_sin(f) * 0.7 + osc_sin(f * 2) * 0.18 + osc_sin(f * 0.5) * 0.25) * live
    # after the settle it rests on the tonic under the final chord
    tail = np.clip((tt - 13.0) / 0.2, 0, 1) * np.exp(-np.clip(tt - 13.0, 0, None) * 1.1)
    voice += osc_sin(np.full(N, 220.0)) * 0.7 * tail
    pan = np.clip(sxs * 2 - 1, -0.8, 0.8) * live
    a = (pan + 1) * np.pi / 4
    v = lp(voice, 2400) * 0.13
    L[:] += v * np.cos(a)
    R[:] += v * np.sin(a)
    SEND[:] += v * 0.3

    # sound design
    place(rotor(0.05, 2.55), 0.05, 1.0, pan=0.2, rev=0.12)
    place(whoosh(0.45), -0.05, 0.6, pan=0.25)
    place(impact(1.0, 0.4), 0.4, 0.5, rev=0.3)
    for a0, a1 in [(1.1, 2.0), (4.62, 5.1), (8.95, 9.5), (11.6, 13.0)]:
        place(riser(a1 - a0, 9000 if a1 == 13.0 else 7000), a0, 0.5 if a1 == 13.0 else 0.38, rev=0.25)
    for at, big in [(2.0, 0.8), (5.1, 0.7), (9.5, 0.7), (13.0, 1.2)]:
        place(impact(2.2 if at == 13.0 else 1.6, big), at, 1.0 if at == 13.0 else 0.75, rev=0.55)
    place(whoosh(0.5), 1.98, 0.55, pan=-0.3)  # the drone punches out, up and left
    place(whoosh(0.5), 4.62, 0.55, pan=0.6)
    place(whoosh(0.55), 8.95, 0.55, pan=-0.6)
    for k in range(11):  # letters printing as the head passes under them
        place(tick(3800 + 90 * k), 2.08 + k * 0.045, 0.22, pan=-0.3 + 0.06 * k)
    place(bell(1318.5, 1.2, 0.6), 3.3, 0.32, pan=0.3, rev=0.4)  # the full stop
    for f, at in zip([659.25, 783.99, 880.0], HEAD["cues"]["ticks"]):
        place(bell(f, 1.6), at, 0.42, rev=0.5)
    for at in [5.05, 6.3, 7.65, 9.55, 10.7, 11.7]:  # station titles
        for j in range(3):
            place(tick(5200), at + j * 0.06, 0.16, pan=-0.5)
    for c0, c1, steps in [(6.4, 7.3, 18), (7.75, 8.55, 14)]:  # counters
        for j in range(steps):
            u = (j / steps) ** 1.8
            place(tick(4600), c0 + (c1 - c0) * u, 0.12, pan=-0.4)
    for at in HEAD["cues"]["merges"]:  # merges land
        place(bell(1760.0, 0.7), at, 0.25, pan=0.5, rev=0.35)
        place(tick(2600), at, 0.3, pan=0.5)
    place(scratch(13.75, 14.5), 13.75, 0.75, pan=0.35, rev=0.1)  # the pen
    place(bell(880.0, 2.2, 0.8), 14.5, 0.3, rev=0.6)


def master():
    n = int(2.0 * SR)
    t = ta(n)
    irl = rng.standard_normal(n) * np.exp(-t * 3.2)
    irr = rng.standard_normal(n) * np.exp(-t * 3.2)
    irl[: int(0.012 * SR)] = 0
    irr[: int(0.017 * SR)] = 0
    wet = lp(SEND, 5500)
    l = L + fftconvolve(wet, irl)[:N] * 0.02
    r = R + fftconvolve(wet, irr)[:N] * 0.02
    st = np.stack([l, r])
    st = hp(st, 28)
    st = np.tanh(st * 1.2) / np.tanh(1.2)
    fade = int(0.35 * SR)
    st[:, -fade:] *= np.linspace(1, 0, fade) ** 1.6
    st /= np.max(np.abs(st)) / 10 ** (-4.1 / 20)  # lands near -14 LUFS integrated
    return st.T


def write(path, st):
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    data = pcm.tobytes()
    with open(path, "wb") as f:
        f.write(b"RIFF" + (36 + len(data)).to_bytes(4, "little") + b"WAVE")
        f.write(b"fmt " + (16).to_bytes(4, "little") + (1).to_bytes(2, "little") + (2).to_bytes(2, "little"))
        f.write(SR.to_bytes(4, "little") + (SR * 4).to_bytes(4, "little") + (4).to_bytes(2, "little") + (16).to_bytes(2, "little"))
        f.write(b"data" + len(data).to_bytes(4, "little") + data)


if __name__ == "__main__":
    build()
    write(sys.argv[1] if len(sys.argv) > 1 else "one-loop-score.wav", master())
