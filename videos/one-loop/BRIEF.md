---
workflow: general-video
flow: automation
storyboard: no
message: "Rami Kronbi builds systems that sense, decide, and act, and makes them settle."
destination: website
aspect: 1920x1080
language: en
audience: recruiters, research teams, and engineers evaluating Rami's work
length: 15s
angle: one continuous control signal
narration: no
---

## Intent

A 15-second showreel for Rami Kronbi's résumé. The user's words: "a dynamic 15 second motion graphics video like you are an incredible motion designer … like its a showreel for a resume of me. go all out", and for this HyperFrames version: "go wild. go all out. unleash your creativity. make it to impress."

Concept ("One loop", chosen autonomously in the pitch round): one burgundy control signal runs unbroken for the whole film. It leaves the E58 drone, then becomes each project in turn: the panorama's horizon, the thermal super-resolution wipe, the race car's lap, easyPID's step response, the strokes of "دليل". It finally settles exactly on its setpoint and writes Rami's signature. The cut is the line; there is no hard cut anywhere.

Direction deliberately left behind: the HUD-plus-project-card montage (the typical engineer showreel, and what the hand-built v1 at `../../showreel/` was).

## Assets

- ../../public/models/eachine-e58.glb — "Eachine E58 Pocket Drone" by the_Thorminator, CC BY 4.0; the site's drone (user: "replace my drone with the E58 one its nicer"), opens the film. Credit on screen.
- ../../public/images/authority/spherical-panorama/panorama.jpg — 360° panorama plate.
- ../../public/images/authority/thermal-super-resolution/thermal-plate.webp — thermal input vs ×3 (two panels in one file).
- ../../public/images/authority/race-car/front.jpeg — Brainiacs race car photo.
- ../../public/images/authority/daleel/hero.jpeg — Daleel platform hero.
- ../../public/images/home/portrait.jpeg — Rami's portrait.
- ../../public/images/home/sig.png — Rami's signature.
- ../../showreel/fonts/ — Manrope, Instrument Serif italic, JetBrains Mono (OFL).

## Customizations

- One line that draws and morphs through every scene (the concept's spine).
- The E58 drone in real 3D (Three.js), caught by a simulated self-level loop whose roll telemetry is the first stretch of the line.
- Music and sound design locked to the line's beats.

## Notes

- Mid-run decision (user): the site's drone and the film's drone are now the Eachine E58.

- Design truth: ../../DESIGN.md (/v2 Engineering Notebook): ground #0E0B0B, cream ink #FBF5EA, burgundy #C9686A as the only accent, Manrope + one Instrument Serif italic word + JetBrains Mono for figures.
- Facts only from the authority records and docs/geo/ENTITY_FACTS.md verified items. No [VERIFY] claims. Simulations are labelled as simulated.
