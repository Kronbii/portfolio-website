---
title: "Designing a council of models for retinal screening"
description: "Three foundation models that disagree in the open are more useful to a clinic than one model that is confidently wrong."
canonical_url: https://ramikronbi.com/writing/designing-a-council-of-models-for-retinal-screening
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: ai, healthtech
published: false
---
Basira is a prototype screening platform for eye clinics in Lebanon. A doctor or technician uploads a fundus or OCT image; three independent retinal-image models each read it; a consensus engine reports whether they agree; the doctor confirms or overrides; the clinic gets a PDF report. It is decision support. It never diagnoses on its own.

## Why three models

The three models come from different lineages and were pretrained on different data. Each is used as an encoder with a head I trained on openly licensed datasets: DDR and IDRiD for diabetic-retinopathy grading, RFMiD for other diseases, PAPILA for glaucoma. Reporting agreement as unanimous, majority, or split gives the reviewing doctor something a single probability does not: a signal of when the models themselves are uncertain.

## The safe path is enforced in code

A council member serves real predictions only when its encoder and a trained head both load. Otherwise a deterministic stub takes its seat and the API says so. An untrained head never produces a diagnosis; that rule is enforced in the model loader and covered by tests. A quality gate runs before any model, and explainability heatmaps accompany every reading.

## Built for a clinic box, not a data center

The whole council runs in about two seconds per eye on a plain CPU. That is what makes an on-premises deployment plausible in Lebanon, where connectivity and power are not guaranteed and patient images should not leave the building.

## What it is not

Basira is in development. So far it has been benchmarked retrospectively on public datasets, to guide the engineering. It is not clinically validated and it is not a medical device; the clinical study that could support a performance figure has not been run yet. I treat those limits as part of the design, not as footnotes.

## Links

- [Live prototype](https://basira.ramikronbi.com)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/designing-a-council-of-models-for-retinal-screening). The project: [Basira](https://ramikronbi.com/projects/basira-retinal-screening).*
