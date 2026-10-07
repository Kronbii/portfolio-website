---
title: "What small upstream fixes teach about firmware"
description: "Five pull requests to Betaflight, PX4, and OpenFront, and the habit they share: make the mechanism explicit before touching the code."
canonical_url: https://ramikronbi.com/writing/what-small-upstream-fixes-teach-about-firmware
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: opensource, embedded, robotics
published: false
---
Most of what I have learned from large open-source codebases came from fixing very small things in them. A firmware project like Betaflight or an estimator like PX4’s EKF2 is too large to hold in one head, so each fix begins the same way: read one path until the mechanism is explicit, then change as little as possible.

## A debug channel with two meanings

In Betaflight, the FrSky and Redpine CC2500 receiver drivers both wrote the same debug channel, and indices 0, 1, and 2 meant different things in each. For FrSky, debug[1] was a count of missing packets; for Redpine it was a signed bind offset or a raw RSSI byte. Because a blackbox log stores only the numeric debug mode and not the active protocol, nothing reading the log afterwards could tell the layouts apart. The fix in #15706 gives Redpine its own debug mode. It was merged the same day.

## A read that returned success early

The W25M flash wrapper split reads at die boundaries and assumed the die driver returned the whole requested length. The W25N01G die driver clamps every transfer to a NAND page and returns the clamped count. The wrapper checked only that the count was non-zero, advanced by the full length it had asked for, and reported success, so any read across a page boundary left the tail of the buffer unfilled. #15705 honours the returned count. It is open at the time of writing.

## A timeout that was never refreshed

In PX4’s EKF2, when a range finder was the only active height source, successful range height fusion did not refresh the estimator’s global height-fusion timestamp. The estimator then treated all height sources as timed out and reset altitude every five seconds. #28286 refreshes the timestamp on successful fusion and adds a regression test that failed before the change and passed after it. The maintainers closed it without merging. I include it here because the diagnosis and the test are the useful part, and because a record of contributions that lists only accepted ones is not honest.

## The same discipline in a browser HUD

OpenFront is a browser strategy game, far from firmware, but the two merged fixes there followed the same pattern. #4868 makes the end-of-game timer warning progressive and adds focused tests for each threshold. #4985 stops iOS double-tap zoom from leaving the HUD stuck off-screen, using the declarative touch-action property first and a narrow touchend guard only as a fallback, instead of blocking touch events globally as the issue had suggested.

None of these changes is large. What they share is a pull request written so the maintainer can verify the mechanism without re-deriving it, and a test wherever the project has a harness. That is the part of open-source work I want to keep doing.

## Links

- [Betaflight PR #15706](https://github.com/betaflight/betaflight/pull/15706)
- [Betaflight PR #15705](https://github.com/betaflight/betaflight/pull/15705)
- [PX4 PR #28286](https://github.com/PX4/PX4-Autopilot/pull/28286)
- [OpenFront PR #4868](https://github.com/openfrontio/OpenFrontIO/pull/4868)
- [OpenFront PR #4985](https://github.com/openfrontio/OpenFrontIO/pull/4985)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/what-small-upstream-fixes-teach-about-firmware). The project: [Upstream fixes to Betaflight, PX4, and OpenFront](https://ramikronbi.com/projects/upstream-open-source-contributions).*
