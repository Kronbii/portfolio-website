"""ARMED — score and sound design, composed to the cut.

    python3 audio/score.py audio/score.wav

Synthesized (numpy/scipy), no samples. 128 BPM, D minor, eight bars. The
drone's motor is an instrument (its pitch follows the simulated throttle in
assets/js/core.js), the step responses in TUNE are sonified (pitch follows
the response, so the ringing is heard settling), and the swarm in FLY is a
chord of 36 detuned rotor voices.
"""
import sys

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 15.0
N = int(DUR * SR)
BPM = 128
B = 60 / BPM
BAR = 4 * B
rng = np.random.default_rng(128)

L = np.zeros(N)
R = np.zeros(N)
SEND = np.zeros(N)
DUCK = np.ones(N)


def beat(n):
    return n * B


def ta(n):
    return np.arange(n) / SR


def place(sig, at, gain=1.0, pan=0.0, rev=0.0, duck=False):
    i = int(round(at * SR))
    if i >= N or len(sig) == 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = np.asarray(sig[: N - i]) * gain
    if duck:
        sig = sig * DUCK[i : i + len(sig)]
    if np.ndim(pan) == 0:
        a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    else:
        a = (np.clip(pan[: len(sig)], -1, 1) + 1) * np.pi / 4
    L[i : i + len(sig)] += sig * np.cos(a)
    R[i : i + len(sig)] += sig * np.sin(a)
    SEND[i : i + len(sig)] += sig * rev


def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [max(20, lo), min(SR / 2 - 100, hi)], btype="band", fs=SR, output="sos"), x)


def lp(x, f, o=2):
    return sosfilt(butter(o, min(f, SR / 2 - 100), btype="low", fs=SR, output="sos"), x)


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


def sweep_filter(x, f0, f1, width=0.6, blk=512):
    """band-pass whose centre glides geometrically from f0 to f1"""
    n = len(x)
    out = np.zeros(n)
    for s in range(0, n, blk):
        c = f0 * (f1 / f0) ** (s / max(1, n - 1))
        out[s : s + blk] = bp(x[s : s + blk], c * (1 - width), c * (1 + width))
    return out


NOTE = {"D1": 36.71, "F1": 43.65, "G1": 49.0, "A1": 55.0, "Bb0": 29.14, "Bb1": 58.27, "C2": 65.41, "D2": 73.42}
# bar → (bass root, chord tones in Hz)
CH = {
    "Dm": ("D1", [146.83, 174.61, 220.0, 293.66]),
    "Bb": ("Bb1", [116.54, 146.83, 174.61, 233.08]),
    "F": ("F1", [174.61, 220.0, 261.63, 349.23]),
    "C": ("C2", [130.81, 164.81, 196.0, 261.63]),
    "A": ("A1", [138.59, 164.81, 220.0, 277.18]),
    "Dm9": ("D1", [146.83, 174.61, 220.0, 261.63, 329.63]),
    "Bbmaj9": ("Bb1", [116.54, 146.83, 174.61, 220.0, 261.63]),
}
PROG = [  # (start, end, chord)
    (2 * BAR, 3 * BAR, "Dm"),
    (3 * BAR, 4 * BAR, "Bb"),
    (4 * BAR, 5 * BAR, "F"),
    (5 * BAR, 5 * BAR + 2 * B, "C"),
    (5 * BAR + 2 * B, 6 * BAR, "A"),
    (6 * BAR, 7 * BAR, "Dm9"),
    (7 * BAR, 8 * BAR, "Bbmaj9"),
]


def chord_at(t):
    for a, b, c in PROG:
        if a <= t < b:
            return CH[c]
    return CH["Dm"]


# ------------------------------------------------------------- instruments
def kick(punch=1.0):
    n = int(0.45 * SR)
    t = ta(n)
    body = osc_sin(50 + 150 * np.exp(-t * 34)) * np.exp(-t * 7.5)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t * 500) * 0.35 * punch
    return np.tanh(2.0 * (body + click))


def snare():
    n = int(0.3 * SR)
    t = ta(n)
    tone = osc_sin(190 * np.exp(-t * 3) + 0) * np.exp(-t * 28) * 0.5
    noise = bp(rng.standard_normal(n), 1200, 9000) * np.exp(-t * 18)
    return np.tanh(1.6 * (tone + noise * 0.8))


def clap():
    n = int(0.3 * SR)
    t = ta(n)
    e = np.zeros(n)
    for k, d in enumerate([0, 0.008, 0.017, 0.024]):
        i = int(d * SR)
        e[i:] += np.exp(-t[: n - i] * (80 if k < 3 else 16))
    return bp(rng.standard_normal(n), 900, 6000) * e * 0.6


def hat(open_=False):
    n = int((0.2 if open_ else 0.05) * SR)
    return hp(rng.standard_normal(n), 7000, 4) * np.exp(-ta(n) * (18 if open_ else 95)) * 0.5


def tick(f=4200, n_ms=18):
    n = int(n_ms / 1000 * SR)
    t = ta(n)
    return (hp(rng.standard_normal(n), 3000) * 0.6 + osc_sin(np.full(n, f)) * 0.5) * np.exp(-t * 360)


def blip(f, length=0.06, k=60):
    n = int(length * SR)
    t = ta(n)
    return (osc_sin(np.full(n, f)) + 0.3 * np.sign(osc_sin(np.full(n, f)))) * np.exp(-t * k) * np.minimum(1, t / 0.001) * 0.4


def bell(f, length=1.6, bright=1.0):
    n = int(length * SR)
    t = ta(n)
    s = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a, d in [(1, 1, 2.6), (2.0, 0.42 * bright, 4.5), (3.01, 0.2 * bright, 7), (4.2, 0.08 * bright, 11)])
    return s * np.minimum(1, t / 0.002) * 0.5


def impact(length=1.8, big=1.0):
    n = int(length * SR)
    t = ta(n)
    boom = osc_sin(32 + 90 * np.exp(-t * 7)) * np.exp(-t * 2.2)
    crack = bp(rng.standard_normal(n), 300, 8000) * np.exp(-t * 16) * 0.55 * big
    sub = osc_sin(np.full(n, 36.71)) * np.exp(-t * 1.4) * 0.3 * big
    return np.tanh(1.6 * (boom + crack + sub))


def riser(length, top=9000, tone=True):
    n = int(length * SR)
    k = ta(n) / length
    out = sweep_filter(rng.standard_normal(n), 250, top, 0.4, 1024)
    s = out * 0.8
    if tone:
        s = s + osc_saw(110 * 2 ** (3 * k)) * 0.12
    return s * k**2.2


def whoosh(length=0.5, lo=400, hi=5200):
    n = int(length * SR)
    k = ta(n) / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 512
    for s in range(0, n, blk):
        c = lo + (hi - lo) * np.sin(np.pi * k[s])
        out[s : s + blk] = bp(noise[s : s + blk], c * 0.5, c * 1.6)
    return out * np.sin(np.pi * k) ** 2 * 0.8


def reverse_swell(length=0.45):
    n = int(length * SR)
    t = ta(n)
    s = hp(rng.standard_normal(n), 1500) * (t / length) ** 3
    return s * 0.6


def shutter():
    a = tick(5200, 12) * 1.2
    b = tick(3800, 14)
    gap = np.zeros(int(0.035 * SR))
    return np.concatenate([a, gap, b])


def reese(f, length, cutoff=520):
    n = int(length * SR)
    ff = np.full(n, f)
    s = osc_saw(ff, 0.0) + osc_saw(ff * 1.009, 0.33) + osc_saw(ff * 0.993, 0.71)
    s = np.tanh(1.8 * s / 3) + 0.6 * osc_sin(ff)
    return lp(s, cutoff, 4) * env(n, 0.004, 3.5)


def stab(tones, length=0.4, cutoff=3200):
    n = int(length * SR)
    s = sum(osc_saw(np.full(n, f * 2 * 2 ** (d / 1200)), rng.random()) for f in tones for d in (-9, 0, 9))
    return lp(s / (3 * len(tones)), cutoff) * env(n, 0.003, 7)


def pad(tones, length, cutoff=1400):
    n = int(length * SR)
    s = sum(osc_saw(np.full(n, f * 2 ** (d / 1200)), rng.random()) for f in tones for d in (-8, 0, 8))
    e = np.minimum(1, ta(n) / 0.25) * np.clip((length - ta(n)) / 0.4, 0, 1)
    return lp(s / (3 * len(tones)), cutoff) * e


def scratch(length):
    n = int(length * SR)
    t = ta(n)
    stroke = lp(np.abs(np.sin(2 * np.pi * 6.5 * t)) ** 0.6 * (0.6 + 0.4 * rng.random(n)), 40)
    return bp(rng.standard_normal(n), 2500, 9500) * stroke * 0.32


# ------------------------------------------------- the motor (follows core.js)
ARM_T = B


def throttle(t):
    if t < ARM_T:
        return 0.0
    if t < beat(2):
        return 0.14
    if t < beat(3):
        u = (t - beat(2)) / (beat(3) - beat(2))
        return 0.14 + (0.58 - 0.14) * (1 - (1 - u) ** 3)
    if t < 1.72:
        return 0.58 + 0.12 * (t - beat(3)) / (1.72 - beat(3))
    if t < BAR:
        return 1.0
    if t < beat(5):
        return 0.78 - 0.16 * (t - BAR) / (beat(5) - BAR)
    if t < 2.72:
        return 0.9
    if t < 2 * BAR:
        return 0.66 + 0.29 * (t - 2.72) / (2 * BAR - 2.72)
    return 0.0


def motor(t0, t1, pan=None):
    tt = np.arange(int(t0 * SR), int(t1 * SR)) / SR
    thr = np.array([throttle(x) for x in tt])
    thr = np.convolve(thr, np.ones(240) / 240, mode="same")
    rate = np.where(thr > 0, 18 + thr * 150, 0)
    f = 70 + rate * 3.4
    whine = osc_saw(f) * 0.5 + osc_saw(f * 2.003) * 0.25 + osc_sin(f * 3.01) * 0.2
    chop = 0.6 + 0.4 * np.sin(np.cumsum(rate * 2) / SR)  # two blades
    air = lp(rng.standard_normal(len(tt)), 1800) * 0.35
    level = np.clip(thr * 1.4, 0, 1) ** 0.7
    sig = (lp(whine * chop, 3200) + air) * level
    return sig


# ------------------------------------------------- the sonified step responses
def step_response(z, tau):
    wd = np.sqrt(1 - z * z)
    return 1 - np.exp(-z * tau) * (np.cos(wd * tau) + (z / wd) * np.sin(wd * tau))


def pid_voice(z, length):
    n = int(length * SR)
    t = ta(n)
    y = step_response(z, np.maximum(0, t - 0.004) * 52)
    f = 330 * 2 ** (y * 1.0)  # an octave per unit: the overshoot is heard as pitch
    s = osc_sin(f) + 0.35 * osc_sin(f * 2) + 0.12 * np.sign(osc_sin(f))
    return s * env(n, 0.002, 2.5) * 0.38


# ---------------------------------------------------------------- arrange
def build():
    # ---- intro: boot, arm, spool, lift, punch (bar 1)
    for k in range(6):
        place(blip(1800 + 260 * k, 0.04, 90), 0.02 + k * 0.03, 0.22, pan=-0.6 + 0.24 * k)
    place(osc_sin(np.full(int(1.9 * SR), 36.71)) * np.minimum(1, ta(int(1.9 * SR)) / 0.4) * 0.25, 0.0, 0.35)
    place(shutter(), ARM_T - 0.005, 0.9, pan=0.1)
    place(impact(1.4, 0.7), ARM_T, 0.7, rev=0.4)
    place(bell(587.33, 1.2, 0.9), ARM_T, 0.25, pan=0.3, rev=0.5)
    m = motor(ARM_T, 2 * BAR)
    pan1 = np.concatenate([
        np.full(int((BAR - ARM_T) * SR), 0.25),
        np.linspace(-0.9, 0.0, int((beat(5) - BAR) * SR)),
        0.0 + 0.8 * np.sin(np.linspace(0, 2 * np.pi, int((2.76 - beat(5)) * SR))),
        np.zeros(len(m)),
    ])[: len(m)]
    place(m, ARM_T, 0.2, pan=pan1, rev=0.08)
    place(whoosh(0.45, 300, 3800), beat(2) - 0.05, 0.45, pan=-0.3)
    place(kick(0.6), beat(3), 0.55)
    place(whoosh(0.32, 800, 7000), 1.7, 0.6, pan=0.4)
    place(riser(1.3, 7000), 0.55, 0.16, rev=0.3)
    # ---- bar 2: fly-in, flip, lock, dive, vacuum
    place(impact(1.2, 0.5), BAR, 0.55, rev=0.4)
    place(whoosh(0.55, 300, 4500), BAR - 0.05, 0.6, pan=np.linspace(-0.9, 0.2, int(0.55 * SR)))
    place(whoosh(0.42, 600, 6500), beat(5), 0.55, pan=np.linspace(0.7, -0.7, int(0.42 * SR)))
    for k in range(4):
        place(tick(5400, 16), beat(6) + 0.12 + 0.02 * k, 0.4, pan=[-0.7, 0.7, -0.7, 0.7][k])
    for k in range(5):
        place(blip(2400, 0.035, 120), beat(6) + 0.3 + k * 0.05, 0.25)
    for k, at in enumerate(np.arange(beat(6), 3.7, B / 4)):
        place(snare(), at, 0.12 + 0.25 * k / 8, pan=0.05)
    for at in np.arange(beat(7), 3.68, B / 8):
        place(snare(), at, 0.32, pan=-0.05)
    place(riser(1.2, 11000), 2.5, 0.5, rev=0.3)
    place(reverse_swell(0.3), 3.42, 0.6)
    place(kick(), beat(4), 0.7)
    place(kick(), beat(6), 0.6)
    # the vacuum: everything cuts for the last 50 ms before the drop (handled in master)

    # ---- the drop: kick, clap, hats, reese, stabs (bars 3–7)
    drums_from, drums_to = 2 * BAR, 7 * BAR
    kicks = [beat(n) for n in range(8, 28)]
    kicks += [beat(20) + B / 2, beat(21) + B / 2]  # HEAT: double-time
    for b in kicks:
        i = int(b * SR)
        n = int(0.3 * SR)
        DUCK[i : i + n] = np.minimum(DUCK[i : i + n], 1 - 0.6 * np.exp(-ta(min(n, N - i)) * 10))
    for b in kicks:
        place(kick(), b, 0.72, rev=0.03)
    for n in range(9, 28, 2):
        place(clap(), beat(n), 0.62, 0.05, rev=0.22)
        place(snare(), beat(n), 0.25, -0.05)
    for k, h in enumerate(np.arange(drums_from, drums_to, B / 2)):
        if k % 2 == 1:
            place(hat(open_=(k % 8 == 7)), h, 0.45, 0.3)
    for h in np.arange(4 * BAR, drums_to, B / 4):
        if int(round(h / (B / 4))) % 2 == 1:
            place(hat(), h, 0.22, -0.35)
    # bass: reese on the root, syncopated 8ths, ducked
    pattern = [0, 0.5, 0.75, 1.5, 2, 2.5, 3, 3.5]
    for a, b, c in PROG[:-1]:
        root = NOTE[CH[c][0]] * 2  # an octave up, so the line reads on small speakers
        for bar0 in np.arange(a, b - 1e-6, BAR):
            for p in pattern:
                at = bar0 + p * B
                if at >= b:
                    continue
                oct2 = 2 if p in (0.75, 2.5) else 1
                place(reese(root * oct2, B * 0.45, 950), at, 0.3, duck=True)
    # stabs on the downbeats of each section
    for at, c in [(2 * BAR, "Dm"), (beat(9), "Dm"), (3 * BAR, "Bb"), (4 * BAR, "F"), (5 * BAR, "C"), (5 * BAR + 2 * B, "A"), (6 * BAR, "Dm9")]:
        place(stab(CH[c][1], 0.45, 4200), at, 0.34, rev=0.35)
    # pads under the cut
    for a, b, c in PROG[:-1]:
        place(pad(CH[c][1], b - a + 0.2, 1800), a, 0.2, rev=0.4, duck=True)

    # ---- bar 3: the drop, the name
    place(impact(2.2, 1.3), 2 * BAR, 1.0, rev=0.6)
    place(osc_sin(36.71 * np.exp(-ta(int(1.2 * SR)) * 1.2)) * np.exp(-ta(int(1.2 * SR)) * 2.0), 2 * BAR, 0.7)
    place(impact(1.0, 0.6), beat(9), 0.55, rev=0.3)
    place(whoosh(0.3, 900, 7000), beat(9) - 0.04, 0.5, pan=np.linspace(0.8, -0.2, int(0.3 * SR)))
    for k in range(4):
        place(tick(4800, 16), beat(10) + 0.02 * k, 0.35, pan=[-0.6, 0.6, -0.6, 0.6][k])
    for k in range(18):  # the decode
        place(blip(900 + 140 * (k % 7), 0.03, 140), beat(10) + k * 0.022, 0.16, pan=-0.4 + 0.05 * k)
    for k in range(4):  # chapter chips on sixteenths
        place(tick(3600 + 300 * k, 20), beat(11) + k * B / 4, 0.4, pan=0.4)
    place(whoosh(0.22, 800, 8000), 2 * BAR + BAR - 0.16, 0.55, pan=np.linspace(0.2, -0.9, int(0.22 * SR)))

    # ---- bar 4: SEE, one pass per beat
    place(impact(1.2, 0.6), 3 * BAR, 0.55, rev=0.35)
    for k in range(4):
        place(shutter(), 3 * BAR + k * B, 0.55, pan=0.45)
    place(whoosh(0.24, 2000, 9000) * 0.8, beat(13), 0.5, pan=np.linspace(0.6, 0.6, int(0.24 * SR)))  # the scan
    for k in range(32):  # features pop as a radial wave
        place(blip(2600 + 900 * ((k * 7) % 5), 0.025, 160), beat(14) + 0.008 * k, 0.12, pan=0.2 + 0.6 * ((k * 5) % 7) / 6)
    for k in range(4):
        place(tick(5800, 14), beat(15) + 0.02 * k, 0.4, pan=0.5)
    place(bell(880, 0.8, 0.5), beat(15) + 0.1, 0.2, pan=0.5, rev=0.4)
    place(riser(0.3, 12000, tone=False), 4 * BAR - 0.3, 0.55)

    # ---- bar 5: MAP
    place(impact(1.2, 0.7), 4 * BAR, 0.6, rev=0.4)
    for k in range(24):  # the frames fan in
        place(tick(2200 + 60 * k, 10), beat(17) + 0.006 * k, 0.22, pan=-0.9 + 0.075 * k)
    for k in range(14):  # counter
        place(blip(1400, 0.02, 200), beat(17) + 0.42 * (k / 14) ** 0.5, 0.12, pan=0.6)
    place(sweep_filter(rng.standard_normal(int(0.55 * SR)), 300, 6000, 0.35) * np.sin(np.linspace(0, np.pi, int(0.55 * SR))) ** 2, 8.42, 0.7)  # the curl
    spin_n = int((5 * BAR - 8.9) * SR)
    sp = whoosh((5 * BAR - 8.9), 600, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(np.linspace(6, 28, spin_n)) / SR))
    place(sp, 8.9, 0.6, pan=0.3 * np.sin(np.linspace(0, 14, spin_n)))
    place(impact(0.8, 0.5), beat(19), 0.4, rev=0.3)
    # glitch out: stutter the last 8th
    place(np.tile(bp(rng.standard_normal(int(0.03 * SR)), 1000, 8000) * 0.5, 3), 5 * BAR - 0.09, 0.6)

    # ---- bar 6a: HEAT
    place(impact(1.0, 0.8), 5 * BAR, 0.6, rev=0.3)
    crunch = np.round(rng.standard_normal(int(0.25 * SR)) * 3) / 3
    place(sweep_filter(crunch, 600, 7000, 0.5) * np.linspace(1, 0.2, len(crunch)), beat(21), 0.5, pan=np.linspace(-0.7, 0.7, len(crunch)))
    place(bell(1174.66, 0.6, 0.6), beat(21) + 0.2, 0.2, rev=0.3)

    # ---- bar 6b: TUNE, the responses are heard
    place(tick(1200, 30) * 1.4, beat(22), 0.6)  # scope on
    for k, z in enumerate([0.06, 0.16, 0.36, 0.72]):
        length = B / 4 if k < 3 else 0.6
        place(pid_voice(z, length), beat(22) + k * B / 4, 0.55, pan=-0.3 + 0.2 * k, rev=0.15)
    place(bell(1318.5, 0.9, 0.5), beat(23), 0.25, pan=0.5, rev=0.4)
    place(riser(0.4, 12000), 6 * BAR - 0.4, 0.6)

    # ---- bar 7: FLY, the swarm sings
    place(impact(2.0, 1.2), 6 * BAR, 0.95, rev=0.6)
    tones = CH["Dm9"][1] + [293.66, 440.0]
    nsw = int((BAR + 0.1) * SR)
    swarm = np.zeros(nsw)
    swR = np.zeros(nsw)
    swL = np.zeros(nsw)
    for i in range(36):
        f = tones[i % len(tones)] * 2 ** ((rng.random() - 0.5) * 0.12 / 12)
        vib = 1 + 0.004 * np.sin(2 * np.pi * (5 + rng.random() * 3) * ta(nsw) + rng.random() * 6)
        v = osc_saw(np.full(nsw, f) * vib, rng.random()) * (0.6 + 0.4 * np.sin(2 * np.pi * (11 + rng.random() * 9) * ta(nsw)))
        p = (i / 35) * 2 - 1
        a = (p + 1) * np.pi / 4
        swL += v * np.cos(a)
        swR += v * np.sin(a)
    e = np.minimum(1, ta(nsw) / 0.35) * np.clip((BAR + 0.1 - ta(nsw)) / 0.25, 0, 1)
    swL = lp(swL / 36, 2400) * e
    swR = lp(swR / 36, 2400) * e
    i0 = int(6 * BAR * SR)
    L[i0 : i0 + nsw] += swL * 0.55
    R[i0 : i0 + nsw] += swR * 0.55
    SEND[i0 : i0 + nsw] += (swL + swR) * 0.15
    for n in (25, 26):
        place(impact(0.9, 0.5), beat(n), 0.5, rev=0.3)
    place(shutter(), beat(27), 0.7)
    place(bell(1174.66, 1.0, 0.8), beat(27) + 0.02, 0.3, pan=-0.4, rev=0.5)
    place(whoosh(0.4, 500, 9000), 12.85, 0.85, pan=np.linspace(-0.6, 0.6, int(0.4 * SR)), rev=0.2)  # the swarm breaks past

    # ---- bar 8: SIGN
    place(impact(2.6, 1.3), 7 * BAR, 1.0, rev=0.7)
    place(kick(), 7 * BAR, 0.9)
    final = pad(CH["Bbmaj9"][1] + [293.66], 1.95, 2600)
    place(final, 7 * BAR, 0.3, rev=0.6)
    place(reese(NOTE["Bb1"] * 2, 1.6, 700), 7 * BAR, 0.36)
    place(scratch(0.5), beat(29), 0.75, pan=0.35, rev=0.1)  # the signature
    place(bell(587.33, 1.6, 0.9), beat(30), 0.35, rev=0.6)
    place(bell(880.0, 1.4, 0.7), beat(30) + 0.004, 0.2, rev=0.6)
    place(whoosh(0.45, 800, 8000), beat(31) - 0.02, 0.6, pan=np.linspace(0.4, 0.9, int(0.45 * SR)))
    tt = ta(int(0.45 * SR))
    place(osc_saw(560 + 900 * (tt / 0.45) ** 2) * np.sin(np.pi * tt / 0.45) * 0.08, beat(31), 0.6, pan=0.8)  # the hero punches out


def master():
    n = int(2.2 * SR)
    t = ta(n)
    irl = rng.standard_normal(n) * np.exp(-t * 3.0)
    irr = rng.standard_normal(n) * np.exp(-t * 3.0)
    irl[: int(0.011 * SR)] = 0
    irr[: int(0.016 * SR)] = 0
    wet = lp(SEND, 6000)
    l = L + fftconvolve(wet, irl)[:N] * 0.02
    r = R + fftconvolve(wet, irr)[:N] * 0.02
    st = np.stack([l, r])
    st = hp(st, 25)
    # the vacuum before the drop: 50 ms of near silence
    v0, v1 = int((2 * BAR - 0.05) * SR), int(2 * BAR * SR)
    st[:, v0:v1] *= np.linspace(0.15, 0.02, v1 - v0)
    st = np.tanh(st * 1.25) / np.tanh(1.25)
    fade = int(0.3 * SR)
    st[:, -fade:] *= np.linspace(1, 0, fade) ** 1.5
    return st


PEAK_DB = float(sys.argv[2]) if len(sys.argv) > 2 else -5.6  # lands near -14 LUFS integrated


def write(path, st):
    st = st / (np.max(np.abs(st)) / 10 ** (PEAK_DB / 20))
    pcm = (np.clip(st.T, -1, 1) * 32767).astype("<i2")
    data = pcm.tobytes()
    with open(path, "wb") as f:
        f.write(b"RIFF" + (36 + len(data)).to_bytes(4, "little") + b"WAVE")
        f.write(b"fmt " + (16).to_bytes(4, "little") + (1).to_bytes(2, "little") + (2).to_bytes(2, "little"))
        f.write(SR.to_bytes(4, "little") + (SR * 4).to_bytes(4, "little") + (4).to_bytes(2, "little") + (16).to_bytes(2, "little"))
        f.write(b"data" + len(data).to_bytes(4, "little") + data)


if __name__ == "__main__":
    build()
    write(sys.argv[1] if len(sys.argv) > 1 else "score.wav", master())
