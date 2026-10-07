---
title: "Extracting medicine names from multilingual prescriptions"
description: "A small document-intelligence service for Arabic, English, and French prescriptions—and an example of why medical OCR needs explicit human verification."
canonical_url: https://ramikronbi.com/writing/extracting-medicine-names-from-multilingual-prescriptions
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: ai, healthtech, ocr
published: false
---
Prescriptions are a difficult OCR input. Handwriting is inconsistent, abbreviations are local, medicine names are easy to confuse, and a single page may move between Arabic, English, and French. A technically successful extraction is still not a safe dispensing decision.

This project wraps a Gemini-based extraction step in two practical interfaces: a command-line tool for individual images or directories, and a FastAPI service for integration. The output is structured around medicine names and can be checked against an optional medicine database.

### Structure around the model

The model call is only one part of the system. Batch processing needs bounded parallelism and clear output locations. An API needs validation, error handling, and a predictable result shape. Configuration and credentials must stay outside the repository. The optional database supports normalization and review without pretending that a fuzzy match is clinical truth.

Multilingual input also changes evaluation. A useful test set needs variation in script, handwriting, image quality, rotation, lighting, and the presence of non-medicine text. Accuracy should be reported at the extracted-name level, with separate accounting for missed names, incorrect additions, and uncertain matches.

### The safety boundary is part of the product

This is an extraction prototype. It does not prescribe, dispense, check interactions, or replace a pharmacist or clinician. Every output has to be checked by a person against the source image. Real prescription images may contain personal health information, so public demonstrations should use synthetic or safely redacted material.

Those constraints are not a disclaimer attached after the implementation. They determine which data can be stored, what logs may contain, how results are presented, and whether the interface encourages confirmation.

The broader lesson is simple: applied AI becomes useful when the system around the model makes its uncertainty and limits operational. Returning a list is easy. Returning a list that a person can safely review is the real task.

## Links

- [GitHub — medical-prescription-OCR](https://github.com/Kronbii/medical-prescription-OCR)
- [CLI and FastAPI documentation](https://github.com/Kronbii/medical-prescription-OCR#readme)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/extracting-medicine-names-from-multilingual-prescriptions). The project: [Multilingual Medical Prescription OCR](https://ramikronbi.com/projects/multilingual-medical-prescription-ocr).*
