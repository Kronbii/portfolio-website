"""Vision passes for frame 4 (SEE), computed from the real race-car photo.

    python3 assets/data/vision.py

Writes assets/img/race-crop.jpg (the 900×900 plate), assets/img/race-edges.png
(Sobel magnitude in ink, alpha-keyed) and assets/data/race-features.json (the
150 strongest Harris corners, plus the lock box drawn around the vehicle).
"""
import json

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

TOP = 180  # crop row in the 1200×1600 source
BOX = [40, 140, 780, 800]  # lock box around the vehicle, plate pixels

src = Image.open("assets/img/race-front.jpg").convert("RGB")
crop = src.crop((0, TOP, 1200, TOP + 1200)).resize((900, 900), Image.LANCZOS)
crop.save("assets/img/race-crop.jpg", quality=92)

g = np.asarray(crop.convert("L")).astype(float) / 255
gs = ndi.gaussian_filter(g, 1.2)
sx, sy = ndi.sobel(gs, 1), ndi.sobel(gs, 0)
mag = np.clip(np.hypot(sx, sy) / np.percentile(np.hypot(sx, sy), 99.3), 0, 1)
alpha = np.clip((mag - 0.18) / 0.5, 0, 1) ** 0.8
rgba = np.zeros((900, 900, 4), np.uint8)
rgba[..., :3] = (251, 245, 234)
rgba[..., 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save("assets/img/race-edges.png")

Ixx = ndi.gaussian_filter(sx * sx, 2)
Iyy = ndi.gaussian_filter(sy * sy, 2)
Ixy = ndi.gaussian_filter(sx * sy, 2)
R = (Ixx * Iyy - Ixy**2) - 0.05 * (Ixx + Iyy) ** 2
peaks = np.argwhere((R == ndi.maximum_filter(R, size=25)) & (R > np.percentile(R, 99.0)))
vals = R[peaks[:, 0], peaks[:, 1]]
order = np.argsort(-vals)[:150]
feats = [{"x": int(peaks[i][1]), "y": int(peaks[i][0]), "s": round(float(vals[i] / vals[order[0]]), 3)} for i in order]
json.dump({"size": 900, "crop": [0, TOP, 1200, 1200], "features": feats, "box": BOX}, open("assets/data/race-features.json", "w"))
print(len(feats), "features")
