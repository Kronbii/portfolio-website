# ARMED · 30

The 30-second version of ARMED (`../armed`). It runs 16 bars at 128 BPM. Bars 1–5 are the 15-second cut, and then:

6. **HEAT:** the real thermal input enhanced ×3, then the ×2, ×3 and ×4 quality ladder, the split compare, and Jetson deployment.
7. **TUNE:** easyPID's step response, tuned on sixteenths until it settles (simulated, and heard), with its feature set.
8. **TRACE:** the crack toolkit's pipeline on the repository's own mask: points, a minimum-spanning-tree order, a smoothed curve, CSV and JSON.
9. **SHIP:** five upstream pull requests as a git graph. Three merge, Betaflight #15705 stays open, and PX4 #28286 is closed with its regression test.
10. **GLIDE:** the half-time breakdown. A chase over the field carries the site's claim, then a strobe recap of eight real frames.
11. **FLY:** drop B. Formations, a barrel-roll tunnel run, and 36 drones spelling RK.
12. **LAND:** the lockup. The E58 sets down on the rule and disarms.

`BRIEF.md` holds the intent and `frame.md` holds the frame-scale design spec. Every figure on screen comes from a ready authority record.

## Pieces

- `assets/js/core.js` is the shared clock. It holds the beat grid, easing, deterministic noise, the impact list, and the simulated flight. The OSD and the 3D layer both read the same flight, so the readouts are the animation's own state.
- `assets/js/gl.js` is the persistent three.js layer under every scene, with six shots chosen by time. The E58's propellers are split out of the body mesh at load, around its measured hubs, so the blades really turn. The panorama is one mesh whose vertices morph from a flat sheet to a sphere.
- `index.html` is a thin root. It holds the camera rig (impact kicks, flash, inversion, and a burgundy ghost through an SVG filter), the chrome (beat grid, timecode, chapter), grain, and the score.
- `compositions/` holds one sub-composition per scene, plus `osd.html` for frames 1–2.
- `assets/data/crack.py` runs TRACE's pipeline on the real mask: Zhang–Suen thinning, candidate points, a minimum spanning tree in depth-first order, and a smoothed main run.
- `assets/data/vision.py` computes the vision passes offline from the real race-car photo: Sobel edges and Harris corners. Its outputs are `race-crop.jpg`, `race-edges.png` and `race-features.json`. The features are inlined into `compositions/s04-see.html`.
- `audio/score.py` is the score, synthesized at 128 BPM in D minor:
  - The motor whine follows the simulated throttle.
  - The PID traces are sonified: pitch follows the response.
  - The swarm is a chord of 36 detuned rotor voices.
  - The crack tree's growth is played as notes, the merges chime, and the landing and disarm are heard.

## Rebuild

```bash
python3 audio/score.py audio/score.wav     # lands near -14 LUFS
npx --yes hyperframes@0.8.110 media-use resolve --type bgm --from audio/score.wav --intent "ARMED 30 score" --project .
#   then point #score's src in index.html at the new .media id
npm run check
npx hyperframes preview --background
npx --yes hyperframes@0.8.110 render --fps 60 --quality delivery -o renders/armed-30-rami-kronbi.mp4
```

## Credits

The Eachine E58 pocket drone model is by the_Thorminator (CC BY 4.0, Sketchfab), credited on the closing frame. It is a motion-design subject, not one of Rami's airframes. Rami's drone projects that are still in editorial review are not shown.
