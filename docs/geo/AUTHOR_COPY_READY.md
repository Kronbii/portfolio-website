# Ready article copy

The prose below is the editorial source of truth for the eleven indexable articles. Claude may make only small grammar or punctuation corrections when translating it into typed content.

---

## Building a 360° panorama stitcher from a phone sweep

**Slug:** `building-a-360-panorama-stitcher-from-a-phone-sweep`

**Dek:** A phone video, a pure-rotation camera model, and a stubborn question: how much of a 360° reconstruction pipeline can be made explicit instead of hidden behind a stitching API?

A panorama looks simple only after it works. Before that, it is a chain of small geometric errors. A few bad correspondences tilt the camera estimate. A fraction of a degree of pitch error accumulates into a staircase along a ceiling. A handheld step sideways introduces parallax that no homography can honestly explain.

I built this pipeline to make that chain visible. It accepts a phone video or a folder of stills and produces an equirectangular panorama plus a self-contained Three.js viewer. The implementation is CPU-only Python and OpenCV. There is no gyroscope dependency and no opaque “stitch” call doing the whole job.

### The pipeline is eight decisions, not one algorithm

Frames are extracted from video by interval, count, frame rate, or measured motion. Camera intrinsics come from EXIF when possible, then fall back to an explicit field of view or calibration file. Adjacent frames are matched with ORB features, Lowe's ratio test, and RANSAC. If an adjacent pair fails, the matcher tries across the gap and interpolates the missing step instead of silently discarding the frame.

The useful part begins after the homography. Under a pure-rotation model, the relative camera rotation is recovered with `R = K⁻¹HK`. Numerical noise means that matrix is rarely a perfect rotation, so singular-value decomposition projects it back onto the rotation manifold before the estimates are chained into global orientations.

Each source frame is then inverse-warped onto an equirectangular canvas: an output pixel becomes a world direction, that direction is rotated into the camera, projected onto the image plane, and sampled. Overlaps can be blended in several ways, and unseen regions can be filled, with the important caveat that filling is not reconstruction.

### The straight line that exposed the real problem

On the documented sample, independent pairwise estimates left only small pitch and roll errors. They were still enough to turn long architectural edges into a visible staircase. A moving average over the chained rotations reduced pitch wobble by 13.5× and roll wobble by 5.2× on that run.

That fix is deliberately modest. It does not replace global bundle adjustment or close the loop around a full sweep. It solves the instability that was actually visible while keeping the pipeline easy to inspect.

### What the sample run says—and what it does not

The sample used 309 phone-video frames and recovered a 333° sweep. Median RANSAC support was 921 inliers per adjacent pair; 15 of 308 pairs were recovered through interpolation. At 4096 × 2048, the full run took about two minutes on a Ryzen 7 5800H, including roughly 19 seconds of feature matching and 96 seconds of warping.

Only 36.9% of the sphere had actually been photographed. A phone-height horizontal sweep sees a band around the viewer, not the floor and ceiling. The missing poles can be inpainted, but they should never be described as captured detail.

The other limit is parallax. The model assumes the phone rotates around its optical center. Translate while sweeping past a nearby object and the scene no longer has a single homography. Blank walls and repeated textures also weaken matching. There is no bundle adjustment or exposure matching in the current version, so drift and brightness changes remain honest targets for future work.

The result is useful because it is inspectable. Every stage has a module, the run records its resolved configuration and intrinsics, more than 200 tests cover the pipeline, and the browser viewer makes the final geometry tangible. It is less a magic panorama button than a working map of the decisions behind one.

**Evidence links:** GitHub repository; live demo; technical method; temporal smoothing notes.

---

## Designing a PID library for real embedded control

**Slug:** `designing-a-pid-library-for-real-embedded-control`

**Dek:** The PID equation is short. A controller that behaves predictably on an Arduino needs much more than three gains.

Most introductions to PID control end at the formula. Real embedded control starts after it. The loop may run late. An actuator saturates. Sensor noise dominates the derivative term. A second controller needs to coexist with the first. The person tuning the system needs to see what each term is doing instead of guessing from the final output.

easyPID grew from that gap. It is a hardware-agnostic Arduino library built around independent controller instances rather than global state. A project can run multiple loops, use automatic `millis()` timing or pass an explicit time delta, change gains at runtime, limit outputs, and inspect the controller's internal state.

### Timing belongs in the interface

A control loop is not only a function of error; it is a function of time. Hiding the sample interval makes a controller look stable in one sketch and behave differently when logging, communication, or another sensor changes the loop duration.

easyPID therefore supports two timing modes. Automatic timing is convenient for ordinary Arduino sketches. Manual delta time lets a scheduler or test harness own the clock. The latter also makes simulation and repeatable tests easier because time becomes input rather than ambient state.

### Saturation and noise are normal operating conditions

Integral windup happens when the requested output exceeds what the actuator can deliver while the integral term keeps accumulating. When the system finally returns to a controllable range, that stored error can drive a long overshoot. The library provides selectable anti-windup behavior and explicit output bounds so saturation is part of the model.

Derivative action has the opposite sensitivity: it reacts strongly to high-frequency measurement noise. Optional low-pass filtering makes the derivative term usable on the sensors people actually connect to microcontrollers.

State introspection is just as important. Exposing the proportional, integral, and derivative contributions turns tuning from a ritual into diagnosis. If the integral term is carrying the system, or the derivative term is amplifying noise, the evidence is available.

### Autotuning is a tool with consequences

The optional relay autotuner deliberately drives the process into oscillation and derives candidate gains from the response. That can be useful, but it is not a safe default. The actuator must have limits, the process must tolerate repeated oscillation, and a person must be ready to stop the run. The documentation treats those conditions as part of the feature rather than a footnote.

easyPID is distributed through Arduino Library Manager as a contributed Device Control library and remains small enough for Uno-class AVR boards. Its main design lesson is broader than PID: reusable embedded code should expose timing, limits, state, and failure modes. The equation is the easy part. The contract around it is what makes it reusable.

**Evidence links:** GitHub repository; Arduino Library Manager listing; examples and tuning documentation.

---

## Building an autonomous race car in twenty days

**Slug:** `building-an-autonomous-race-car-in-twenty-days`

**Dek:** A small autonomous vehicle forced perception, control, power, mechanics, and team decisions into one unforgiving loop.

Twenty days is not enough time to make every subsystem elegant. It is enough time to learn which boundaries matter.

The Brainiacs vehicle was built for the 2023 World Robot Olympiad Future Engineers challenge. It had to read the track, react to traffic markers, avoid obstacles, and keep moving reliably. The practical answer was not one powerful computer doing everything. We divided the problem between a Jetson Nano and an Arduino Mega.

The Jetson handled camera work in Python and OpenCV. It extracted the visual events that mattered to driving rather than sending raw imagery downstream. The Arduino owned the time-sensitive control loop: steering, motor commands, and sensor readings that should not pause because a vision frame took longer than expected.

### Splitting perception from control

That division made the system easier to reason about. Computer vision is bursty. Exposure changes, a difficult frame, or a detection step can move execution time around. Steering control needs a predictable cadence. A simple command interface between the two processors isolated those timing behaviors.

The rest of the sensing stack filled gaps the camera could not cover alone. A TCS34725 color sensor supported track and corner logic. An MPU6050 IMU gave the controller another view of motion and heading. PID steering converted error into smoother corrections than a sequence of hard left/right rules.

### Calibration became part of the software

The repository documents camera thresholds, IMU bias, color sensing, and PID tuning because those values were not incidental. They were the difference between code that looked plausible and a vehicle that completed laps.

This kind of build also exposes power and mechanical constraints quickly. A vision model cannot compensate for loose steering geometry. A clean control loop cannot fix voltage sag. The useful engineering work happens at the interfaces: making a camera event specific enough for the controller, making the controller tolerant of noisy sensors, and keeping the wiring and frame serviceable while the design changes daily.

Rafik Hariri University reported that Rami Kronbi and Wassim Ghaddar placed third in the Future Engineers category in July 2023. The university also noted that its teams built their robots from scratch in twenty days.

The placement matters, but the lasting result is the architecture. The project is an end-to-end autonomous system small enough to see all at once: photons become features, features become events, events become steering commands, and those commands meet a physical vehicle with inertia, noise, and imperfect hardware.

**Evidence links:** GitHub repository; RHU's July 2023 competition report.

---

## Adapting super-resolution to thermal imagery

**Slug:** `adapting-super-resolution-to-thermal-imagery`

**Dek:** Upscaling a thermal frame is not the same problem as enlarging an RGB photograph, especially when the result must run beside the rest of a perception stack.

Low-resolution thermal sensors are useful because they see structure that ordinary cameras miss, particularly in darkness and low-contrast scenes. Their price rises sharply with resolution. Super-resolution offers another path: spend computation to recover a more useful signal from the sensor already available.

The catch is that an RGB super-resolution model learns the visual statistics of ordinary photographs. It is rewarded for reconstructing texture, color edges, and detail that may have no thermal meaning. A plausible-looking result can be worse than a soft one if it invents gradients that downstream perception treats as evidence.

This project adapts an Information Multi-Distillation Network to single-channel thermal data. RGB pretraining provides a useful starting point, while a thermal-specific training objective shifts attention toward gradients, contrast, and structure that belong to heat imagery.

### Quality has to be measured at every scale

On the evaluation reported in my canonical project record, the model reached 34.2 dB PSNR and 0.840 SSIM at ×2 enlargement, 31.0 dB and 0.757 at ×3, and 29.6 dB and 0.713 at ×4. Those numbers should be read with their scale: the task becomes less constrained as the enlargement factor grows.

They also do not replace visual inspection. Side-by-side crops reveal whether an edge became cleaner or merely sharper, whether small hot objects survive reconstruction, and where the model smooths detail away.

### Edge deployment changes the model

A robotics pipeline rarely gets the entire device to itself. Super-resolution may sit before detection, tracking, or measurement. Latency, memory traffic, and preprocessing therefore matter as much as the neural network.

The deployment work moved inference toward FP16 and INT8 execution and measured the system on NVIDIA Jetson hardware. The currently reviewed figure is approximately 45 frames per second on Jetson AGX Orin. I am deliberately not combining that number with higher desktop GPU figures found in older repository copy; hardware and benchmark protocol must travel with any speed claim.

That distinction is central to the project. “Real time” is not a property of a model file. It is a property of a complete pipeline on named hardware, at a named input size, while doing the work around inference.

Thermal super-resolution is valuable when it improves a downstream decision without hiding uncertainty. The responsible next evaluations are therefore task-based: does a detector find more relevant objects, does measurement remain stable, and where does reconstruction create false confidence? Better-looking frames are not the final objective. Better perception is.

**Evidence links:** GitHub repository; canonical CV; evaluation images and demo videos.

---

## What a two-axis light tracker teaches about PID control

**Slug:** `what-a-two-axis-light-tracker-teaches-about-pid-control`

**Dek:** A small Arduino robot turns control theory into something visible: error, overshoot, noise, saturation, and settling all happen in front of you.

A light-tracking robot has a clean objective. Measure where the light is, move two servo axes, and keep the source centered. That simplicity makes it a good control experiment because the interesting behavior cannot hide behind a complex application.

The project uses light sensing to estimate directional error, an Arduino to run the controller, and yaw and pitch servos to move the sensor assembly. Rami Kronbi led the software and system architecture; Wassim Ghaddar contributed hardware integration and testing, as recorded in the repository.

The first version of a tracker can be made to move with proportional control. The useful version has to settle. Too much proportional gain creates oscillation. Too little leaves the mechanism slow and hesitant. Integral action can remove persistent bias, but it can also build up while a servo is already at its limit. Derivative action can damp motion, but a noisy sensor can turn it into jitter.

### Mechanics are inside the loop

Servo backlash, limited travel, sensor placement, chassis flex, and wiring are not external annoyances. They change the plant being controlled. A gain set that behaves well on one axis may be wrong for the other because the inertia and friction differ.

Calibration therefore includes more than choosing three numbers. The system needs a defined center, safe mechanical limits, sensible sensor filtering, and an update rate that remains consistent. Debug output helps separate a bad measurement from a bad controller response.

The project includes Arduino source, CAD models, a Proteus simulation, a report, and a real demonstration video. Together they make the control loop inspectable from code to mechanism.

The most useful lesson is that PID tuning is not a one-time formula. It is a conversation between measurement, time, actuation, and the physical system. A two-axis tracker makes that conversation easy to see—and difficult to fake.

**Evidence links:** GitHub repository; project demonstration video.

---

## Turning segmented cracks into measurable paths

**Slug:** `turning-segmented-cracks-into-measurable-paths`

**Dek:** A segmentation mask says which pixels belong to a crack. Inspection work often needs the next layer: an ordered line, a trace, and measurements that can be compared.

Crack segmentation produces a region. Many inspection tasks need a path. They need to trace where the crack runs, smooth the trace without erasing meaningful bends, compare it with a reference, and export results that can be analyzed outside a notebook.

The fine-crack tracing toolkit packages that work as an installable Python project with a command-line interface. It consumes raw frames and pre-segmented masks, extracts candidate crack points, orders them, optionally fits smoother curves, generates overlays, and exports metrics in CSV and JSON.

The repository exposes several ordering strategies rather than pretending one heuristic fits every geometry: a classic approach, a minimum-spanning-tree path, and a greedy alternative. ORB or Shi-Tomasi features can support corner detection where local structure matters. The output can be evaluated with precision, recall, F1, IoU, mean and maximum distance, and RMS error.

### Why packaging matters

Computer-vision experiments often stop in the state where only the original author can reproduce them. Paths are hard-coded, configuration lives in notebook cells, and evaluation is a collection of plots with no machine-readable record.

Turning the work into a package changes the engineering question. Inputs and outputs need contracts. Configuration needs predictable precedence. Runs need named output directories. Metrics need stable serialization. A command such as `fine-tracing run` or `fine-tracing metrics` becomes a repeatable interface rather than a memory of which cells to execute.

The toolkit is not a crack detector and should not be described as one. It begins after segmentation. That boundary is useful: it keeps the package focused on geometry and evaluation while allowing different segmentation models to feed it.

The next serious validation step is dataset-level comparison across crack types, widths, branching patterns, and imaging conditions. The current value is the reproducible bridge from mask to path—the layer required before a thin visual defect can become a measurement.

**Evidence links:** GitHub repository; package README and CLI documentation.

---

## Extracting medicine names from multilingual prescriptions

**Slug:** `extracting-medicine-names-from-multilingual-prescriptions`

**Dek:** A small document-intelligence service for Arabic, English, and French prescriptions—and an example of why medical OCR needs explicit human verification.

Prescriptions are a difficult OCR input. Handwriting is inconsistent, abbreviations are local, medicine names are easy to confuse, and a single page may move between Arabic, English, and French. A technically successful extraction is still not a safe dispensing decision.

This project wraps a Gemini-based extraction step in two practical interfaces: a command-line tool for individual images or directories, and a FastAPI service for integration. The output is structured around medicine names and can be checked against an optional medicine database.

### Structure around the model

The model call is only one part of the system. Batch processing needs bounded parallelism and clear output locations. An API needs validation, error handling, and a predictable result shape. Configuration and credentials must stay outside the repository. The optional database supports normalization and review without pretending that a fuzzy match is clinical truth.

Multilingual input also changes evaluation. A useful test set needs variation in script, handwriting, image quality, rotation, lighting, and the presence of non-medicine text. Accuracy should be reported at the extracted-name level, with separate accounting for missed names, incorrect additions, and uncertain matches.

### The safety boundary is part of the product

This is an extraction prototype. It does not prescribe, dispense, check interactions, or replace a pharmacist or clinician. Every output requires human verification against the source image. Real prescription images may contain personal health information, so public demonstrations should use synthetic or safely redacted material.

Those constraints are not a disclaimer attached after the implementation. They determine which data can be stored, what logs may contain, how results are presented, and whether the interface encourages confirmation.

The broader lesson is simple: applied AI becomes useful when the system around the model makes its uncertainty and limits operational. Returning a list is easy. Returning a list that a person can safely review is the real task.

**Evidence links:** GitHub repository; CLI and FastAPI documentation.

---

## Designing election information for verifiability

**Slug:** `designing-election-information-for-verifiability`

**Dek:** In civic technology, the source and history of a fact matter as much as the interface that displays it.

Daleel—Arabic for “guide”—is a Lebanese parliamentary-election information project built around a simple principle: political information should be inspectable. A candidate profile or district record is more useful when a reader can see where it came from and when it changed.

That requirement changes the architecture. An ordinary content system optimizes for the current value. Daleel's design treats history and sources as first-class data. Its public repository describes archived sources, append-only records, and immutable data models intended to preserve a verifiable trail.

### Neutrality needs mechanisms

Calling a platform independent does not make it neutral. The product has to show its work. Source links, archived evidence, consistent fields, and change history give readers tools to evaluate a record without trusting the publisher blindly.

The platform is multilingual in Arabic, English, and French. That is not a cosmetic translation layer in Lebanon; it affects names, search, layout direction, source availability, and the risk of different language versions drifting apart.

The documented stack pairs a Next.js frontend with an Express backend and Prisma/PostgreSQL. Authentication, CSRF protection, rate limiting, and immutable models support the public information layer. The security work is part of editorial integrity because unauthorized changes would undermine the central promise.

### What the project does not claim

Daleel is not an official election authority, and the current repository alone does not prove that its dataset is complete or live. It should be described as an independent civic-technology initiative and an engineering approach to verifiable election information.

The hard work ahead is institutional as much as technical: source standards, correction workflows, contributor governance, legal review, and a visible policy for disputed information. A database can preserve history, but people still decide what enters it and how errors are handled.

The project is valuable because it makes those decisions explicit. For high-trust public information, a polished profile page is not enough. Provenance is a product feature.

**Evidence links:** GitHub repository; technical documentation.

---

## Building an adaptive motorcycle theory trainer for Lebanon

**Slug:** `building-an-adaptive-motorcycle-theory-trainer-for-lebanon`

**Dek:** An Arabic RTL study tool that keeps progress in the browser and spends practice time on the questions a learner is most likely to miss.

The Lebanese Motorcycle Theory Exam Trainer is a focused React application, not an online course platform. It contains 251 multiple-choice questions, including 101 road-sign questions with extracted sign images. Exam mode selects 30 questions and uses a 25/30 passing threshold. Practice mode remembers weak and recently missed material.

### Random is not the same as useful

Pure random selection can repeat familiar questions while leaving large parts of a bank unseen. The trainer uses coverage-aware selection so new attempts introduce unseen material before over-drilling what the learner already knows. Missed and weaker questions receive more attention, and a review mode makes mistakes easy to revisit.

The application stores progress in localStorage. That keeps the tool usable without an account or backend and avoids collecting personal study history. It also means progress belongs to one browser unless the learner exports or moves it through a future feature.

Arabic right-to-left layout is built into the experience rather than applied at the end. Question flow, answer alignment, numbers, road-sign images, and mixed-script labels all need deliberate handling. A technically correct translation can still feel broken if directionality is inconsistent.

### Keep the claim honest

The trainer uses the documented Lebanese motorcycle question set, but it is not an official government application and should not imply endorsement. Rules and exam procedures can change; the question source and update date need to remain visible when the tool is published.

The project shows how a small local-first interface can improve a very specific learning loop. It does not need profiles, streaks, social features, or an AI tutor to be useful. It needs good question coverage, clear feedback, accurate content, and a respectful Arabic interface.

**Evidence links:** GitHub repository; application README and question data.

---

## Building a local-first AI support triage council

**Slug:** `building-a-local-first-ai-support-triage-council`

**Dek:** An internal support workflow where an LLM proposes structure, deterministic rules enforce policy, and a human keeps the final say.

The AI Customer Support Council is a self-hosted technical-assessment project built for Valsoft Corporation. It is an internal admin console for synthetic B2B support requests, not a customer-facing help desk.

The application takes a submission through intake, machine-assisted triage, deterministic routing and escalation, human review, persistence, and structured export. Its four screens—login, dashboard, submissions, and submission detail—are deliberately narrow because the product has one operator and one job.

### The LLM is one component, not the workflow

An LLM can turn messy text into proposed categories, urgency, and rationale. It should not quietly become the policy engine. The project separates model output from deterministic rules such as confidence thresholds and escalation conditions. A low-confidence response can be sent for review no matter how fluent the explanation sounds.

State is stored in PostgreSQL. Background work runs through Redis and RQ. The backend uses FastAPI, Pydantic, SQLAlchemy, and Alembic; the frontend uses React, TypeScript, Vite, TanStack Query, React Hook Form, and Zod. Ollama with a local model is the default provider, with an optional OpenAI-compatible endpoint.

That local-first default matters for privacy, cost control, and repeatability. It also creates operational responsibilities: model availability, queue state, migrations, auditability, and a clear distinction between a failed inference and a failed support request.

### Human review is a designed state

The reviewer needs to see the original submission, the model's proposal, confidence, and the rules that changed or escalated it. Accepting or overriding a result should be explicit. The export must reflect the reviewed state, not a hidden intermediate prediction.

The best pattern here is not “replace support staff with AI.” It is to make a noisy intake queue easier to inspect while keeping policy deterministic and decisions attributable. The council metaphor works only when disagreement, uncertainty, and review remain visible.

**Evidence links:** GitHub repository; architecture and testing documentation.

---

## Designing an offline-first personal finance desktop app

**Slug:** `designing-an-offline-first-personal-finance-desktop-app`

**Dek:** REE treats personal finance as a private desktop workflow: fast entry, local storage, and enough structure to understand where money moves.

Personal finance tools often begin with the dashboard. REE began with the records behind it: wallets, income, expenses, transfers, subscriptions, debts, savings goals, and the repeated work of entering them.

The application is built in Flutter for desktop. It supports multiple wallets, categorized transactions, bulk entry, recurring-payment tracking, debts in both directions, savings goals, and monthly and yearly analysis. The repository documents a clean architecture with separate data, domain, and presentation concerns and local SQLite storage.

### Desktop-first changes the interaction

A desktop finance tool should respect keyboards, larger tables, and the fact that a person may enter many records in one session. Bulk entry is not an advanced feature hidden in settings; it is a core workflow. The interface can use space for comparison and history without turning every value into a decorative card.

Offline-first also makes the ownership model clear. The main record is local. The app can start and remain useful without an account or continuous network connection. Backup and export become essential because local ownership without recovery is fragile.

### Architecture follows trust

Finance data is sensitive even when the application is not connected to a bank. Storage paths, backups, logs, and exports need predictable behavior. Separating domain logic from the interface makes calculations testable and reduces the risk that a presentation change alters financial rules.

The project is not a claim that a visual style alone makes finance easier. Its stronger idea is operational: keep the data close, make repetitive work efficient, and let insights emerge from records the user can inspect.

The next quality bar is long-term reliability—migration tests, backup restoration, import validation, and clear handling of rounding and currency. A personal finance app earns trust slowly, one predictable operation at a time.

**Evidence links:** GitHub repository; architecture, storage, and build documentation.
