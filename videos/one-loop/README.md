# One loop

A 15-second HyperFrames showreel for ramikronbi.com. One burgundy control signal starts as the Eachine E58's self-level loop, writes the name, and runs row by row through the notebook page: panorama, thermal, race car, easyPID, Daleel, upstream fixes. It settles on its setpoint, and the camera pulls back to show the whole page with the signature. The intent and the shot list are in `BRIEF.md` and `STORYBOARD.md`, and the frame-scale design spec is in `frame.md`.

## Pieces

- `assets/js/signal.js` is the engine. It holds the world layout, the signal's path (timed pieces sampled at 240 per second), the camera (holds and follows), and the canvas drawing of the trace with its phosphor tail.
- `assets/js/drone.js` is the E58 in three.js, pinned to the signal's head for the first two seconds. It registers with `window.__hf.buildReady` and renders on `hf-seek`.
- `index.html` is the single composition. The world is one oversized page moved by one camera transform, and one GSAP driver tween seeks everything.
- `audio/score.py` is the score: synthesized, 120 BPM, A minor, composed to the picture. The signal has its own voice in it: pitch follows the head's height off its row and pan follows its screen position (`audio/head.json`). It settles on the tonic.

## Rebuild

```bash
# 1. If the signal path changes, re-export the head trajectory to audio/head.json
#    (it samples OneLoop.head(t) at 200 Hz; see the cues in that file).
# 2. Score
python3 audio/score.py audio/score.wav
npx --yes hyperframes@0.8.110 media-use resolve --type bgm --from audio/score.wav \
  --intent "One Loop score" --project .          # freezes into .media/; point #score's src at the new id
# 3. Verify, preview, render
npm run check
npx hyperframes preview --background
npx --yes hyperframes@0.8.110 render --fps 60 --quality delivery -o renders/one-loop-rami-kronbi.mp4
```

## Credits

The E58 drone model is by the_Thorminator (CC BY 4.0, Sketchfab), credited in the closing frame. Every figure on screen comes from the site's authority records, and both simulations are labelled as simulated.
