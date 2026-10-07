---
title: "Engineering a five-inch FPV drone from first principles"
description: "Building a five-inch FPV drone is an exercise in coupled constraints: every part you choose changes what the others have to do."
canonical_url: https://ramikronbi.com/writing/engineering-a-five-inch-fpv-drone-from-first-principles
cover_image: https://ramikronbi.com/images/authority/fpv-drone/build.jpg
tags: drones, embedded, robotics, controlsystems
published: false
---
Building a five-inch FPV drone is an exercise in coupled constraints. Motor and propeller choices set thrust and current draw. Battery voltage changes the whole power system. Frame weight and where each component sits change how the drone responds. Software tuning only begins once the physical build is coherent.

## Start from the numbers

I selected the propulsion and power components from thrust, weight, and current calculations. The three are tied together: the motors and propellers have to make enough thrust for the weight of everything on the frame, that thrust costs current, and the battery and electronics have to deliver that current while adding weight of their own.

Change one and the others move. A bigger propeller or a stronger motor buys thrust and spends current; a battery that can supply more current is usually heavier, which asks for more thrust again. The calculation is where you find a combination that closes before you buy or solder anything.

## The build

The components went together on a 5-inch carbon-fiber frame. The build photo on the project page catches it halfway: the frame and its four motors on an ESD mat, with the electronics, a battery, the radio transmitter, and a pair of calipers beside it.

## Tuning in Betaflight

Betaflight is the open-source firmware that runs on the flight controller. I configured and tuned its PID loops, set up its flight modes, and configured its GPS features and return-to-home behavior.

The PID loops are what make the drone go where the sticks point it: they compare the rotation the gyro measures with the rotation the pilot asks for and correct the difference thousands of times a second. It is the same feedback idea behind easyPID, the Arduino PID library I wrote, on a machine that reacts far faster.

Return-to-home is the feature that flies the drone back on its own, typically when the radio link drops, and it steers by GPS. That makes it only as trustworthy as the position fix and the link behind it, which is why the last step was testing both.

## Testing when GPS cannot be trusted

I evaluated GPS accuracy, RF link quality, and flight performance, including under GNSS jamming and the constraints of integrating IMU and GNSS data.

Jamming matters because so much of a drone’s autonomy rests on satellite positioning. When GNSS is jammed, the position that GPS features and return-to-home depend on stops being reliable. The IMU keeps measuring motion, and it is good at that over short spans, but its estimate drifts over time. How the two are combined decides how the drone behaves when one of them degrades.

A five-inch quad packs a lot of engineering into a small frame: the arithmetic of power and weight, a fast feedback controller, a radio link, and sensors that each fail in their own way. Betaflight is also where some of my open-source work lives; the small fixes I have contributed to its firmware are written up separately.

## Links

- [Betaflight](https://betaflight.com)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/engineering-a-five-inch-fpv-drone-from-first-principles). The project: [5-inch Carbon-Fiber FPV Drone](https://ramikronbi.com/projects/five-inch-carbon-fiber-fpv-drone).*
