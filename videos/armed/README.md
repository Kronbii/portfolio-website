# ARMED

A 15-second HyperFrames showreel for ramikronbi.com. It is cut on a 128 BPM grid over eight bars, and each bar is a new sensor coming online:

1. **ARM:** a macro on the E58's prop as the arm switch flips and the motors spool up.
2. **FLIP:** the drone flies in and rolls a full 360°, then dives into its own lens.
3. **ID:** the name slams through the FPV feed. This is the drop.
4. **SEE:** the race car passes through a vision stack, one pass per beat: raw, Sobel edges, Harris features, lock.
5. **MAP:** the panorama stitcher's real feature matches, then 309 frames fanning out. The frames close into one sheet, and the sheet curls into a sphere.
6. **HEAT:** the real low-res thermal input is enhanced ×3 on the beat.
7. **TUNE:** easyPID's step response is tuned on sixteenths until it settles. The trace is simulated, and it is also heard.
8. **FLY:** 36 E58s fly in formation over "sense, decide, act", and the Betaflight fix is stamped merged.
9. **SIGN:** the portrait, the name, the signature and the address.

`BRIEF.md` holds the intent and `frame.md` holds the frame-scale design spec. Every figure on screen comes from a ready authority record.

## Pieces

- `assets/js/core.js` is the shared clock. It holds the beat grid, easing, deterministic noise, the impact list, and the simulated flight. The OSD and the 3D layer both read the same flight, so the readouts are the animation's own state.
- `assets/js/gl.js` is the persistent three.js layer under every scene, with six shots chosen by time. The E58's propellers are split out of the body mesh at load, around its measured hubs, so the blades really turn. The panorama is one mesh whose vertices morph from a flat sheet to a sphere.
- `index.html` is a thin root. It holds the camera rig (impact kicks, flash, inversion, and a burgundy ghost through an SVG filter), the chrome (beat grid, timecode, chapter), grain, and the score.
- `compositions/` holds one sub-composition per scene, plus `osd.html` for frames 1–2.
- `assets/data/vision.py` computes the vision passes offline from the real race-car photo: Sobel edges and Harris corners. Its outputs are `race-crop.jpg`, `race-edges.png` and `race-features.json`. The features are inlined into `compositions/s04-see.html`.
- `audio/score.py` is the score, synthesized at 128 BPM in D minor:
  - The motor whine follows the simulated throttle.
  - The PID traces are sonified: pitch follows the response.
  - The swarm is a chord of 36 detuned rotor voices.

## Rebuild

```bash
python3 audio/score.py audio/score.wav     # lands near -14 LUFS
npx --yes hyperframes@0.8.110 media-use resolve --type bgm --from audio/score.wav --intent "ARMED score" --project .
#   then point #score's src in index.html at the new .media id
npm run check
npx hyperframes preview --background
npx --yes hyperframes@0.8.110 render --fps 60 --quality delivery -o renders/armed-rami-kronbi.mp4
```

## Credits

The Eachine E58 pocket drone model is by the_Thorminator (CC BY 4.0, Sketchfab), credited on the closing frame. It is a motion-design subject, not one of Rami's airframes. Rami's drone projects that are still in editorial review are not shown.
