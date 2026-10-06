---
title: "A first mechatronic loop without a pump"
description: "An early Arduino project that hit targets with gravity-fed water bursts, and taught that the plant changes after every action."
canonical_url: https://ramikronbi.com/writing/a-first-mechatronic-loop-without-a-pump
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: robotics, embedded, controlsystems
published: false
---
The water-shooting robot is one of my earliest mechatronics projects. It aims a nozzle with a servo, sets its height with a stepper-driven lead screw, and fires timed bursts through a solenoid valve at a table of predefined targets. There is no pump; the stream is gravity-fed from a bottle.

That choice made the physics part of the control problem. The required nozzle height for a target depends on the water level, and the water level drops after every shot. The firmware estimates height from a simple ballistic relation and updates the modeled level with a Torricelli-style expression after each burst. Both are simplifications, and the README says so: empirical tuning is needed.

The repository is organized as firmware, focused bring-up test sketches for each actuator, CAD, and documentation, with calibration steps for steps-per-millimetre and predicted-versus-actual height logged over serial. It is early work, kept public because the loop is complete and the assumptions are written down.

## Links

- [GitHub — water-shooting-robot](https://github.com/Kronbii/water-shooting-robot)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/a-first-mechatronic-loop-without-a-pump). The project: [Water-shooting robot](https://ramikronbi.com/projects/water-shooting-robot).*
