---
title: "Building technology around crisis-response operations"
description: "In crisis response, the interface is only one part of the system."
canonical_url: https://ramikronbi.com/writing/building-technology-around-crisis-response-operations
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: humanitarian, opensource, react, firebase
published: false
---
NASNA (ناسنا) is a humanitarian coordination platform connecting displaced and war-affected people in Lebanon with NGOs, donors, and volunteers. I co-founded it in 2024, during the autumn displacement crisis, and worked on it through 2025 as AI engineer and developer alongside Mohammad Homsi (full-stack developer and tech lead), Abed El-Fattah Amouneh (product manager and frontend developer), and Lynn El Solh (multimedia designer). The platform is open source under AGPL-3.0 and live at nasna.world.

In crisis response, the interface is only one part of the system. Requests need verification, triage, safe matching, follow-up, and careful handling of personal information. Supply changes quickly. Volunteers have uneven availability. A database can make coordination more legible, but it can also create risk if access, consent, retention, and escalation are not designed around vulnerable people.

The platform is a three-sided network. Displaced families are registered by field agents through a multi-step intake form, or register themselves through a public form; the form collects household composition, needs, urgency, and special needs, and requires explicit consent that cannot be bypassed. NGOs define a coverage profile, the areas and aid types they serve and their maximum case load, and receive only the pending cases that match it. Admins run a dispatch center with urgency indicators, stale-case highlighting after 24 hours, and an operations map of Lebanon.

Two design decisions matter most under crisis conditions. The intake form works offline: if a field agent loses connectivity, submissions are saved locally in the browser and synced when the connection returns. And personal data is treated as the main risk: the displaced person’s contact number is never exposed in the NGO case feed, duplicate registrations are detected by phone number before submission, and the repository documents rules against personal information in logs and URLs.

The stack is React 19 and TypeScript on Firebase (Firestore, Auth, Cloud Functions, Hosting), with Arabic, English, and French interfaces built right-to-left first. My part was the AI and engineering side of the product alongside the team; the tech lead and product roles belonged to Mohammad Homsi and Abed El-Fattah Amouneh.

What the platform does not do is replace the people doing the work. It gives verification, triage, matching, and follow-up a shared structure. The questions I still want to answer are about scale and outcomes: how many cases moved through the pipeline, and what we learned from the ones that stalled.

## Links

- [GitHub — nasna](https://github.com/1homsi/nasna)
- [nasna.world](https://nasna.world)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-technology-around-crisis-response-operations).*
