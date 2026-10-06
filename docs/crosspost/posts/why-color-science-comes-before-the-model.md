---
title: "Why color science comes before the model"
description: "To teach a network a photographer’s edit, the training pairs must be linear, calibrated, and exact. Most of the work is in the decode."
canonical_url: https://ramikronbi.com/writing/why-color-science-comes-before-the-model
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: computervision, ai
published: false
---
Professional real-estate photographers shoot every frame as a set: ambient brackets at −6, −3, 0, +3, and +6 EV, flash fills, and lights-on stacks, then blend and grade by hand. The Imagen pipeline captures that before-and-after relationship at scale so an HDRNet bilateral-grid network can learn one photographer’s style. It was a freelance engagement for a French real-estate agency.

## Ingestion has to guess right

Sessions arrive as folders of RAW files and edited JPEGs with no labels. Ingestion groups brackets by timestamp, identifies the ambient sequence, flash fills, and lights-on stacks, and writes an index per listing so a run can resume after interruption.

## The DNG pipeline, in full

Canon EOS R5 DNGs from recent converters use JPEG XL tiles that LibRaw cannot decode, so the pipeline falls back to tifffile and applies the DNG specification’s color pipeline itself: per-channel polynomial linearization from the opcode list, white balance and camera calibration, the forward matrix to XYZ D50, Bradford adaptation to D65, and finally linear sRGB. Lens distortion, chromatic aberration, and vignetting are corrected with lensfun profiles. The output is 16-bit linear PNG, scene-referred, with no gamma.

## Targets must not be reinterpreted

The photographer’s JPEG is the ground truth. It is linearized so the artistic values are preserved exactly rather than re-graded by the pipeline. If the target drifts, the model learns the pipeline’s taste instead of the photographer’s.

Layth Ayache contributed training and delivery runs. The client’s imagery stays private. By the client’s count, editing throughput went from two or three photos a day for a team of three to about forty a day per team member. What I can show here is the mechanism: get the decode right, keep the target exact, and the model has something honest to learn.

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/why-color-science-comes-before-the-model). The project: [Imagen](https://ramikronbi.com/projects/imagen-raw-to-edit-dataset-pipeline).*
