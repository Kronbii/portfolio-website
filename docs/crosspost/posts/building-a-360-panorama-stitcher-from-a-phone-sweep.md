---
title: "Building a 360° panorama stitcher from a phone sweep"
description: "A phone video, a pure-rotation camera model, and a stubborn question: how much of a 360° reconstruction pipeline can be made explicit instead of hidden behind a stitching API?"
canonical_url: https://ramikronbi.com/writing/building-a-360-panorama-stitcher-from-a-phone-sweep
cover_image: https://ramikronbi.com/images/authority/spherical-panorama/pano-on-band.jpg
tags: computervision, robotics, opensource
published: false
---
A panorama looks simple only after it works. Before that, it is a chain of small geometric errors. A few bad correspondences tilt the camera estimate. A fraction of a degree of pitch error accumulates into a staircase along a ceiling. A handheld step sideways introduces parallax that no homography can honestly explain.

I built this pipeline to make that chain visible. It accepts a phone video or a folder of stills and produces an equirectangular panorama plus a self-contained Three.js viewer. The implementation is CPU-only Python and OpenCV. There is no gyroscope dependency and no opaque “stitch” call doing the whole job.

### The pipeline is eight decisions, not one algorithm

Frames are extracted from video by interval, count, frame rate, or measured motion. Camera intrinsics come from EXIF when possible, then fall back to an explicit field of view or calibration file. Adjacent frames are matched with ORB features, Lowe’s ratio test, and RANSAC. If an adjacent pair fails, the matcher tries across the gap and interpolates the missing step instead of silently discarding the frame.

The useful part begins after the homography. Under a pure-rotation model, the relative camera rotation is recovered with R = K⁻¹HK. Numerical noise means that matrix is rarely a perfect rotation, so singular-value decomposition projects it back onto the rotation manifold before the estimates are chained into global orientations.

Each source frame is then inverse-warped onto an equirectangular canvas: an output pixel becomes a world direction, that direction is rotated into the camera, projected onto the image plane, and sampled. Overlaps can be blended in several ways, and unseen regions can be filled, with the important caveat that filling is not reconstruction.

### The straight line that exposed the real problem

On the sample run, independent pairwise estimates left only small pitch and roll errors. They were still enough to turn long architectural edges into a visible staircase. A moving average over the chained rotations reduced pitch wobble by 13.5× and roll wobble by 5.2× on that run.

That fix is deliberately modest. It does not replace global bundle adjustment or close the loop around a full sweep. It solves the instability that was actually visible while keeping the pipeline easy to inspect.

### What the sample run says—and what it does not

The sample used 309 phone-video frames and recovered a 333° sweep. Median RANSAC support was 921 inliers per adjacent pair; 15 of 308 pairs were recovered through interpolation. At 4096 × 2048, the full run took about two minutes on a Ryzen 7 5800H, including roughly 19 seconds of feature matching and 96 seconds of warping.

Only 36.9% of the sphere had actually been photographed. A phone-height horizontal sweep sees a band around the viewer, not the floor and ceiling. The missing poles can be inpainted, but that is filling, not captured detail.

The other limit is parallax. The model assumes the phone rotates around its optical center. Translate while sweeping past a nearby object and the scene no longer has a single homography. Blank walls and repeated textures also weaken matching. There is no bundle adjustment or exposure matching in the current version, so drift and brightness changes are still on the list.

The result is useful because it is inspectable. Every stage has a module, the run records its resolved configuration and intrinsics, more than 200 tests cover the pipeline, and the browser viewer makes the final geometry tangible. It is less a magic panorama button than a working map of the decisions behind one.

## Links

- [GitHub — 360-spherical-stitching](https://github.com/Kronbii/360-spherical-stitching)
- [Live viewer — 360.ramikronbi.com](https://360.ramikronbi.com)
- [TECHNICAL.md — method notes](https://github.com/Kronbii/360-spherical-stitching/blob/main/TECHNICAL.md)
- [TEMPORAL_SMOOTHING.md](https://github.com/Kronbii/360-spherical-stitching/blob/main/TEMPORAL_SMOOTHING.md)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-a-360-panorama-stitcher-from-a-phone-sweep). The project: [360° Spherical Panorama Stitching](https://ramikronbi.com/projects/360-spherical-panorama-stitching).*
