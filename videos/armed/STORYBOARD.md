---
format: 1920x1080
duration: 15s
message: "Rami Kronbi builds machines that see, map, tune, and fly."
arc: Arm → flip → ID drop → see → map → heat → tune → fly → sign
audience: recruiters, research teams, and engineers evaluating Rami's work
mode: autonomous
structure: modular — thin root (3D layer, rig FX, chrome, score) + one sub-composition per scene
bpm: 128
rhythm: build-build-SLAM, rapid ×4 (one pass per beat), half-bar hits ×2, SWELL, hold
---

## Frame 1 — ARM

- scene: A macro on the E58's spinning prop; the arm switch flips, ARMED slams and condenses into the OSD pill; pull back, lift, punch out
- duration: 1.875s
- poster: 0.6s
- transition_in: cut
- status: animated
- src: compositions/s01-arm.html
- rules: kinetic-beat-slam (ARMED), scale-swap-transition (word → pill), multi-phase-camera (macro → wide, 3D)
- adapters: three (gl.js droneShot), shared OSD (compositions/osd.html)

## Frame 2 — FLIP

- scene: The drone flies in, rolls 360° (the roll counter spins), turns to the lens, the lock tightens, an iris swallows the frame into the lens
- duration: 1.875s
- poster: 2.6s
- transition_in: cut
- status: animated
- src: compositions/s02-flip.html
- rules: ai-tracking-box (lock brackets, recoloured to the brand), counting-dynamic-scale (roll), motion-blur-streak (skating word)

## Frame 3 — ID (the drop)

- scene: Through the drone's FPV feed, RAMI slams, KRONBI side-snaps, the ID lock snaps on, the subtitle decodes, the chapters stamp on sixteenths
- duration: 1.875s
- poster: 4.9s
- transition_in: lens iris + flash + burgundy ghost
- status: animated
- src: compositions/s03-name.html
- rules: kinetic-beat-slam, hacker-flip-3d (decode, flat), waterfall-entry (chips), whip pan out

## Frame 4 — SEE

- scene: Brainiacs race car through a vision stack, one pass per beat: raw, Sobel edges, Harris features, lock; 20 days, 3rd at WRO Future Engineers 2023 with Wassim Ghaddar; Jetson Nano → perception, Arduino Mega → control
- duration: 1.875s
- poster: 6.9s
- transition_in: whip pan (velocity-matched)
- status: animated
- src: compositions/s04-see.html
- rules: discrete-text-sequence (pass tag), particle-burst (radial feature pop), ai-tracking-box (lock), zoom-through out

## Frame 5 — MAP

- scene: The stitcher's real feature matches and 921 median inliers; 309 frames fan out and close into one sheet; the 3D sheet curls into a sphere and spins; 333°
- duration: 1.875s
- poster: 9.2s
- transition_in: zoom through
- status: animated
- src: compositions/s05-map.html
- rules: depth-scatter-assemble (frames → sheet), counting-dynamic-scale (309, 333°), chromatic-glitch out
- adapters: three (gl.js panoShot: vertex morph sheet → sphere)

## Frame 6 — HEAT

- scene: The real low-res thermal input slams in blocky; on the beat a scan enhances it to the ×3 output; 31.0 dB PSNR · 0.757 SSIM
- duration: 0.9375s
- poster: 10.1s
- transition_in: glitch cut
- status: animated
- src: compositions/s06-heat.html
- rules: kinetic-beat-slam (×3), clip-path scan reveal

## Frame 7 — TUNE

- scene: A scope; four simulated step responses on sixteenths ring down to settled; easyPID v1.1.0; the settled line launches upward
- duration: 0.9375s
- poster: 10.9s
- transition_in: inversion cut
- status: animated
- src: compositions/s07-tune.html
- rules: chart-scrub-readout (trace head), svg-path-draw (as canvas), spring-pop-entrance (SETTLED)

## Frame 8 — FLY

- scene: 36 E58s burst, wall, ring, helix under an orbiting camera; SENSE. DECIDE. ACT. one per beat; Betaflight #15706 merged; the swarm breaks past the lens
- duration: 1.875s
- poster: 12.4s
- transition_in: impact + flash + ghost
- status: animated
- src: compositions/s08-fly.html
- rules: kinetic-beat-slam (distinct entrances per word), grid-card-assemble (formations, 3D), spring-pop-entrance (merged)
- adapters: three (gl.js swarmShot)

## Frame 9 — SIGN

- scene: Portrait develops, Rami Kronbi. lands, the signature writes itself, the address; the hero E58 hovers, then punches out on the last beat
- duration: 1.875s
- poster: 14.9s
- transition_in: swarm fly-by + impact
- status: animated
- src: compositions/s09-sign.html
- blueprint: logo-assemble-lockup (adapted: portrait + wordmark + signature)
- adapters: three (gl.js heroShot)

## 2026-10-02 · 30-second version

See `../armed-30/STORYBOARD.md`. Frames 1–5 are shared verbatim; frames 6–12 are new or extended there.
