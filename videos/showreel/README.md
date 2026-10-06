# Showreel

A 15-second, 1080p60 motion-graphics showreel in the /v2 "Engineering Notebook" visual world.

- `index.html` + `main.js`: the composition. `window.renderFrame(t)` is a pure function of time, so any frame renders identically in any order. Open `index.html?play` through a static server to preview it in real time.
- `timeline.json`: one source of truth for scene boundaries and every sound cue. Picture and sound both read it, so cuts land on hits.
- `audio.py`: procedural sound design (numpy/scipy, no samples). 120 BPM, A minor.
- `render.mjs`: shoots frames with headless Chrome (playwright-core) across parallel workers.
- `build.sh`: render at 120 fps, synthesize audio, and encode with ffmpeg. Frame pairs are blended for motion blur.
- `lib/geometry.js`: the procedural quadrotor, transpiled from `src/components/three/drone/geometry.ts`.
- `fonts/`: Manrope, Instrument Serif and JetBrains Mono (all SIL Open Font License).

Every figure on screen comes from the authority records or `docs/geo/ENTITY_FACTS.md`. The quadrotor is a procedural model, and its self-levelling and the step response are simulations. Both are labelled as such in the video.
