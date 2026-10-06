---
title: "Adapting super-resolution to thermal imagery"
description: "Upscaling a thermal frame is not the same problem as enlarging an RGB photograph, especially when the result must run beside the rest of a perception stack."
canonical_url: https://ramikronbi.com/writing/adapting-super-resolution-to-thermal-imagery
cover_image: https://ramikronbi.com/images/authority/thermal-super-resolution/x3-showcase.webp
tags: computervision, edgeai, robotics
published: false
---
Low-resolution thermal sensors are useful because they see structure that ordinary cameras miss, particularly in darkness and low-contrast scenes. Their price rises sharply with resolution. Super-resolution offers another path: spend computation to recover a more useful signal from the sensor already available.

The catch is that an RGB super-resolution model learns the visual statistics of ordinary photographs. It is rewarded for reconstructing texture, color edges, and detail that may have no thermal meaning. A plausible-looking result can be worse than a soft one if it invents gradients that downstream perception treats as evidence.

This project adapts an Information Multi-Distillation Network to single-channel thermal data. RGB pretraining provides a useful starting point, while a thermal-specific training objective shifts attention toward gradients, contrast, and structure that belong to heat imagery.

### Quality has to be measured at every scale

In evaluation, the model reached 34.2 dB PSNR and 0.840 SSIM at ×2 enlargement, 31.0 dB and 0.757 at ×3, and 29.6 dB and 0.713 at ×4. Those numbers should be read with their scale: the task becomes less constrained as the enlargement factor grows.

They also do not replace visual inspection. Side-by-side crops reveal whether an edge became cleaner or merely sharper, whether small hot objects survive reconstruction, and where the model smooths detail away.

### Edge deployment changes the model

A robotics pipeline rarely gets the entire device to itself. Super-resolution may sit before detection, tracking, or measurement. Latency, memory traffic, and preprocessing therefore matter as much as the neural network.

The deployment work moved inference toward FP16 and INT8 execution and measured the system on NVIDIA Jetson hardware: about 45 frames per second on NVIDIA Jetson Orin after quantization. The repository’s own evaluation report has higher numbers from a desktop GPU, and I keep the two apart. A speed figure means little without the hardware and the benchmark that produced it.

That distinction is central to the project. “Real time” is not a property of a model file. It is a property of a complete pipeline on named hardware, at a named input size, while doing the work around inference.

Thermal super-resolution is valuable when it improves a downstream decision without hiding uncertainty. So the next evaluations should be task-based: does a detector find more relevant objects, does measurement remain stable, and where does reconstruction create false confidence? Better-looking frames are not the final objective. Better perception is.

## Links

- [GitHub — thermal-super-resolution](https://github.com/Kronbii/thermal-super-resolution)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/adapting-super-resolution-to-thermal-imagery). The project: [Thermal Super-Resolution](https://ramikronbi.com/projects/thermal-super-resolution).*
