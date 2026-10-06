---
workflow: general-video
flow: automation
storyboard: no
message: "Rami Kronbi builds machines that see, map, tune, and fly."
destination: website
aspect: 1920x1080
language: en
length: 15s
angle: the reel is a flight; every cut is a new sensor coming online
narration: no
---

## Intent

The third showreel for Rami Kronbi, robotics and embedded-systems engineer. In his words: "dynamic, full of life, WILD... unleash the motion designer in you... i am a robotics engineer i like drones i like building such vision systems. you dont have to go over every single project, you can replace some projects with a motion design about such topics." He did not like that the second video ("One loop") was one continuous timeline.

**ARMED.** The reel is a flight, and it is cut to the beat at 128 BPM over eight bars. It arms on a macro of a spinning prop, flips, and dives into its own lens. The name slams through the FPV feed. Then every beat brings a new sensor online:
- the race car seen the way a vision stack sees it (raw, edges, features, lock);
- a phone sweep's real feature matches flying together into a panorama that wraps into a sphere;
- a thermal frame snapping from its real low-res input to ×3;
- a control loop tuned until it settles.

A swarm takes the sky and clears for the lockup with the portrait and the signature, and the reel disarms.

The direction deliberately left behind is the typical robotics reel: stock drone footage, a glowing cyan HUD, and one title card per project.

## Assets

- assets/models/eachine-e58.glb: the E58 pocket drone (the_Thorminator, CC BY 4.0). It is the hero, the macro, and the swarm. It is a motion-design subject, not a claim about Rami's own airframes.
- assets/img/race-front.jpg, race-schematic.png, race-team.jpg: Brainiacs race car (authority record "brainiacs-autonomous-race-car").
- assets/img/pano-matches.jpg, pano-equirect.jpg, pano-frame.jpg: real pipeline stages of the 360° panorama stitcher.
- assets/img/thermal-low.png, thermal-x3.png: the real low-res input and the ×3 output, cropped from x3-showcase.png.
- assets/img/portrait.jpeg, sig.png: the site's portrait and signature.

## Customizations

- Cut on a 128 BPM grid, with no shot held longer than a bar except the close.
- One persistent three.js layer: the macro prop, the flip, the lens dive, the panorama sphere, the swarm, and the hero hover.
- The vision passes (Sobel edges and Harris features) are computed from the real race-car photo, not drawn by hand.
- A procedural score composed to the cut, with the motor whine as an instrument and a swarm chord.

## Notes

- DESIGN.md (the /v2 Engineering Notebook) is the brand: warm near-black, cream ink, and burgundy as the one accent. frame.md adapts it for this reel.
- Facts come only from ready authority records. The five-inch FPV drone and the runway-inspection UAV are in review, so they are not shown. Drones appear as motion design, and the Betaflight firmware fix (#15706, merged) is the verified drone-world link.
- The PID trace is labelled simulated.

## 2026-10-02 · 30-second version

Rami asked for a 30 s variant that keeps this cut's pace. It lives in `../armed-30`, a sibling project and not a second root here, because `check` and `snapshot` only read a project's `index.html`. Bars 1–5 are this film, unchanged. The rest is a longer verse (HEAT and TUNE at a full bar each, plus TRACE and SHIP), a half-time breakdown, a three-bar swarm drop, and a landing.
