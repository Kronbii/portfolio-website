"""Frame 8 (TRACE): the fine-crack toolkit's pipeline, run as a visualisation
on the repository's own pre-segmented mask (assets/img/crack-mask.png).

    python3 assets/data/crack.py

Mask → skeleton (Zhang–Suen thinning) → candidate points → an order (minimum
spanning tree, one of the toolkit's ordering strategies) → a smoothed curve
along the main run. Writes assets/img/crack-ink.png (the mask in ink, cropped
to the plate) and assets/data/crack.json (points, tree edges in DFS order,
main path, smoothed curve), all in plate pixels.
"""
import json

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.sparse.csgraph import minimum_spanning_tree, depth_first_order, shortest_path
from scipy.spatial.distance import cdist

PLATE = (470, 944)  # plate size on screen
CROP = (60, 0, 1080, 2048)  # region of the 2448×2048 mask holding the crack

src = np.asarray(Image.open("assets/img/crack-mask.png").convert("RGB"))
mask = (src[..., 0] > 128).astype(np.uint8)
mask = mask[CROP[1] : CROP[3], CROP[0] : CROP[2]]
H, W = mask.shape
sx, sy = PLATE[0] / W, PLATE[1] / H
s = min(sx, sy)

# ink plate image
ink = np.zeros((H, W, 4), np.uint8)
ink[..., :3] = (251, 245, 234)
ink[..., 3] = mask * 255
im = Image.fromarray(ink, "RGBA").resize((round(W * s), round(H * s)), Image.LANCZOS)
plate = Image.new("RGBA", PLATE, (0, 0, 0, 0))
ox, oy = (PLATE[0] - im.width) // 2, (PLATE[1] - im.height) // 2
plate.paste(im, (ox, oy))
plate.save("assets/img/crack-ink.png")

# thinning at a working scale
k = 4
small = ndi.zoom(mask.astype(float), 1 / k, order=1) > 0.3
img = np.pad(small.astype(np.uint8), 1)


def zhang_suen(img):
    img = img.copy()
    changed = True
    while changed:
        changed = False
        for step in (0, 1):
            P = [np.roll(np.roll(img, dy, 0), dx, 1) for dy, dx in [(1, 0), (1, -1), (0, -1), (-1, -1), (-1, 0), (-1, 1), (0, 1), (1, 1)]]
            # P2..P9 clockwise from north: north is roll(+1) on rows
            p2, p3, p4, p5, p6, p7, p8, p9 = P
            B = sum(P)
            seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            A = sum(((seq[i] == 0) & (seq[i + 1] == 1)).astype(int) for i in range(8))
            if step == 0:
                c = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                c = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            rm = (img == 1) & (B >= 2) & (B <= 6) & (A == 1) & c
            if rm.any():
                img[rm] = 0
                changed = True
    return img


sk = zhang_suen(img)[1:-1, 1:-1]
ys, xs = np.nonzero(sk)
pts = np.stack([xs, ys], 1).astype(float) * k + k / 2  # back to crop pixels
# candidate points: thin to roughly even spacing
keep = []
for p in pts[np.argsort(pts[:, 1])]:
    if all(np.hypot(*(p - q)) > 26 for q in keep[-40:]):
        keep.append(p)
P = np.array(keep)
D = cdist(P, P)
T = minimum_spanning_tree(D).toarray()
T = T + T.T
start = int(np.argmin(P[:, 1]))
order, pred = depth_first_order(T > 0, start, directed=False, return_predecessors=True)
edges = [[int(pred[i]), int(i)] for i in order[1:]]
# main run: tree path from the top to the farthest point
dist, preds = shortest_path(np.where(T > 0, T, 0), directed=False, indices=start, return_predecessors=True)
end = int(np.argmax(np.where(np.isfinite(dist), dist, -1)))
path = [end]
while path[-1] != start:
    path.append(int(preds[path[-1]]))
path = path[::-1]
main = P[path]
# smooth: moving average, then resample
pad = np.pad(main, ((3, 3), (0, 0)), mode="edge")
sm = np.stack([np.convolve(pad[:, d], np.ones(7) / 7, mode="valid") for d in (0, 1)], 1)


def to_plate(a):
    return [[round(float(x * s + ox), 1), round(float(y * s + oy), 1)] for x, y in a]


out = {
    "plate": PLATE,
    "points": to_plate(P),
    "order": [int(i) for i in order],
    "edges": edges,
    "main": [int(i) for i in path],
    "curve": to_plate(sm),
}
json.dump(out, open("assets/data/crack.json", "w"))
print(len(P), "points", len(edges), "edges", len(path), "on the main run", "plate", PLATE, "ink", im.size)
