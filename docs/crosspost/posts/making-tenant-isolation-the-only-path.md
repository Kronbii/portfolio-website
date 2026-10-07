---
title: "Making tenant isolation the only path"
description: "For a clinical platform, the dominant risk is one organization seeing another’s patients. The architecture should make that mistake hard to write."
canonical_url: https://ramikronbi.com/writing/making-tenant-isolation-the-only-path
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: ai, healthtech, webdev
published: false
---
Lumiscan is an ESP32-based device, owned by its product owner, that scans skin lesions and outputs a classification with metrics. A device alone is not a product; clinics need somewhere to keep patients, lesions, and scans, to see whether a lesion is changing, and to manage follow-up. The dashboard is that platform.

## Scoping is structural

Every table that holds protected health information carries a non-null organization id, denormalized down every branch from patient to lesion to scan. The id is always derived server-side from the session, never from a request body or query parameter. All reads and writes go through a scoped repository, and a lint rule bans raw database access in feature code. A cross-organization request returns not-found, never forbidden, so the existence of another clinic’s rows is not confirmed.

## Two front doors, one service layer

The interface uses tRPC; devices use a versioned REST endpoint with hashed device keys and idempotency. Both are thin adapters over the same service functions, so manual entry and device ingestion write the same way and differ only in who the actor is. The device API is defined, tested, and simulated by a script; live ingestion is deferred until firmware is ready.

## Narratives, never classification

Classification arrives from the device. A language model writes a patient-friendly explanation and a doctor-facing summary from stored results, and it is explicitly forbidden from producing a triage label that drives the interface. Images are private objects in S3-compatible storage with keys prefixed by organization; they never enter the database.

The prototype has a single local workspace instead of real authentication, and HIPAA and GDPR are designed for rather than implemented. All demo data is synthetic. Those are the expected limits of an MVP; what is already settled is that the safe path is the only path.

## Links

- [GitHub — lumiscan-dashboard](https://github.com/Kronbii/lumiscan-dashboard)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/making-tenant-isolation-the-only-path). The project: [Lumiscan dashboard](https://ramikronbi.com/projects/lumiscan-lesion-dashboard).*
