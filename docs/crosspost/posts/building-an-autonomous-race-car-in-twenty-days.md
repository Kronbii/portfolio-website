---
title: "Building an autonomous race car in twenty days"
description: "A small autonomous vehicle forced perception, control, power, mechanics, and team decisions into one unforgiving loop."
canonical_url: https://ramikronbi.com/writing/building-an-autonomous-race-car-in-twenty-days
cover_image: https://ramikronbi.com/images/vneo/race-refined.jpg
tags: robotics, embedded, computervision, controlsystems
published: false
---
Twenty days is not enough time to make every subsystem elegant. It is enough time to learn which boundaries matter.

The Brainiacs vehicle was built for the 2023 World Robot Olympiad Future Engineers challenge. It had to read the track, react to traffic markers, avoid obstacles, and keep moving reliably. The practical answer was not one powerful computer doing everything. We divided the problem between a Jetson Nano and an Arduino Mega.

The Jetson handled camera work in Python and OpenCV. It extracted the visual events that mattered to driving rather than sending raw imagery downstream. The Arduino owned the time-sensitive control loop: steering, motor commands, and sensor readings that should not pause because a vision frame took longer than expected.

### Splitting perception from control

That division made the system easier to reason about. Computer vision is bursty. Exposure changes, a difficult frame, or a detection step can move execution time around. Steering control needs a predictable cadence. A simple command interface between the two processors isolated those timing behaviors.

The rest of the sensing stack filled gaps the camera could not cover alone. A TCS34725 color sensor supported track and corner logic. An MPU6050 IMU gave the controller another view of motion and heading. PID steering converted error into smoother corrections than a sequence of hard left/right rules.

### Calibration became part of the software

The repository documents camera thresholds, IMU bias, color sensing, and PID tuning because those values were not incidental. They were the difference between code that looked plausible and a vehicle that completed laps.

This kind of build also exposes power and mechanical constraints quickly. A vision model cannot compensate for loose steering geometry. A clean control loop cannot fix voltage sag. The useful engineering work happens at the interfaces: making a camera event specific enough for the controller, making the controller tolerant of noisy sensors, and keeping the wiring and frame serviceable while the design changes daily.

Rafik Hariri University reported that Wassim Ghaddar and I placed third in the Future Engineers category in July 2023, and noted that its teams built their robots from scratch in twenty days.

The placement matters, but the lasting result is the architecture. The project is an end-to-end autonomous system small enough to see all at once: photons become features, features become events, events become steering commands, and those commands meet a physical vehicle with inertia, noise, and imperfect hardware.

## Links

- [GitHub — autonomous-race-car](https://github.com/Kronbii/autonomous-race-car)
- [RHU — competition report](https://www.rhu.edu.lb/media-room/news/rhu-engineering-students-win-big-in-the-world-robotics-olympiad)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-an-autonomous-race-car-in-twenty-days). The project: [Brainiacs Autonomous Race Car](https://ramikronbi.com/projects/brainiacs-autonomous-race-car).*
