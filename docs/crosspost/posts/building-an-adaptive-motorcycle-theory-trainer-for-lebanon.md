---
title: "Building an adaptive motorcycle theory trainer for Lebanon"
description: "An Arabic RTL study tool that keeps progress in the browser and spends practice time on the questions a learner is most likely to miss."
canonical_url: https://ramikronbi.com/writing/building-an-adaptive-motorcycle-theory-trainer-for-lebanon
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: edtech, lebanon, react
published: false
---
The Lebanese Motorcycle Theory Exam Trainer is a focused React application, not an online course platform. It contains 251 multiple-choice questions, including 101 road-sign questions with extracted sign images. Exam mode selects 30 questions and uses a 25/30 passing threshold. Practice mode remembers weak and recently missed material.

### Random is not the same as useful

Pure random selection can repeat familiar questions while leaving large parts of a bank unseen. The trainer uses coverage-aware selection so new attempts introduce unseen material before over-drilling what the learner already knows. Missed and weaker questions receive more attention, and a review mode makes mistakes easy to revisit.

The application stores progress in localStorage. That keeps the tool usable without an account or backend and avoids collecting personal study history. It also means progress belongs to one browser unless the learner exports or moves it through a future feature.

Arabic right-to-left layout is built into the experience rather than applied at the end. Question flow, answer alignment, numbers, road-sign images, and mixed-script labels all need deliberate handling. A technically correct translation can still feel broken if directionality is inconsistent.

### What it is not

The trainer uses the documented Lebanese motorcycle question set, but it is not an official government app, and no government body endorses it. Rules and exam procedures can change, so the question source and its update date should always be visible.

The project shows how a small local-first interface can improve a very specific learning loop. It does not need profiles, streaks, social features, or an AI tutor to be useful. It needs good question coverage, clear feedback, accurate content, and a respectful Arabic interface.

## Links

- [GitHub — lebanese-driving-test](https://github.com/Kronbii/lebanese-driving-test)
- [Application README and question data](https://github.com/Kronbii/lebanese-driving-test#readme)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-an-adaptive-motorcycle-theory-trainer-for-lebanon). The project: [Lebanese Motorcycle Theory Trainer](https://ramikronbi.com/projects/lebanese-motorcycle-theory-trainer).*
