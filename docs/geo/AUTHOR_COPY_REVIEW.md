# Review-only article copy

These drafts are intentionally complete enough to render for local editorial review, but they are not approved for indexing. Claude must mark every associated route `noindex, nofollow`, omit it from indexes, and display a discreet “Editorial review draft” notice.

---

## Building real-time Lebanese Sign Language translation

**Slug:** `building-real-time-lebanese-sign-language-translation`

Lebanese Sign Language has a data problem before it has a model problem. General sign-language datasets do not automatically transfer to local vocabulary, signing patterns, or the communication settings in which a system will be used.

OmniSign was built as a real-time translation system spanning camera input, visual recognition, language output, and deployment across mobile, web, and offline embedded environments. My canonical project record describes a 300,000-image dataset, 95–97% development accuracy, and approximately 45 frames per second, with pilots in two Beirut coffee shops and one church.

The important engineering question is not only whether a classifier recognizes a held-out image. A usable translator must remain responsive across different signers, backgrounds, cameras, lighting, and signing speeds. Dataset balance and consent matter. So do uncertainty handling and the decision to ask for a repeated sign instead of producing a confident wrong translation.

This draft intentionally avoids the personal origin story used in an earlier article and does not yet assign individual credit across the full team. Before publication, the team roles, dataset governance, pilot consent, evaluation protocol, and any award language must be confirmed.

---

## Connecting posture estimation to a motorized desk

**Slug:** `connecting-posture-estimation-to-a-motorized-desk`

A posture-aware desk closes a physical loop: a camera estimates how someone is sitting, software decides whether the posture has drifted, and motors change the work surface. The prototype combines computer vision, ESP32 control, motorized height and tilt, immediate LED feedback, and a dashboard for longer-term patterns.

The system is interesting because a posture model cannot be treated as an isolated prediction. Camera placement changes the visible geometry. Desk movement changes the camera view. A false correction can be distracting or unsafe. The control policy therefore needs dead bands, mechanical limits, slow transitions, and a manual override.

The existing portfolio contains strong prototype media, but the public repository, final project name, authorship split, and testing evidence are not resolved. This page should remain a private review draft until those facts are attached.

---

## Running FOD detection on a Raspberry Pi UAV

**Slug:** `running-fod-detection-on-a-raspberry-pi-uav`

Runway foreign-object-debris inspection is a useful edge-AI problem because the system has to see small hazards while moving, under tight compute and power limits. The canonical project record describes a Raspberry Pi 5B UAV prototype running a lightweight YOLOv11 detector at approximately 45 frames per second, trained with online and synthetic data and tested in parking-lot environments used to simulate runway conditions.

The project joins airframe constraints, onboard inference, camera motion, false-positive filtering, and flight testing. A detector that works on static images can fail when the vehicle vibrates, changes altitude, or sees repeated pavement texture. Similarity matching and explicit false-positive handling were included to make the flight behavior more useful than a raw stream of boxes.

Before publication, the repository, exact model variant and input size, data rights, evaluation split, meaning of the reported 75–80% accuracy, flight-test ownership, and separation from employer work need confirmation.

---

## Engineering a five-inch FPV drone from first principles

**Slug:** `engineering-a-five-inch-fpv-drone-from-first-principles`

Building a five-inch FPV drone is an exercise in coupled constraints. Motor and propeller choices affect thrust and current. Battery voltage changes the power system. Frame weight and component placement affect response. Software tuning begins only after the physical build is coherent.

The canonical project record describes a carbon-fiber quadcopter designed from thrust, weight, and current calculations, followed by Betaflight configuration, PID tuning, flight-mode setup, GPS features, and return-to-home behavior. Evaluation included GPS accuracy, RF link quality, and flight behavior under GNSS jamming and IMU/GNSS integration constraints.

The publishable story should show the calculation path and measured logs, not merely list components. Public media, dates, hardware specifications, test locations, and the boundary around any jamming observations still need review, so this draft remains noindex.

---

## Lessons from an edge emotion-recognition prototype

**Slug:** `lessons-from-an-edge-emotion-recognition-prototype`

The canonical project record describes a facial-landmark and convolutional-neural-network pipeline developed on Jetson Orin Nano for a prototype intended to support work with children with autism. It reached approximately 92% development accuracy after combining and cleaning image and video data from CALMED, Kaggle, and other sources.

The most important publication question is not the architecture. It is the responsible framing. Facial expression is not a direct measurement of a person's internal emotional state, and performance on a curated dataset does not establish clinical validity. Any useful system must communicate uncertainty, avoid diagnostic claims, and be evaluated with the people and contexts it is intended to support.

Before publication, the team credits, dataset licenses, class definitions, evaluation protocol, acquisition language, intended users, and clinical review must be confirmed. The final article should be a careful engineering retrospective, not a claim that emotion can be read reliably from a face.

---

## What four years of technical mentoring taught me

**Slug:** `what-four-years-of-technical-mentoring-taught-me`

My canonical CV records four years as lead technical organizer for NASA Space Apps in Beirut, supporting roughly 250–400 participants annually with a volunteer team of 10–15 people. The work included technical bootcamps using NASA datasets, problem selection, prototyping, competition requirements, and submission strategy. It also records six Global Top 10 placements across three consecutive years among teams supported through that ecosystem.

The useful lesson is that technical mentoring is not solving a participant's project for them. It is building enough structure that a team can narrow a problem, understand the evidence, choose a tractable prototype, and tell the truth about what it achieved in a short weekend.

Before indexing, the exact event years, official event pages, organizer credits, team names, placement records, and the causal wording around mentorship need to be attached. The article should credit the community rather than turn collective results into an individual statistic.

---

## Building technology around crisis-response operations

**Slug:** `building-technology-around-crisis-response-operations`

NASNA was a crisis-support platform connecting displaced and war-affected people with donors, NGOs, sponsors, and volunteers. My canonical record lists me as co-founder and operations lead from 2021 to 2024.

In crisis response, the interface is only one part of the system. Requests need verification, triage, safe matching, follow-up, and careful handling of personal information. Supply changes quickly. Volunteers have uneven availability. A database can make coordination more legible, but it can also create risk if access, consent, retention, and escalation are not designed around vulnerable people.

This article should eventually focus on operational design rather than heroic storytelling: what information was actually needed, how matches were made, where manual judgment remained necessary, and how the team handled incomplete data. It must remain a private draft until collaborators approve the account and the disclosure, safety, scale, and beneficiary-privacy questions are resolved.

---

## Turning physics outreach into a multi-university program

**Slug:** `turning-physics-outreach-into-a-multi-university-program`

The canonical record describes founding and leading National Physics Day across four universities, expanding hands-on physics and astronomy activities through double-slit, electrical, and telescope experiments, and developing demonstrations used in university outreach.

Good science outreach gives people something they can manipulate and question. A double-slit experiment turns an abstract account of interference into a visible pattern. A telescope makes scale and observation immediate. The organizing work is in creating stations that are robust, safe, explainable, and still interesting when many groups move through them.

Before indexing, the event dates, participating institutions, collaborator credits, participant scale, photographs, and public references need confirmation. The final piece should document how the program was designed and repeated, not claim institutional impact that has not been measured.
