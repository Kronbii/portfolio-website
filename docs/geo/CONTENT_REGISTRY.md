# Authority content registry

This registry is the complete editorial scope for the first authority-page build. “Ready” and “review” entries receive project and article records; only ready entries appear in public indexes.

## Ready: public and evidence-backed

### 1. 360° Spherical Panorama Stitching

- Project slug: `360-spherical-panorama-stitching`
- Article slug: `building-a-360-panorama-stitcher-from-a-phone-sweep`
- Topics: `computer-vision`, `robotics-perception`, `open-source-engineering`
- Role: sole developer.
- What it is: a CPU-only Python/OpenCV pipeline that turns handheld phone video or stills into an equirectangular panorama and generates a Three.js viewer.
- Verified sample run: 309 frames; 333° recovered sweep; median 921 RANSAC inliers per pair; 15 of 308 pairs recovered by interpolation; 36.9% of the sphere imaged; 4096 × 2048 output; approximately two minutes on a Ryzen 7 5800H.
- Verified effect: temporal smoothing reduced pitch wobble 13.5× and roll wobble 5.2× on the documented sample.
- Limits to state: rotation-only camera model, parallax failure, incomplete spherical coverage from a horizontal sweep, texture dependence, no bundle adjustment, no exposure matching.
- Sources: public repo `https://github.com/Kronbii/360-spherical-stitching`; demo `https://360.ramikronbi.com`; local `README.md`, `TECHNICAL.md`, `TEMPORAL_SMOOTHING.md`.
- Media to copy: `/home/kronbii/repos/360-spherical-stitching/showcase/panorama.jpg`; `showcase/GOAT.gif`; `output/comparison/side_by_side.jpg`; `docs/assets/pano_on_band.jpg`.

### 2. easyPID

- Project slug: `easypid-arduino-library`
- Article slug: `designing-a-pid-library-for-real-embedded-control`
- Topics: `embedded-systems`, `control-systems`, `open-source-engineering`
- Role: author.
- What it is: hardware-agnostic Arduino PID controller library with independent instances, automatic or caller-supplied timing, anti-windup, derivative filtering, state introspection, output limits, runtime tuning, and an optional relay autotuner.
- Verified distribution: listed in Arduino Library Manager as a contributed Device Control library; version 1.0.0 listing dated 2026-01-15; MIT; architecture Any.
- Limits to state: tuning is system-specific; autotuning can create sustained oscillation and needs safe bounds and supervision.
- Sources: `https://github.com/Kronbii/easyPID`; `https://www.arduinolibraries.info/libraries/easy-pid`; local README and examples.
- Media: no fake hardware photo. Use a code-native closed-loop control diagram and a real example snippet from the library documentation.

### 3. Brainiacs autonomous race car

- Project slug: `brainiacs-autonomous-race-car`
- Article slug: `building-an-autonomous-race-car-in-twenty-days`
- Topics: `robotics`, `embedded-systems`, `computer-vision`, `control-systems`
- Role: team member with Wassim Ghaddar; describe Rami's work conservatively as system architecture, vision, sensor integration, and embedded control only where supported by repository history and existing first-party content.
- What it is: a WRO Future Engineers vehicle dividing Jetson Nano perception from Arduino Mega real-time control, with OpenCV traffic-sign logic, PID steering, an MPU6050 IMU, and TCS34725 color sensing.
- Verified outcome: built from scratch in 20 days; RHU reported that Rami Kronbi and Wassim Ghaddar placed third in Future Engineers in July 2023 among a competition with more than 95 teams and 250 participants.
- Do not say: champion, 2024 champion, winner, first place.
- Sources: `https://github.com/Kronbii/autonomous-race-car`; RHU `https://www.rhu.edu.lb/media-room/news/rhu-engineering-students-win-big-in-the-world-robotics-olympiad`.
- Media to copy: `v-photos/demo.png`, `v-photos/front.jpeg`, `schemes/Schematic circuit .png`, one team image with both contributors if clearly identifiable.

### 4. Thermal super-resolution

- Project slug: `thermal-super-resolution`
- Article slug: `adapting-super-resolution-to-thermal-imagery`
- Topics: `computer-vision`, `edge-ai`, `robotics-perception`
- Role: computer vision engineer; the canonical CV describes architecture adaptation, training, and edge inference work.
- What it is: an IMDN-derived single-channel thermal super-resolution pipeline trained with thermal-specific objectives and optimized for deployment.
- Verified quality figures from the canonical CV: 34.2 dB PSNR / 0.840 SSIM at ×2; 31.0 / 0.757 at ×3; 29.6 / 0.713 at ×4.
- Verified edge figure from the canonical CV: approximately 45 FPS on Jetson AGX Orin. Always name that hardware.
- Do not publish repository claims of “first,” “new SOTA,” “15× faster,” “40× parameter reduction,” or 250–270 FPS until benchmark protocol and hardware are reconciled.
- Sources: canonical CV; `https://github.com/Kronbii/thermal-super-resolution`; local evaluation assets.
- Media to copy: `results/showcase/_x2_showcase.png`, `results/showcase/_x3_showcase.png`, and one comparison video if performance remains acceptable.

### 5. PID light tracker

- Project slug: `pid-light-tracking-robot`
- Article slug: `what-a-two-axis-light-tracker-teaches-about-pid-control`
- Topics: `robotics`, `embedded-systems`, `control-systems`
- Role: Rami Kronbi — lead developer and system architecture; Wassim Ghaddar — hardware integration and testing, per repository credits.
- What it is: an Arduino project that uses light sensing and two servo axes to follow a light source with PID control.
- Strong story: sensing, error calculation, actuator limits, calibration, and the difference between a controller that moves and one that settles.
- Do not publish unverified numeric performance claims from README marketing sections unless test logs support them.
- Sources: `https://github.com/Kronbii/PID-light-tracker`; video `https://youtu.be/Ye032oekX0A`.
- Media to copy: `project-video/video.mp4`; CAD/prototype images if available and clearly project-owned.

### 6. Fine crack tracing

- Project slug: `fine-crack-tracing-toolkit`
- Article slug: `turning-segmented-cracks-into-measurable-paths`
- Topics: `computer-vision`, `infrastructure-inspection`, `open-source-engineering`
- Role: repository owner/maintainer. Avoid claiming authorship of underlying algorithms beyond what repository history proves.
- What it is: an installable Python package and CLI for turning pre-segmented crack masks into ordered lines, optional splines, visual overlays, and evaluation metrics.
- Methods in the public README: classic, minimum-spanning-tree, and greedy ordering; ORB or Shi-Tomasi corner detection; precision, recall, F1, IoU, mean/max distance, and RMS error; CSV/JSON export.
- Sources: `https://github.com/Kronbii/fine-crack-detection`; local README and package source.
- Media to copy: `test-frames/test.png` and generated overlays only if they can be reproduced locally.

### 7. Medical prescription OCR

- Project slug: `multilingual-medical-prescription-ocr`
- Article slug: `extracting-medicine-names-from-multilingual-prescriptions`
- Topics: `applied-ai`, `health-technology`, `document-intelligence`
- Role: repository owner/implementer.
- What it is: a CLI and FastAPI service using Gemini to extract medicine names from prescription images in Arabic, English, and French, with an optional medicine database.
- Safety language: prototype extraction support, not a prescribing, dispensing, or clinical decision system. Handwritten prescriptions are ambiguous; outputs require human verification.
- Sources: `https://github.com/Kronbii/medical-prescription-OCR`; local README and tests.
- Media: use a privacy-safe synthetic/redacted sample only. Do not copy real prescription images unless confirmed non-personal and safe.

### 8. Daleel

- Project slug: `daleel-lebanese-election-information`
- Article slug: `designing-election-information-for-verifiability`
- Topics: `civic-technology`, `information-integrity`, `full-stack-systems`
- Role: repository owner/implementer. Do not imply institutional endorsement or political affiliation.
- What it is: an independent, multilingual Lebanese parliamentary-election information platform designed around source archiving, append-only history, and verifiable records.
- Architecture: Next.js frontend, Express backend, Prisma/PostgreSQL, JWT, CSRF protection, rate limiting, and immutable data models as documented.
- Editorial posture: neutral public information. Do not imply the dataset is complete, currently operational, officially certified, or authoritative without current evidence.
- Sources: `https://github.com/Kronbii/daleel`; local `TECHNICAL.md` and README.
- Media to copy: `showcase/hero.jpeg`; existing `/public/images/community/daleel.webp` may be referenced but not modified.

### 9. Lebanese motorcycle theory exam trainer

- Project slug: `lebanese-motorcycle-theory-trainer`
- Article slug: `building-an-adaptive-motorcycle-theory-trainer-for-lebanon`
- Topics: `education-technology`, `lebanon`, `frontend-engineering`
- Role: repository owner/implementer.
- What it is: an Arabic RTL Vite/React/TypeScript study tool for the Lebanese motorcycle theory exam.
- Verified scope: 251 multiple-choice questions, 101 road-sign questions, a 30-question exam mode with 25/30 pass threshold, adaptive review using localStorage, coverage-aware selection, and mistake review.
- Privacy: progress remains in the browser's localStorage.
- Do not describe it as official or government endorsed.
- Sources: `https://github.com/Kronbii/lebanese-driving-test`; local README and application data.
- Media to copy: a representative selection of road-sign WebP files plus a locally captured app screenshot created by Claude during implementation.

### 10. AI Customer Support Council

- Project slug: `local-first-ai-support-triage`
- Article slug: `building-a-local-first-ai-support-triage-council`
- Topics: `applied-ai`, `full-stack-systems`, `local-first-software`
- Role: repository owner/implementer; identify it as a technical-assessment deliverable for Valsoft Corporation exactly as the public README does.
- What it is: a self-hosted internal admin console for synthetic B2B support intake and triage, not a customer-facing platform.
- Architecture: React/TypeScript/Vite frontend; FastAPI/Pydantic/SQLAlchemy/Alembic backend; Redis/RQ background jobs; PostgreSQL; Ollama by default with an OpenAI-compatible optional provider.
- Product behavior: LLM triage plus deterministic routing/escalation rules, persisted state, human review, and JSON export.
- Sources: `https://github.com/Kronbii/AI-customer-support-council`; local README, docs, and tests.
- Media: capture privacy-safe local demo screens from the seeded synthetic dataset if the application can be started without credentials.

### 11. REE personal finance tracker

- Project slug: `ree-personal-finance-tracker`
- Article slug: `designing-an-offline-first-personal-finance-desktop-app`
- Topics: `local-first-software`, `flutter`, `product-engineering`
- Role: repository owner/implementer.
- What it is: a Flutter desktop personal-finance application for multi-wallet transactions, subscriptions, debts, savings goals, and local insights.
- Strong story: desktop-first, keyboard-aware workflows; local SQLite storage; optional production storage behavior only when documented; backup and export.
- Avoid saying the interface is Apple-quality; describe the design intent and observable behavior.
- Sources: `https://github.com/Kronbii/personal-finance-tracker`; local README and architecture docs.
- Media to copy: `images/image1.jpeg`, `images/image2.jpeg`, `images/image3.jpeg`, `assets/icon/app_icon.png`.

## Review: build locally, noindex, omit from indexes

### 12. OmniSign

- Project slug: `omnisign-lebanese-sign-language`
- Article slug: `building-real-time-lebanese-sign-language-translation`
- Reason for review: public project history exists and the canonical CV supports a 300K-image dataset, 95–97% accuracy, approximately 45 FPS, mobile/web/offline embedded deployments, and pilots in two Beirut coffee shops and one church. Team role, collaborator credits, dataset consent/governance, award language, and the existing Medium origin story require confirmation before indexing.
- Sources: canonical CV; existing portfolio media; `https://laythayache.com/projects/omnisign`; existing Medium article only as a lead, not narrative authority.

### 13. Posture-aware classroom desk

- Project slug: `posture-aware-classroom-desk`
- Article slug: `connecting-posture-estimation-to-a-motorized-desk`
- Reason for review: the prototype and existing portfolio media are strong, but the public repository URL, final name, Rami's exact role, and testing outcome are unresolved.

### 14. Raspberry Pi runway-inspection UAV

- Project slug: `raspberry-pi-runway-inspection-uav`
- Article slug: `running-fod-detection-on-a-raspberry-pi-uav`
- Reason for review: canonical CV supports a Raspberry Pi 5B prototype, YOLOv11 FOD detection at approximately 45 FPS, 75–80% development accuracy, and parking-lot flight tests; public repository, dataset rights, authorship scope, and safe employer separation require confirmation.

### 15. Five-inch carbon-fiber FPV drone

- Project slug: `five-inch-carbon-fiber-fpv-drone`
- Article slug: `engineering-a-five-inch-fpv-drone-from-first-principles`
- Reason for review: canonical CV supports component sizing, Betaflight PID tuning, GPS and return-to-home configuration, and performance evaluation, but public media, dates, logs, and project repository are not yet identified.

### 16. Emotion recognition for children with autism

- Project slug: `emotion-recognition-autism-support`
- Article slug: `lessons-from-an-edge-emotion-recognition-prototype`
- Reason for review: canonical CV supports a Jetson Orin Nano prototype and approximately 92% development accuracy; the clinical framing, datasets, acquisition language, responsible-use boundary, collaborators, and validation context require careful confirmation.

### 17. NASA Space Apps technical organizing

- Article slug: `what-four-years-of-technical-mentoring-taught-me`
- Reason for review: canonical CV supports 250–400 participants annually across four years, a 10–15 member volunteer team, technical bootcamps, and six Global Top 10 placements across three consecutive years. Exact years, event pages, team credits, and public corroboration should be attached before indexing.

### 18. NASNA crisis-support operations

- Article slug: `building-technology-around-crisis-response-operations`
- Reason for review: canonical CV supports Rami's co-founder/operations-lead role and high-level mission. Publishing needs consent, timeline, scale, safety review, collaborator credits, and an explicit decision about whether beneficiaries can be discussed.

### 19. National Physics Day and astronomy outreach

- Article slug: `turning-physics-outreach-into-a-multi-university-program`
- Reason for review: canonical CV supports the multi-university program and experimental activities. Publishing needs dates, host institutions, participant scale, links, and collaborator approval.

## Hold: registry only, no route

### Confidential employer and defense work

Oreyeon internal system details, airport field work beyond information already officially public, and the confidential Lebanese defense-sector project remain hold. Do not create or enrich pages from private CV details.

### Landmine detection and extraction robot

Hold pending an explicit disclosure and safety review with the Lebanese Armed Forces and the project team. Do not render technical architecture, field-test details, images, or partner claims.

### Private repositories

Basira, track-3d, Gravi/ToyPOS, and any other private repository remain hold until Rami explicitly chooses what can be made public. Private repository visibility is not evidence of publication consent.

### Ambiguous or third-party repositories

Forks, clones, team repositories, coursework mirrors, and external origins are not automatically Rami-authored work. They require an authorship decision before entering the project registry.

## Strategic context: not current project records

### Space²

Space² is an early-stage Lebanese innovation space/incubator and part of Rami's institution-building direction. Its current portfolio includes a locked road-safety and enforcement direction plus emergency infrastructure, energy coordination, assistive and rehabilitation technology, accessibility, medical-equipment uptime, and municipal-system concepts.

Do not create an indexable project page from these concepts. Claude must first verify Rami's role, collaborators, current organizational status, completed milestones, public sources, and whether a real bounded pilot exists. Future concepts are not achievements.

### Undiscovered and unclassified repository work

This registry is the implemented first wave, not the complete census of `/home/kronbii/repos`. Claude must follow the private discovery protocol and present proposed additions or exclusions to Rami before changing this registry or the typed content layer.
