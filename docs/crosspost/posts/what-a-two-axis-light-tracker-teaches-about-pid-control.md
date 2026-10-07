---
title: "What a two-axis light tracker teaches about PID control"
description: "A small Arduino robot turns control theory into something visible: error, overshoot, noise, saturation, and settling all happen in front of you."
canonical_url: https://ramikronbi.com/writing/what-a-two-axis-light-tracker-teaches-about-pid-control
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: robotics, embedded, controlsystems
published: false
---
A light-tracking robot has a clean objective. Measure where the light is, move two servo axes, and keep the source centered. That simplicity makes it a good control experiment because the interesting behavior cannot hide behind a complex application.

The project uses light sensing to estimate directional error, an Arduino to run the controller, and yaw and pitch servos to move the sensor assembly. I led the software and system architecture, and Wassim Ghaddar handled hardware integration and testing.

The first version of a tracker can be made to move with proportional control. The useful version has to settle. Too much proportional gain creates oscillation. Too little leaves the mechanism slow and hesitant. Integral action can remove persistent bias, but it can also build up while a servo is already at its limit. Derivative action can damp motion, but a noisy sensor can turn it into jitter.

### Mechanics are inside the loop

Servo backlash, limited travel, sensor placement, chassis flex, and wiring are not external annoyances. They change the plant being controlled. A gain set that behaves well on one axis may be wrong for the other because the inertia and friction differ.

Calibration therefore includes more than choosing three numbers. The system needs a defined center, safe mechanical limits, sensible sensor filtering, and an update rate that remains consistent. Debug output helps separate a bad measurement from a bad controller response.

The project includes Arduino source, CAD models, a Proteus simulation, a report, and a real demonstration video. Together they make the control loop inspectable from code to mechanism.

The most useful lesson is that PID tuning is not a one-time formula. It is a conversation between measurement, time, actuation, and the physical system. A two-axis tracker makes that conversation easy to see—and difficult to fake.

## Links

- [GitHub — PID-light-tracker](https://github.com/Kronbii/PID-light-tracker)
- [Project demonstration video](https://youtu.be/Ye032oekX0A)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/what-a-two-axis-light-tracker-teaches-about-pid-control). The project: [PID Light Tracker](https://ramikronbi.com/projects/pid-light-tracking-robot).*
