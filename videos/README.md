# Showreels

Rami Kronbi's showreels, all in the /v2 Engineering Notebook world (warm near-black, cream ink, burgundy accent). Every figure on screen comes from a ready authority record.

| Folder | Length | What it is | Built with |
| --- | --- | --- | --- |
| [showreel/](showreel/) | 15 s | The first reel: a drone self-levels, the name lands, and five entries cut on the beat to a signed sign-off. | Hand-rolled HTML/JS, rendered with headless Chrome and ffmpeg |
| [one-loop/](one-loop/) | 15 s | "One loop": a single burgundy control signal writes a notebook page row by row and settles. | HyperFrames |
| [armed/](armed/) | 15 s | "ARMED": the reel is a flight cut at 128 BPM. It arms, flips and dives into the lens, then the name drops, and the race car, panorama, thermal and PID scenes each bring a sensor online. A swarm follows, then the lockup. | HyperFrames + three.js |
| [armed-30/](armed-30/) | 30 s | ARMED at 30 s. It adds crack tracing, the upstream PRs as a git graph, a half-time breakdown, a swarm spelling RK., and a landing that disarms. | HyperFrames + three.js |

Renders, snapshots and Studio caches are ignored (see `.gitignore`). Each folder's README has its rebuild steps. The HyperFrames projects are pinned to `hyperframes@0.8.110`.

The E58 drone model is by the_Thorminator (CC BY 4.0, Sketchfab).
