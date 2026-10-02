---
workflow: general-video
flow: automation
storyboard: no
message: "Rami Kronbi builds machines that see, map, tune, trace, ship, and fly."
destination: website
aspect: 1920x1080
language: en
length: 30s
angle: the reel is a flight; every cut is a new sensor coming online
narration: no
---

## Intent

The 30-second version of ARMED (`../armed`, 15 s). In Rami's words: "the video is AMAZING. i now want to make a 30 second variant. i like that the 15 seconds is very fast paced but i also want a 30 second one."

It runs 16 bars at 128 BPM and keeps the 15-second pace. The first five bars are the 15-second cut: arm, flip, the drop, SEE, MAP. The extra time buys three things:

- **A longer verse.**
  - HEAT and TUNE get a full bar each: the ×2, ×3 and ×4 quality ladder, and easyPID's feature set.
  - TRACE is new: the crack toolkit's pipeline runs on the repository's real mask.
  - SHIP is new: all five upstream pull requests, with their honest outcomes.
- **A half-time breakdown.** A chase camera follows the E58 over the field while the site's own claim builds word by word, then a strobe recap slams into the second drop.
- **A three-bar swarm drop and a landing.** The drones spell RK., then the hero sets down on the lockup's rule and disarms, bookending ARMED.

## Assets

Everything from `../armed`, plus:
- assets/img/crack-mask.png: the fine-crack toolkit's repository test frame (a pre-segmented mask). TRACE is computed from it by assets/data/crack.py.
- assets/img/race-team.jpg: Team Brainiacs, with Wassim Ghaddar (the strobe).

## Customizations

- Same engine as ARMED, with the 3D shots retimed and three new ones: the chase, the tunnel run with the RK. formation, and the landing.
- The score is extended to 16 bars and composed to the cut. The crack tree's growth is played as notes, the merges chime up the chord, and the landing and disarm are heard.

## Notes

- This project is a sibling folder, not a second root inside `../armed`, because `check` and `snapshot` only read a project's `index.html`.
- The facts are all ready records. The breakdown line, "I build systems that sense the world and act on it.", is the site's own hero claim (src/content/v2/home.ts).
- The PX4 #28286 PR is shown as closed and test-backed, and Betaflight #15705 as open, exactly as recorded.
