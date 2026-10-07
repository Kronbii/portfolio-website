---
title: "Connecting posture estimation to a motorized desk"
description: "A posture-aware desk closes a physical loop between vision, control, and motion."
canonical_url: https://ramikronbi.com/writing/connecting-posture-estimation-to-a-motorized-desk
cover_image: https://ramikronbi.com/images/authority/smart-desk/night-pic.jpeg
tags: embedded, computervision, robotics
published: false
---
A posture-aware desk closes a physical loop: a camera estimates how someone is sitting, software decides whether the posture has drifted, and motors change the work surface. The prototype combines computer vision, ESP32 control, motorized height and tilt, immediate LED feedback, and a dashboard for longer-term patterns.

The system is interesting because a posture model cannot be treated as an isolated prediction. Camera placement changes the visible geometry. Desk movement changes the camera view. A false correction can be distracting or unsafe. The control policy therefore needs dead bands, mechanical limits, slow transitions, and a manual override.

The Smart Interactive Desk, codenamed BEMO, was our senior graduation project at Rafik Hariri University: Bassam Kousa, Ali Daaboul, Mohamad Berjawi, Mohamad Hariri, and me as team lead. It won the Best Senior Project award. The code and a demo video are linked below; the team’s formal report and test results live outside the repository.

## Links

- [GitHub — smart-interactive-desk](https://github.com/Kronbii/smart-interactive-desk)
- [Demo video](https://youtu.be/5TPmpPc6rjY)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/connecting-posture-estimation-to-a-motorized-desk). The project: [Smart Interactive Desk (BEMO)](https://ramikronbi.com/projects/posture-aware-classroom-desk).*
