---
format: 1920x1080
duration: 30s
message: "Rami Kronbi builds machines that see, map, tune, trace, ship, and fly."
arc: Arm → flip → ID drop → see → map → heat → tune → trace → ship → glide (breakdown) → fly (drop B) → land
audience: recruiters, research teams, and engineers evaluating Rami's work
mode: autonomous
structure: modular — thin root (3D layer, rig FX, chrome, score) + one sub-composition per scene
bpm: 128
rhythm: build-build-SLAM, rapid ×6 (one pass per beat), HALF-TIME breath, strobe, SLAM ×3, land and hold
---

## Frames 1–5 — ARM, FLIP, ID, SEE, MAP (bars 1–5)

- scene: Identical to ARMED (15 s), frames 1–5
- duration: 9.375s
- status: animated
- src: compositions/s01-arm.html … s05-map.html (+ osd.html)

## Frame 6 — HEAT (bar 6)

- scene: Low-res input slams; ×3 enhance on the beat; the ×2/×3/×4 quality ladder on eighths with a split compare; IMDN · FP16/INT8 on Jetson
- duration: 1.875s
- poster: 10.6s
- status: animated
- src: compositions/s06-heat.html
- rules: kinetic-beat-slam (×3), clip-path scan reveal, discrete-text-sequence (ladder)

## Frame 7 — TUNE (bar 7)

- scene: Four simulated step responses on sixteenths settle (heard as pitch); easyPID's features stamp on sixteenths; the settled line launches
- duration: 1.875s
- poster: 12.6s
- status: animated
- src: compositions/s07-tune.html
- rules: chart-scrub-readout, spring-pop-entrance (chips)

## Frame 8 — TRACE (bar 8)

- scene: The repository's crack mask scans in; candidate points pop; the minimum spanning tree grows depth first; the smoothed main run draws; CSV · JSON
- duration: 1.875s
- poster: 14.8s
- status: animated
- src: compositions/s10-trace.html
- rules: svg-path-draw (tree edges, curve), particle-burst (points), discrete-text-sequence (stage tag)

## Frame 9 — SHIP (bar 9)

- scene: A git graph: five branches fork; three merge on eighths (Betaflight #15706, OpenFront #4868, #4985); Betaflight #15705 stays open; PX4 #28286 closed · test-backed; 3 / 5
- duration: 1.875s
- poster: 16.6s
- status: animated
- src: compositions/s11-ship.html
- rules: svg-path-draw, counting-dynamic-scale, spring-pop-entrance

## Frame 10 — GLIDE (bars 10–11, the breakdown)

- scene: Chase cam over the contour field; "I build systems that sense the world and act on it." one word per eighth; then eight real frames strobe on sixteenths into the drop
- duration: 3.75s
- poster: 18.6s
- status: animated
- src: compositions/s12-glide.html
- adapters: three (gl.js chaseShot)

## Frame 11 — FLY (bars 12–14, drop B)

- scene: Burst, wall, ring, helix with SENSE. DECIDE. ACT.; a barrel-roll tunnel run with the focus areas flying at the lens; 36 drones spell RK., the lock snaps on, they flip and break past
- duration: 5.625s
- poster: 25.3s
- status: animated
- src: compositions/s13-swarm.html
- adapters: three (gl.js swarmShot)

## Frame 12 — LAND (bars 15–16)

- scene: The lockup lands; the signature writes; the E58 sets down on the rule beside the address, a touchdown ring, DISARMED, the blades spool down to the last frame
- duration: 3.75s
- poster: 29.9s
- status: animated
- src: compositions/s14-sign.html
- blueprint: logo-assemble-lockup (adapted)
- adapters: three (gl.js heroShot, landing + disarm)
