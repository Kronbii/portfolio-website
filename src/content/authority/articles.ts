import type { ArticleRecord } from './types'

export const articles: ArticleRecord[] = [
  {
    slug: 'building-a-360-panorama-stitcher-from-a-phone-sweep',
    state: 'ready',
    title: 'Building a 360° panorama stitcher from a phone sweep',
    metaTitle: 'Building a 360° panorama stitcher from a phone sweep',
    metaDescription:
      'A phone video, a pure-rotation camera model, and a stubborn question about how much of a 360° reconstruction pipeline can be made explicit instead of hidden behind a stitching API.',
    dek: 'A phone video, a pure-rotation camera model, and a stubborn question: how much of a 360° reconstruction pipeline can be made explicit instead of hidden behind a stitching API?',
    heroMedia: {
      src: '/images/authority/spherical-panorama/pano-on-band.jpg',
      alt: 'Recovered spherical band from a horizontal phone sweep, laid flat as an equirectangular image.',
      caption: 'Recovered band from a horizontal phone sweep. Only 36.9% of the sphere is captured.',
    },
    body: [
      {
        kind: 'p',
        text: 'A panorama looks simple only after it works. Before that, it is a chain of small geometric errors. A few bad correspondences tilt the camera estimate. A fraction of a degree of pitch error accumulates into a staircase along a ceiling. A handheld step sideways introduces parallax that no homography can honestly explain.',
      },
      {
        kind: 'p',
        text: 'I built this pipeline to make that chain visible. It accepts a phone video or a folder of stills and produces an equirectangular panorama plus a self-contained Three.js viewer. The implementation is CPU-only Python and OpenCV. There is no gyroscope dependency and no opaque “stitch” call doing the whole job.',
      },
      { kind: 'h3', text: 'The pipeline is eight decisions, not one algorithm' },
      {
        kind: 'p',
        text: 'Frames are extracted from video by interval, count, frame rate, or measured motion. Camera intrinsics come from EXIF when possible, then fall back to an explicit field of view or calibration file. Adjacent frames are matched with ORB features, Lowe’s ratio test, and RANSAC. If an adjacent pair fails, the matcher tries across the gap and interpolates the missing step instead of silently discarding the frame.',
      },
      {
        kind: 'p',
        text: 'The useful part begins after the homography. Under a pure-rotation model, the relative camera rotation is recovered with R = K⁻¹HK. Numerical noise means that matrix is rarely a perfect rotation, so singular-value decomposition projects it back onto the rotation manifold before the estimates are chained into global orientations.',
      },
      {
        kind: 'p',
        text: 'Each source frame is then inverse-warped onto an equirectangular canvas: an output pixel becomes a world direction, that direction is rotated into the camera, projected onto the image plane, and sampled. Overlaps can be blended in several ways, and unseen regions can be filled, with the important caveat that filling is not reconstruction.',
      },
      { kind: 'h3', text: 'The straight line that exposed the real problem' },
      {
        kind: 'p',
        text: 'On the documented sample, independent pairwise estimates left only small pitch and roll errors. They were still enough to turn long architectural edges into a visible staircase. A moving average over the chained rotations reduced pitch wobble by 13.5× and roll wobble by 5.2× on that run.',
      },
      {
        kind: 'p',
        text: 'That fix is deliberately modest. It does not replace global bundle adjustment or close the loop around a full sweep. It solves the instability that was actually visible while keeping the pipeline easy to inspect.',
      },
      { kind: 'h3', text: 'What the sample run says—and what it does not' },
      {
        kind: 'p',
        text: 'The sample used 309 phone-video frames and recovered a 333° sweep. Median RANSAC support was 921 inliers per adjacent pair; 15 of 308 pairs were recovered through interpolation. At 4096 × 2048, the full run took about two minutes on a Ryzen 7 5800H, including roughly 19 seconds of feature matching and 96 seconds of warping.',
      },
      {
        kind: 'p',
        text: 'Only 36.9% of the sphere had actually been photographed. A phone-height horizontal sweep sees a band around the viewer, not the floor and ceiling. The missing poles can be inpainted, but they should never be described as captured detail.',
      },
      {
        kind: 'p',
        text: 'The other limit is parallax. The model assumes the phone rotates around its optical center. Translate while sweeping past a nearby object and the scene no longer has a single homography. Blank walls and repeated textures also weaken matching. There is no bundle adjustment or exposure matching in the current version, so drift and brightness changes remain honest targets for future work.',
      },
      {
        kind: 'p',
        text: 'The result is useful because it is inspectable. Every stage has a module, the run records its resolved configuration and intrinsics, more than 200 tests cover the pipeline, and the browser viewer makes the final geometry tangible. It is less a magic panorama button than a working map of the decisions behind one.',
      },
    ],
    evidence: 'GitHub repository; live demo; technical method; temporal smoothing notes.',
    sources: [
      {
        label: 'GitHub — 360-spherical-stitching',
        href: 'https://github.com/Kronbii/360-spherical-stitching',
        kind: 'repository',
      },
      { label: 'Live viewer — 360.ramikronbi.com', href: 'https://360.ramikronbi.com', kind: 'demo' },
      {
        label: 'TECHNICAL.md — method notes',
        href: 'https://github.com/Kronbii/360-spherical-stitching/blob/main/TECHNICAL.md',
        kind: 'documentation',
      },
      {
        label: 'TEMPORAL_SMOOTHING.md',
        href: 'https://github.com/Kronbii/360-spherical-stitching/blob/main/TEMPORAL_SMOOTHING.md',
        kind: 'documentation',
      },
    ],
    projectSlug: '360-spherical-panorama-stitching',
    topics: ['computer-vision', 'robotics-perception', 'open-source-engineering'],
    keywords: ['panorama pipeline', 'ORB features', 'temporal smoothing', 'equirectangular'],
  },
  {
    slug: 'designing-a-pid-library-for-real-embedded-control',
    state: 'ready',
    title: 'Designing a PID library for real embedded control',
    metaTitle: 'Designing a PID library for real embedded control',
    metaDescription:
      'The PID equation is short. A controller that behaves predictably on an Arduino needs much more than three gains.',
    dek: 'The PID equation is short. A controller that behaves predictably on an Arduino needs much more than three gains.',
    body: [
      {
        kind: 'p',
        text: 'Most introductions to PID control end at the formula. Real embedded control starts after it. The loop may run late. An actuator saturates. Sensor noise dominates the derivative term. A second controller needs to coexist with the first. The person tuning the system needs to see what each term is doing instead of guessing from the final output.',
      },
      {
        kind: 'p',
        text: 'easyPID grew from that gap. It is a hardware-agnostic Arduino library built around independent controller instances rather than global state. A project can run multiple loops, use automatic millis() timing or pass an explicit time delta, change gains at runtime, limit outputs, and inspect the controller’s internal state.',
      },
      { kind: 'h3', text: 'Timing belongs in the interface' },
      {
        kind: 'p',
        text: 'A control loop is not only a function of error; it is a function of time. Hiding the sample interval makes a controller look stable in one sketch and behave differently when logging, communication, or another sensor changes the loop duration.',
      },
      {
        kind: 'p',
        text: 'easyPID therefore supports two timing modes. Automatic timing is convenient for ordinary Arduino sketches. Manual delta time lets a scheduler or test harness own the clock. The latter also makes simulation and repeatable tests easier because time becomes input rather than ambient state.',
      },
      { kind: 'h3', text: 'Saturation and noise are normal operating conditions' },
      {
        kind: 'p',
        text: 'Integral windup happens when the requested output exceeds what the actuator can deliver while the integral term keeps accumulating. When the system finally returns to a controllable range, that stored error can drive a long overshoot. The library provides selectable anti-windup behavior and explicit output bounds so saturation is part of the model.',
      },
      {
        kind: 'p',
        text: 'Derivative action has the opposite sensitivity: it reacts strongly to high-frequency measurement noise. Optional low-pass filtering makes the derivative term usable on the sensors people actually connect to microcontrollers.',
      },
      {
        kind: 'p',
        text: 'State introspection is just as important. Exposing the proportional, integral, and derivative contributions turns tuning from a ritual into diagnosis. If the integral term is carrying the system, or the derivative term is amplifying noise, the evidence is available.',
      },
      { kind: 'h3', text: 'Autotuning is a tool with consequences' },
      {
        kind: 'p',
        text: 'The optional relay autotuner deliberately drives the process into oscillation and derives candidate gains from the response. That can be useful, but it is not a safe default. The actuator must have limits, the process must tolerate repeated oscillation, and a person must be ready to stop the run. The documentation treats those conditions as part of the feature rather than a footnote.',
      },
      {
        kind: 'p',
        text: 'easyPID is distributed through Arduino Library Manager as a contributed Device Control library and remains small enough for Uno-class AVR boards. Its main design lesson is broader than PID: reusable embedded code should expose timing, limits, state, and failure modes. The equation is the easy part. The contract around it is what makes it reusable.',
      },
    ],
    evidence: 'GitHub repository; Arduino Library Manager listing; examples and tuning documentation.',
    sources: [
      { label: 'GitHub — easyPID', href: 'https://github.com/Kronbii/easyPID', kind: 'repository' },
      {
        label: 'Arduino Library Manager listing',
        href: 'https://www.arduinolibraries.info/libraries/easy-pid',
        kind: 'listing',
      },
      {
        label: 'Examples and tuning documentation',
        href: 'https://github.com/Kronbii/easyPID/tree/main/examples',
        kind: 'documentation',
      },
    ],
    projectSlug: 'easypid-arduino-library',
    topics: ['embedded-systems', 'control-systems', 'open-source-engineering'],
    keywords: ['PID library', 'Arduino', 'anti-windup', 'autotune', 'derivative filtering'],
  },
  {
    slug: 'building-an-autonomous-race-car-in-twenty-days',
    state: 'ready',
    title: 'Building an autonomous race car in twenty days',
    metaTitle: 'Building an autonomous race car in twenty days',
    metaDescription:
      'A small autonomous vehicle forced perception, control, power, mechanics, and team decisions into one unforgiving loop.',
    dek: 'A small autonomous vehicle forced perception, control, power, mechanics, and team decisions into one unforgiving loop.',
    heroMedia: {
      src: '/images/authority/race-car/front.jpeg',
      alt: 'Front view of the Brainiacs autonomous race car, showing camera, chassis, and drivetrain.',
      caption: 'The Brainiacs vehicle — camera above the drive.',
    },
    body: [
      {
        kind: 'p',
        text: 'Twenty days is not enough time to make every subsystem elegant. It is enough time to learn which boundaries matter.',
      },
      {
        kind: 'p',
        text: 'The Brainiacs vehicle was built for the 2023 World Robot Olympiad Future Engineers challenge. It had to read the track, react to traffic markers, avoid obstacles, and keep moving reliably. The practical answer was not one powerful computer doing everything. We divided the problem between a Jetson Nano and an Arduino Mega.',
      },
      {
        kind: 'p',
        text: 'The Jetson handled camera work in Python and OpenCV. It extracted the visual events that mattered to driving rather than sending raw imagery downstream. The Arduino owned the time-sensitive control loop: steering, motor commands, and sensor readings that should not pause because a vision frame took longer than expected.',
      },
      { kind: 'h3', text: 'Splitting perception from control' },
      {
        kind: 'p',
        text: 'That division made the system easier to reason about. Computer vision is bursty. Exposure changes, a difficult frame, or a detection step can move execution time around. Steering control needs a predictable cadence. A simple command interface between the two processors isolated those timing behaviors.',
      },
      {
        kind: 'p',
        text: 'The rest of the sensing stack filled gaps the camera could not cover alone. A TCS34725 color sensor supported track and corner logic. An MPU6050 IMU gave the controller another view of motion and heading. PID steering converted error into smoother corrections than a sequence of hard left/right rules.',
      },
      { kind: 'h3', text: 'Calibration became part of the software' },
      {
        kind: 'p',
        text: 'The repository documents camera thresholds, IMU bias, color sensing, and PID tuning because those values were not incidental. They were the difference between code that looked plausible and a vehicle that completed laps.',
      },
      {
        kind: 'p',
        text: 'This kind of build also exposes power and mechanical constraints quickly. A vision model cannot compensate for loose steering geometry. A clean control loop cannot fix voltage sag. The useful engineering work happens at the interfaces: making a camera event specific enough for the controller, making the controller tolerant of noisy sensors, and keeping the wiring and frame serviceable while the design changes daily.',
      },
      {
        kind: 'p',
        text: 'Rafik Hariri University reported that Rami Kronbi and Wassim Ghaddar placed third in the Future Engineers category in July 2023. The university also noted that its teams built their robots from scratch in twenty days.',
      },
      {
        kind: 'p',
        text: 'The placement matters, but the lasting result is the architecture. The project is an end-to-end autonomous system small enough to see all at once: photons become features, features become events, events become steering commands, and those commands meet a physical vehicle with inertia, noise, and imperfect hardware.',
      },
    ],
    evidence: 'GitHub repository; RHU’s July 2023 competition report.',
    sources: [
      {
        label: 'GitHub — autonomous-race-car',
        href: 'https://github.com/Kronbii/autonomous-race-car',
        kind: 'repository',
      },
      {
        label: 'RHU — competition report',
        href: 'https://www.rhu.edu.lb/media-room/news/rhu-engineering-students-win-big-in-the-world-robotics-olympiad',
        kind: 'institution',
      },
    ],
    projectSlug: 'brainiacs-autonomous-race-car',
    topics: ['robotics', 'embedded-systems', 'computer-vision', 'control-systems'],
    keywords: ['WRO Future Engineers', 'Jetson Nano', 'PID steering', 'MPU6050'],
  },
  {
    slug: 'adapting-super-resolution-to-thermal-imagery',
    state: 'ready',
    title: 'Adapting super-resolution to thermal imagery',
    metaTitle: 'Adapting super-resolution to thermal imagery',
    metaDescription:
      'Upscaling a thermal frame is not the same problem as enlarging an RGB photograph, especially when the result must run beside the rest of a perception stack.',
    dek: 'Upscaling a thermal frame is not the same problem as enlarging an RGB photograph, especially when the result must run beside the rest of a perception stack.',
    heroMedia: {
      src: '/images/authority/thermal-super-resolution/x3-showcase.png',
      alt: 'Side-by-side ×3 thermal super-resolution comparison from the project results directory.',
      caption: '×3 thermal super-resolution — comparison from the results directory.',
    },
    body: [
      {
        kind: 'p',
        text: 'Low-resolution thermal sensors are useful because they see structure that ordinary cameras miss, particularly in darkness and low-contrast scenes. Their price rises sharply with resolution. Super-resolution offers another path: spend computation to recover a more useful signal from the sensor already available.',
      },
      {
        kind: 'p',
        text: 'The catch is that an RGB super-resolution model learns the visual statistics of ordinary photographs. It is rewarded for reconstructing texture, color edges, and detail that may have no thermal meaning. A plausible-looking result can be worse than a soft one if it invents gradients that downstream perception treats as evidence.',
      },
      {
        kind: 'p',
        text: 'This project adapts an Information Multi-Distillation Network to single-channel thermal data. RGB pretraining provides a useful starting point, while a thermal-specific training objective shifts attention toward gradients, contrast, and structure that belong to heat imagery.',
      },
      { kind: 'h3', text: 'Quality has to be measured at every scale' },
      {
        kind: 'p',
        text: 'On the evaluation reported in my canonical project record, the model reached 34.2 dB PSNR and 0.840 SSIM at ×2 enlargement, 31.0 dB and 0.757 at ×3, and 29.6 dB and 0.713 at ×4. Those numbers should be read with their scale: the task becomes less constrained as the enlargement factor grows.',
      },
      {
        kind: 'p',
        text: 'They also do not replace visual inspection. Side-by-side crops reveal whether an edge became cleaner or merely sharper, whether small hot objects survive reconstruction, and where the model smooths detail away.',
      },
      { kind: 'h3', text: 'Edge deployment changes the model' },
      {
        kind: 'p',
        text: 'A robotics pipeline rarely gets the entire device to itself. Super-resolution may sit before detection, tracking, or measurement. Latency, memory traffic, and preprocessing therefore matter as much as the neural network.',
      },
      {
        kind: 'p',
        text: 'The deployment work moved inference toward FP16 and INT8 execution and measured the system on NVIDIA Jetson hardware. The currently reviewed figure is approximately 45 frames per second on Jetson AGX Orin. I am deliberately not combining that number with higher desktop GPU figures found in older repository copy; hardware and benchmark protocol must travel with any speed claim.',
      },
      {
        kind: 'p',
        text: 'That distinction is central to the project. “Real time” is not a property of a model file. It is a property of a complete pipeline on named hardware, at a named input size, while doing the work around inference.',
      },
      {
        kind: 'p',
        text: 'Thermal super-resolution is valuable when it improves a downstream decision without hiding uncertainty. The responsible next evaluations are therefore task-based: does a detector find more relevant objects, does measurement remain stable, and where does reconstruction create false confidence? Better-looking frames are not the final objective. Better perception is.',
      },
    ],
    evidence: 'GitHub repository; canonical CV; evaluation images and demo videos.',
    sources: [
      {
        label: 'GitHub — thermal-super-resolution',
        href: 'https://github.com/Kronbii/thermal-super-resolution',
        kind: 'repository',
      },
      {
        label: 'Canonical CV — quality and edge figures',
        href: 'https://github.com/Kronbii/thermal-super-resolution#readme',
        kind: 'cv',
      },
    ],
    projectSlug: 'thermal-super-resolution',
    topics: ['computer-vision', 'edge-ai', 'robotics-perception'],
    keywords: ['thermal super-resolution', 'IMDN', 'Jetson AGX Orin', 'edge deployment'],
  },
  {
    slug: 'what-a-two-axis-light-tracker-teaches-about-pid-control',
    state: 'ready',
    title: 'What a two-axis light tracker teaches about PID control',
    metaTitle: 'What a two-axis light tracker teaches about PID control',
    metaDescription:
      'A small Arduino robot turns control theory into something visible: error, overshoot, noise, saturation, and settling all happen in front of you.',
    dek: 'A small Arduino robot turns control theory into something visible: error, overshoot, noise, saturation, and settling all happen in front of you.',
    body: [
      {
        kind: 'p',
        text: 'A light-tracking robot has a clean objective. Measure where the light is, move two servo axes, and keep the source centered. That simplicity makes it a good control experiment because the interesting behavior cannot hide behind a complex application.',
      },
      {
        kind: 'p',
        text: 'The project uses light sensing to estimate directional error, an Arduino to run the controller, and yaw and pitch servos to move the sensor assembly. Rami Kronbi led the software and system architecture; Wassim Ghaddar contributed hardware integration and testing, as recorded in the repository.',
      },
      {
        kind: 'p',
        text: 'The first version of a tracker can be made to move with proportional control. The useful version has to settle. Too much proportional gain creates oscillation. Too little leaves the mechanism slow and hesitant. Integral action can remove persistent bias, but it can also build up while a servo is already at its limit. Derivative action can damp motion, but a noisy sensor can turn it into jitter.',
      },
      { kind: 'h3', text: 'Mechanics are inside the loop' },
      {
        kind: 'p',
        text: 'Servo backlash, limited travel, sensor placement, chassis flex, and wiring are not external annoyances. They change the plant being controlled. A gain set that behaves well on one axis may be wrong for the other because the inertia and friction differ.',
      },
      {
        kind: 'p',
        text: 'Calibration therefore includes more than choosing three numbers. The system needs a defined center, safe mechanical limits, sensible sensor filtering, and an update rate that remains consistent. Debug output helps separate a bad measurement from a bad controller response.',
      },
      {
        kind: 'p',
        text: 'The project includes Arduino source, CAD models, a Proteus simulation, a report, and a real demonstration video. Together they make the control loop inspectable from code to mechanism.',
      },
      {
        kind: 'p',
        text: 'The most useful lesson is that PID tuning is not a one-time formula. It is a conversation between measurement, time, actuation, and the physical system. A two-axis tracker makes that conversation easy to see—and difficult to fake.',
      },
    ],
    evidence: 'GitHub repository; project demonstration video.',
    sources: [
      {
        label: 'GitHub — PID-light-tracker',
        href: 'https://github.com/Kronbii/PID-light-tracker',
        kind: 'repository',
      },
      {
        label: 'Project demonstration video',
        href: 'https://youtu.be/Ye032oekX0A',
        kind: 'video',
      },
    ],
    projectSlug: 'pid-light-tracking-robot',
    topics: ['robotics', 'embedded-systems', 'control-systems'],
    keywords: ['PID tuning', 'sensor noise', 'servo saturation', 'settling'],
  },
  {
    slug: 'turning-segmented-cracks-into-measurable-paths',
    state: 'ready',
    title: 'Turning segmented cracks into measurable paths',
    metaTitle: 'Turning segmented cracks into measurable paths',
    metaDescription:
      'A segmentation mask says which pixels belong to a crack. Inspection work often needs the next layer: an ordered line, a trace, and measurements that can be compared.',
    dek: 'A segmentation mask says which pixels belong to a crack. Inspection work often needs the next layer: an ordered line, a trace, and measurements that can be compared.',
    heroMedia: {
      src: '/images/authority/fine-crack/test-frame.png',
      alt: 'Test frame from the fine-crack tracing repository showing a thin crack across a rough surface.',
      caption: 'Test frame — a starting point for tracing evaluation.',
    },
    body: [
      {
        kind: 'p',
        text: 'Crack segmentation produces a region. Many inspection tasks need a path. They need to trace where the crack runs, smooth the trace without erasing meaningful bends, compare it with a reference, and export results that can be analyzed outside a notebook.',
      },
      {
        kind: 'p',
        text: 'The fine-crack tracing toolkit packages that work as an installable Python project with a command-line interface. It consumes raw frames and pre-segmented masks, extracts candidate crack points, orders them, optionally fits smoother curves, generates overlays, and exports metrics in CSV and JSON.',
      },
      {
        kind: 'p',
        text: 'The repository exposes several ordering strategies rather than pretending one heuristic fits every geometry: a classic approach, a minimum-spanning-tree path, and a greedy alternative. ORB or Shi-Tomasi features can support corner detection where local structure matters. The output can be evaluated with precision, recall, F1, IoU, mean and maximum distance, and RMS error.',
      },
      { kind: 'h3', text: 'Why packaging matters' },
      {
        kind: 'p',
        text: 'Computer-vision experiments often stop in the state where only the original author can reproduce them. Paths are hard-coded, configuration lives in notebook cells, and evaluation is a collection of plots with no machine-readable record.',
      },
      {
        kind: 'p',
        text: 'Turning the work into a package changes the engineering question. Inputs and outputs need contracts. Configuration needs predictable precedence. Runs need named output directories. Metrics need stable serialization. A command such as `fine-tracing run` or `fine-tracing metrics` becomes a repeatable interface rather than a memory of which cells to execute.',
      },
      {
        kind: 'p',
        text: 'The toolkit is not a crack detector and should not be described as one. It begins after segmentation. That boundary is useful: it keeps the package focused on geometry and evaluation while allowing different segmentation models to feed it.',
      },
      {
        kind: 'p',
        text: 'The next serious validation step is dataset-level comparison across crack types, widths, branching patterns, and imaging conditions. The current value is the reproducible bridge from mask to path—the layer required before a thin visual defect can become a measurement.',
      },
    ],
    evidence: 'GitHub repository; package README and CLI documentation.',
    sources: [
      {
        label: 'GitHub — fine-crack-detection',
        href: 'https://github.com/Kronbii/fine-crack-detection',
        kind: 'repository',
      },
      {
        label: 'Package README and CLI documentation',
        href: 'https://github.com/Kronbii/fine-crack-detection#readme',
        kind: 'documentation',
      },
    ],
    projectSlug: 'fine-crack-tracing-toolkit',
    topics: ['computer-vision', 'infrastructure-inspection', 'open-source-engineering'],
    keywords: ['crack tracing', 'ordered paths', 'IoU', 'segmentation post-processing'],
  },
  {
    slug: 'extracting-medicine-names-from-multilingual-prescriptions',
    state: 'ready',
    title: 'Extracting medicine names from multilingual prescriptions',
    metaTitle: 'Extracting medicine names from multilingual prescriptions',
    metaDescription:
      'A small document-intelligence service for Arabic, English, and French prescriptions—and an example of why medical OCR needs explicit human verification.',
    dek: 'A small document-intelligence service for Arabic, English, and French prescriptions—and an example of why medical OCR needs explicit human verification.',
    body: [
      {
        kind: 'p',
        text: 'Prescriptions are a difficult OCR input. Handwriting is inconsistent, abbreviations are local, medicine names are easy to confuse, and a single page may move between Arabic, English, and French. A technically successful extraction is still not a safe dispensing decision.',
      },
      {
        kind: 'p',
        text: 'This project wraps a Gemini-based extraction step in two practical interfaces: a command-line tool for individual images or directories, and a FastAPI service for integration. The output is structured around medicine names and can be checked against an optional medicine database.',
      },
      { kind: 'h3', text: 'Structure around the model' },
      {
        kind: 'p',
        text: 'The model call is only one part of the system. Batch processing needs bounded parallelism and clear output locations. An API needs validation, error handling, and a predictable result shape. Configuration and credentials must stay outside the repository. The optional database supports normalization and review without pretending that a fuzzy match is clinical truth.',
      },
      {
        kind: 'p',
        text: 'Multilingual input also changes evaluation. A useful test set needs variation in script, handwriting, image quality, rotation, lighting, and the presence of non-medicine text. Accuracy should be reported at the extracted-name level, with separate accounting for missed names, incorrect additions, and uncertain matches.',
      },
      { kind: 'h3', text: 'The safety boundary is part of the product' },
      {
        kind: 'p',
        text: 'This is an extraction prototype. It does not prescribe, dispense, check interactions, or replace a pharmacist or clinician. Every output requires human verification against the source image. Real prescription images may contain personal health information, so public demonstrations should use synthetic or safely redacted material.',
      },
      {
        kind: 'p',
        text: 'Those constraints are not a disclaimer attached after the implementation. They determine which data can be stored, what logs may contain, how results are presented, and whether the interface encourages confirmation.',
      },
      {
        kind: 'p',
        text: 'The broader lesson is simple: applied AI becomes useful when the system around the model makes its uncertainty and limits operational. Returning a list is easy. Returning a list that a person can safely review is the real task.',
      },
    ],
    evidence: 'GitHub repository; CLI and FastAPI documentation.',
    sources: [
      {
        label: 'GitHub — medical-prescription-OCR',
        href: 'https://github.com/Kronbii/medical-prescription-OCR',
        kind: 'repository',
      },
      {
        label: 'CLI and FastAPI documentation',
        href: 'https://github.com/Kronbii/medical-prescription-OCR#readme',
        kind: 'documentation',
      },
    ],
    projectSlug: 'multilingual-medical-prescription-ocr',
    topics: ['applied-ai', 'health-technology', 'document-intelligence'],
    keywords: ['medical OCR', 'multilingual', 'human verification', 'FastAPI'],
  },
  {
    slug: 'designing-election-information-for-verifiability',
    state: 'ready',
    title: 'Designing election information for verifiability',
    metaTitle: 'Designing election information for verifiability',
    metaDescription:
      'In civic technology, the source and history of a fact matter as much as the interface that displays it.',
    dek: 'In civic technology, the source and history of a fact matter as much as the interface that displays it.',
    heroMedia: {
      src: '/images/authority/daleel/hero.jpeg',
      alt: 'Daleel platform hero image from the project repository.',
      caption: 'Daleel — the project’s hero image from the public repository.',
    },
    body: [
      {
        kind: 'p',
        text: 'Daleel—Arabic for “guide”—is a Lebanese parliamentary-election information project built around a simple principle: political information should be inspectable. A candidate profile or district record is more useful when a reader can see where it came from and when it changed.',
      },
      {
        kind: 'p',
        text: 'That requirement changes the architecture. An ordinary content system optimizes for the current value. Daleel’s design treats history and sources as first-class data. Its public repository describes archived sources, append-only records, and immutable data models intended to preserve a verifiable trail.',
      },
      { kind: 'h3', text: 'Neutrality needs mechanisms' },
      {
        kind: 'p',
        text: 'Calling a platform independent does not make it neutral. The product has to show its work. Source links, archived evidence, consistent fields, and change history give readers tools to evaluate a record without trusting the publisher blindly.',
      },
      {
        kind: 'p',
        text: 'The platform is multilingual in Arabic, English, and French. That is not a cosmetic translation layer in Lebanon; it affects names, search, layout direction, source availability, and the risk of different language versions drifting apart.',
      },
      {
        kind: 'p',
        text: 'The documented stack pairs a Next.js frontend with an Express backend and Prisma/PostgreSQL. Authentication, CSRF protection, rate limiting, and immutable models support the public information layer. The security work is part of editorial integrity because unauthorized changes would undermine the central promise.',
      },
      { kind: 'h3', text: 'What the project does not claim' },
      {
        kind: 'p',
        text: 'Daleel is not an official election authority, and the current repository alone does not prove that its dataset is complete or live. It should be described as an independent civic-technology initiative and an engineering approach to verifiable election information.',
      },
      {
        kind: 'p',
        text: 'The hard work ahead is institutional as much as technical: source standards, correction workflows, contributor governance, legal review, and a visible policy for disputed information. A database can preserve history, but people still decide what enters it and how errors are handled.',
      },
      {
        kind: 'p',
        text: 'The project is valuable because it makes those decisions explicit. For high-trust public information, a polished profile page is not enough. Provenance is a product feature.',
      },
    ],
    evidence: 'GitHub repository; technical documentation.',
    sources: [
      { label: 'GitHub — daleel', href: 'https://github.com/Kronbii/daleel', kind: 'repository' },
      {
        label: 'TECHNICAL.md',
        href: 'https://github.com/Kronbii/daleel/blob/main/TECHNICAL.md',
        kind: 'documentation',
      },
    ],
    projectSlug: 'daleel-lebanese-election-information',
    topics: ['civic-technology', 'information-integrity', 'full-stack-systems'],
    keywords: ['civic technology', 'append-only', 'provenance', 'Lebanese elections'],
  },
  {
    slug: 'building-an-adaptive-motorcycle-theory-trainer-for-lebanon',
    state: 'ready',
    title: 'Building an adaptive motorcycle theory trainer for Lebanon',
    metaTitle: 'Building an adaptive motorcycle theory trainer for Lebanon',
    metaDescription:
      'An Arabic RTL study tool that keeps progress in the browser and spends practice time on the questions a learner is most likely to miss.',
    dek: 'An Arabic RTL study tool that keeps progress in the browser and spends practice time on the questions a learner is most likely to miss.',
    body: [
      {
        kind: 'p',
        text: 'The Lebanese Motorcycle Theory Exam Trainer is a focused React application, not an online course platform. It contains 251 multiple-choice questions, including 101 road-sign questions with extracted sign images. Exam mode selects 30 questions and uses a 25/30 passing threshold. Practice mode remembers weak and recently missed material.',
      },
      { kind: 'h3', text: 'Random is not the same as useful' },
      {
        kind: 'p',
        text: 'Pure random selection can repeat familiar questions while leaving large parts of a bank unseen. The trainer uses coverage-aware selection so new attempts introduce unseen material before over-drilling what the learner already knows. Missed and weaker questions receive more attention, and a review mode makes mistakes easy to revisit.',
      },
      {
        kind: 'p',
        text: 'The application stores progress in localStorage. That keeps the tool usable without an account or backend and avoids collecting personal study history. It also means progress belongs to one browser unless the learner exports or moves it through a future feature.',
      },
      {
        kind: 'p',
        text: 'Arabic right-to-left layout is built into the experience rather than applied at the end. Question flow, answer alignment, numbers, road-sign images, and mixed-script labels all need deliberate handling. A technically correct translation can still feel broken if directionality is inconsistent.',
      },
      { kind: 'h3', text: 'Keep the claim honest' },
      {
        kind: 'p',
        text: 'The trainer uses the documented Lebanese motorcycle question set, but it is not an official government application and should not imply endorsement. Rules and exam procedures can change; the question source and update date need to remain visible when the tool is published.',
      },
      {
        kind: 'p',
        text: 'The project shows how a small local-first interface can improve a very specific learning loop. It does not need profiles, streaks, social features, or an AI tutor to be useful. It needs good question coverage, clear feedback, accurate content, and a respectful Arabic interface.',
      },
    ],
    evidence: 'GitHub repository; application README and question data.',
    sources: [
      {
        label: 'GitHub — lebanese-driving-test',
        href: 'https://github.com/Kronbii/lebanese-driving-test',
        kind: 'repository',
      },
      {
        label: 'Application README and question data',
        href: 'https://github.com/Kronbii/lebanese-driving-test#readme',
        kind: 'documentation',
      },
    ],
    projectSlug: 'lebanese-motorcycle-theory-trainer',
    topics: ['education-technology', 'lebanon', 'frontend-engineering'],
    keywords: ['adaptive practice', 'Arabic RTL', 'localStorage progress', 'motorcycle exam'],
  },
  {
    slug: 'building-a-local-first-ai-support-triage-council',
    state: 'ready',
    title: 'Building a local-first AI support triage council',
    metaTitle: 'Building a local-first AI support triage council',
    metaDescription:
      'An internal support workflow where an LLM proposes structure, deterministic rules enforce policy, and a human keeps the final say.',
    dek: 'An internal support workflow where an LLM proposes structure, deterministic rules enforce policy, and a human keeps the final say.',
    body: [
      {
        kind: 'p',
        text: 'The AI Customer Support Council is a self-hosted technical-assessment project built for Valsoft Corporation. It is an internal admin console for synthetic B2B support requests, not a customer-facing help desk.',
      },
      {
        kind: 'p',
        text: 'The application takes a submission through intake, machine-assisted triage, deterministic routing and escalation, human review, persistence, and structured export. Its four screens—login, dashboard, submissions, and submission detail—are deliberately narrow because the product has one operator and one job.',
      },
      { kind: 'h3', text: 'The LLM is one component, not the workflow' },
      {
        kind: 'p',
        text: 'An LLM can turn messy text into proposed categories, urgency, and rationale. It should not quietly become the policy engine. The project separates model output from deterministic rules such as confidence thresholds and escalation conditions. A low-confidence response can be sent for review no matter how fluent the explanation sounds.',
      },
      {
        kind: 'p',
        text: 'State is stored in PostgreSQL. Background work runs through Redis and RQ. The backend uses FastAPI, Pydantic, SQLAlchemy, and Alembic; the frontend uses React, TypeScript, Vite, TanStack Query, React Hook Form, and Zod. Ollama with a local model is the default provider, with an optional OpenAI-compatible endpoint.',
      },
      {
        kind: 'p',
        text: 'That local-first default matters for privacy, cost control, and repeatability. It also creates operational responsibilities: model availability, queue state, migrations, auditability, and a clear distinction between a failed inference and a failed support request.',
      },
      { kind: 'h3', text: 'Human review is a designed state' },
      {
        kind: 'p',
        text: 'The reviewer needs to see the original submission, the model’s proposal, confidence, and the rules that changed or escalated it. Accepting or overriding a result should be explicit. The export must reflect the reviewed state, not a hidden intermediate prediction.',
      },
      {
        kind: 'p',
        text: 'The best pattern here is not “replace support staff with AI.” It is to make a noisy intake queue easier to inspect while keeping policy deterministic and decisions attributable. The council metaphor works only when disagreement, uncertainty, and review remain visible.',
      },
    ],
    evidence: 'GitHub repository; architecture and testing documentation.',
    sources: [
      {
        label: 'GitHub — AI-customer-support-council',
        href: 'https://github.com/Kronbii/AI-customer-support-council',
        kind: 'repository',
      },
      {
        label: 'Architecture and testing documentation',
        href: 'https://github.com/Kronbii/AI-customer-support-council#readme',
        kind: 'documentation',
      },
    ],
    projectSlug: 'local-first-ai-support-triage',
    topics: ['applied-ai', 'full-stack-systems', 'local-first-software'],
    keywords: ['local-first', 'LLM triage', 'Ollama', 'PostgreSQL', 'human review'],
  },
  {
    slug: 'designing-an-offline-first-personal-finance-desktop-app',
    state: 'ready',
    title: 'Designing an offline-first personal finance desktop app',
    metaTitle: 'Designing an offline-first personal finance desktop app',
    metaDescription:
      'REE treats personal finance as a private desktop workflow: fast entry, local storage, and enough structure to understand where money moves.',
    dek: 'REE treats personal finance as a private desktop workflow: fast entry, local storage, and enough structure to understand where money moves.',
    heroMedia: {
      src: '/images/authority/ree-finance/image2.jpeg',
      alt: 'REE screenshot showing monthly analysis and category breakdown views.',
      caption: 'REE — monthly analysis and category breakdown.',
    },
    body: [
      {
        kind: 'p',
        text: 'Personal finance tools often begin with the dashboard. REE began with the records behind it: wallets, income, expenses, transfers, subscriptions, debts, savings goals, and the repeated work of entering them.',
      },
      {
        kind: 'p',
        text: 'The application is built in Flutter for desktop. It supports multiple wallets, categorized transactions, bulk entry, recurring-payment tracking, debts in both directions, savings goals, and monthly and yearly analysis. The repository documents a clean architecture with separate data, domain, and presentation concerns and local SQLite storage.',
      },
      { kind: 'h3', text: 'Desktop-first changes the interaction' },
      {
        kind: 'p',
        text: 'A desktop finance tool should respect keyboards, larger tables, and the fact that a person may enter many records in one session. Bulk entry is not an advanced feature hidden in settings; it is a core workflow. The interface can use space for comparison and history without turning every value into a decorative card.',
      },
      {
        kind: 'p',
        text: 'Offline-first also makes the ownership model clear. The main record is local. The app can start and remain useful without an account or continuous network connection. Backup and export become essential because local ownership without recovery is fragile.',
      },
      { kind: 'h3', text: 'Architecture follows trust' },
      {
        kind: 'p',
        text: 'Finance data is sensitive even when the application is not connected to a bank. Storage paths, backups, logs, and exports need predictable behavior. Separating domain logic from the interface makes calculations testable and reduces the risk that a presentation change alters financial rules.',
      },
      {
        kind: 'p',
        text: 'The project is not a claim that a visual style alone makes finance easier. Its stronger idea is operational: keep the data close, make repetitive work efficient, and let insights emerge from records the user can inspect.',
      },
      {
        kind: 'p',
        text: 'The next quality bar is long-term reliability—migration tests, backup restoration, import validation, and clear handling of rounding and currency. A personal finance app earns trust slowly, one predictable operation at a time.',
      },
    ],
    evidence: 'GitHub repository; architecture, storage, and build documentation.',
    sources: [
      {
        label: 'GitHub — personal-finance-tracker',
        href: 'https://github.com/Kronbii/personal-finance-tracker',
        kind: 'repository',
      },
      {
        label: 'Architecture, storage, and build documentation',
        href: 'https://github.com/Kronbii/personal-finance-tracker#readme',
        kind: 'documentation',
      },
    ],
    projectSlug: 'ree-personal-finance-tracker',
    topics: ['local-first-software', 'flutter', 'product-engineering'],
    keywords: ['personal finance', 'Flutter desktop', 'offline-first', 'SQLite'],
  },
  // ---- Review-only articles (noindex; not surfaced in indexes) ----
  {
    slug: 'building-real-time-lebanese-sign-language-translation',
    state: 'review',
    title: 'Building real-time Lebanese Sign Language translation',
    metaTitle: 'Building real-time Lebanese Sign Language translation (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'Lebanese Sign Language has a data problem before it has a model problem.',
    body: [
      {
        kind: 'p',
        text: 'Lebanese Sign Language has a data problem before it has a model problem. General sign-language datasets do not automatically transfer to local vocabulary, signing patterns, or the communication settings in which a system will be used.',
      },
      {
        kind: 'p',
        text: 'OmniSign was built as a real-time translation system spanning camera input, visual recognition, language output, and deployment across mobile, web, and offline embedded environments. My canonical project record describes a 300,000-image dataset, 95–97% development accuracy, and approximately 45 frames per second, with pilots in two Beirut coffee shops and one church.',
      },
      {
        kind: 'p',
        text: 'The important engineering question is not only whether a classifier recognizes a held-out image. A usable translator must remain responsive across different signers, backgrounds, cameras, lighting, and signing speeds. Dataset balance and consent matter. So do uncertainty handling and the decision to ask for a repeated sign instead of producing a confident wrong translation.',
      },
      {
        kind: 'p',
        text: 'This draft intentionally avoids the personal origin story used in an earlier article and does not yet assign individual credit across the full team. Before publication, the team roles, dataset governance, pilot consent, evaluation protocol, and any award language must be confirmed.',
      },
    ],
    evidence: 'Canonical CV; team project page.',
    sources: [
      { label: 'Team project page', href: 'https://laythayache.com/projects/omnisign', kind: 'article' },
    ],
    projectSlug: 'omnisign-lebanese-sign-language',
    topics: ['computer-vision', 'edge-ai', 'embedded-systems'],
    keywords: ['sign language', 'edge inference', 'dataset governance'],
  },
  {
    slug: 'connecting-posture-estimation-to-a-motorized-desk',
    state: 'review',
    title: 'Connecting posture estimation to a motorized desk',
    metaTitle: 'Connecting posture estimation to a motorized desk (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'A posture-aware desk closes a physical loop between vision, control, and motion.',
    body: [
      {
        kind: 'p',
        text: 'A posture-aware desk closes a physical loop: a camera estimates how someone is sitting, software decides whether the posture has drifted, and motors change the work surface. The prototype combines computer vision, ESP32 control, motorized height and tilt, immediate LED feedback, and a dashboard for longer-term patterns.',
      },
      {
        kind: 'p',
        text: 'The system is interesting because a posture model cannot be treated as an isolated prediction. Camera placement changes the visible geometry. Desk movement changes the camera view. A false correction can be distracting or unsafe. The control policy therefore needs dead bands, mechanical limits, slow transitions, and a manual override.',
      },
      {
        kind: 'p',
        text: 'The existing portfolio contains strong prototype media, but the public repository, final project name, authorship split, and testing evidence are not resolved. This page should remain a private review draft until those facts are attached.',
      },
    ],
    evidence: 'Editorial review pending public repository and authorship split.',
    sources: [],
    projectSlug: 'posture-aware-classroom-desk',
    topics: ['embedded-systems', 'computer-vision', 'robotics-perception'],
    keywords: ['posture estimation', 'ESP32', 'motorized desk'],
  },
  {
    slug: 'running-fod-detection-on-a-raspberry-pi-uav',
    state: 'review',
    title: 'Running FOD detection on a Raspberry Pi UAV',
    metaTitle: 'Running FOD detection on a Raspberry Pi UAV (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'A Raspberry Pi 5B UAV prototype runs a lightweight FOD detector at the edge.',
    body: [
      {
        kind: 'p',
        text: 'Runway foreign-object-debris inspection is a useful edge-AI problem because the system has to see small hazards while moving, under tight compute and power limits. The canonical project record describes a Raspberry Pi 5B UAV prototype running a lightweight YOLOv11 detector at approximately 45 frames per second, trained with online and synthetic data and tested in parking-lot environments used to simulate runway conditions.',
      },
      {
        kind: 'p',
        text: 'The project joins airframe constraints, onboard inference, camera motion, false-positive filtering, and flight testing. A detector that works on static images can fail when the vehicle vibrates, changes altitude, or sees repeated pavement texture. Similarity matching and explicit false-positive handling were included to make the flight behavior more useful than a raw stream of boxes.',
      },
      {
        kind: 'p',
        text: 'Before publication, the repository, exact model variant and input size, data rights, evaluation split, meaning of the reported 75–80% accuracy, flight-test ownership, and separation from employer work need confirmation.',
      },
    ],
    evidence: 'Editorial review pending repository, dataset rights, and employer separation.',
    sources: [],
    projectSlug: 'raspberry-pi-runway-inspection-uav',
    topics: ['edge-ai', 'computer-vision', 'robotics-perception'],
    keywords: ['FOD detection', 'YOLOv11', 'Raspberry Pi 5B'],
  },
  {
    slug: 'engineering-a-five-inch-fpv-drone-from-first-principles',
    state: 'review',
    title: 'Engineering a five-inch FPV drone from first principles',
    metaTitle: 'Engineering a five-inch FPV drone from first principles (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'Building a five-inch FPV drone is an exercise in coupled constraints.',
    body: [
      {
        kind: 'p',
        text: 'Building a five-inch FPV drone is an exercise in coupled constraints. Motor and propeller choices affect thrust and current. Battery voltage changes the power system. Frame weight and component placement affect response. Software tuning begins only after the physical build is coherent.',
      },
      {
        kind: 'p',
        text: 'The canonical project record describes a carbon-fiber quadcopter designed from thrust, weight, and current calculations, followed by Betaflight configuration, PID tuning, flight-mode setup, GPS features, and return-to-home behavior. Evaluation included GPS accuracy, RF link quality, and flight behavior under GNSS jamming and IMU/GNSS integration constraints.',
      },
      {
        kind: 'p',
        text: 'The publishable story should show the calculation path and measured logs, not merely list components. Public media, dates, hardware specifications, test locations, and the boundary around any jamming observations still need review, so this draft remains noindex.',
      },
    ],
    evidence: 'Editorial review pending public media, logs, and jamming-observation boundaries.',
    sources: [],
    projectSlug: 'five-inch-carbon-fiber-fpv-drone',
    topics: ['embedded-systems', 'control-systems', 'robotics-perception'],
    keywords: ['FPV drone', 'Betaflight', 'PID tuning'],
  },
  {
    slug: 'lessons-from-an-edge-emotion-recognition-prototype',
    state: 'review',
    title: 'Lessons from an edge emotion-recognition prototype',
    metaTitle: 'Lessons from an edge emotion-recognition prototype (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'Facial expression is not a direct measurement of internal emotional state.',
    body: [
      {
        kind: 'p',
        text: 'The canonical project record describes a facial-landmark and convolutional-neural-network pipeline developed on Jetson Orin Nano for a prototype intended to support work with children with autism. It reached approximately 92% development accuracy after combining and cleaning image and video data from CALMED, Kaggle, and other sources.',
      },
      {
        kind: 'p',
        text: 'The most important publication question is not the architecture. It is the responsible framing. Facial expression is not a direct measurement of a person’s internal emotional state, and performance on a curated dataset does not establish clinical validity. Any useful system must communicate uncertainty, avoid diagnostic claims, and be evaluated with the people and contexts it is intended to support.',
      },
      {
        kind: 'p',
        text: 'Before publication, the team credits, dataset licenses, class definitions, evaluation protocol, acquisition language, intended users, and clinical review must be confirmed. The final article should be a careful engineering retrospective, not a claim that emotion can be read reliably from a face.',
      },
    ],
    evidence: 'Editorial review pending team credits, dataset licenses, and clinical review.',
    sources: [],
    projectSlug: 'emotion-recognition-autism-support',
    topics: ['edge-ai', 'computer-vision'],
    keywords: ['emotion recognition', 'Jetson Orin Nano', 'responsible AI'],
  },
  {
    slug: 'what-four-years-of-technical-mentoring-taught-me',
    state: 'review',
    title: 'What four years of technical mentoring taught me',
    metaTitle: 'What four years of technical mentoring taught me (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'Technical mentoring is not solving the participant’s project for them.',
    body: [
      {
        kind: 'p',
        text: 'My canonical CV records four years as lead technical organizer for NASA Space Apps in Beirut, supporting roughly 250–400 participants annually with a volunteer team of 10–15 people. The work included technical bootcamps using NASA datasets, problem selection, prototyping, competition requirements, and submission strategy. It also records six Global Top 10 placements across three consecutive years among teams supported through that ecosystem.',
      },
      {
        kind: 'p',
        text: 'The useful lesson is that technical mentoring is not solving a participant’s project for them. It is building enough structure that a team can narrow a problem, understand the evidence, choose a tractable prototype, and tell the truth about what it achieved in a short weekend.',
      },
      {
        kind: 'p',
        text: 'Before indexing, the exact event years, official event pages, organizer credits, team names, placement records, and the causal wording around mentorship need to be attached. The article should credit the community rather than turn collective results into an individual statistic.',
      },
    ],
    evidence: 'Editorial review pending event dates, official pages, and organizer credits.',
    sources: [],
    projectSlug: '',
    topics: [],
    keywords: ['NASA Space Apps', 'technical mentoring', 'hackathon'],
  },
  {
    slug: 'building-technology-around-crisis-response-operations',
    state: 'review',
    title: 'Building technology around crisis-response operations',
    metaTitle: 'Building technology around crisis-response operations (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'In crisis response, the interface is only one part of the system.',
    body: [
      {
        kind: 'p',
        text: 'NASNA was a crisis-support platform connecting displaced and war-affected people with donors, NGOs, sponsors, and volunteers. My canonical record lists me as co-founder and operations lead from 2021 to 2024.',
      },
      {
        kind: 'p',
        text: 'In crisis response, the interface is only one part of the system. Requests need verification, triage, safe matching, follow-up, and careful handling of personal information. Supply changes quickly. Volunteers have uneven availability. A database can make coordination more legible, but it can also create risk if access, consent, retention, and escalation are not designed around vulnerable people.',
      },
      {
        kind: 'p',
        text: 'This article should eventually focus on operational design rather than heroic storytelling: what information was actually needed, how matches were made, where manual judgment remained necessary, and how the team handled incomplete data. It must remain a private draft until collaborators approve the account and the disclosure, safety, scale, and beneficiary-privacy questions are resolved.',
      },
    ],
    evidence: 'Editorial review pending collaborator approval and beneficiary-privacy review.',
    sources: [],
    projectSlug: '',
    topics: [],
    keywords: ['crisis response', 'operations', 'privacy'],
  },
  {
    slug: 'turning-physics-outreach-into-a-multi-university-program',
    state: 'review',
    title: 'Turning physics outreach into a multi-university program',
    metaTitle: 'Turning physics outreach into a multi-university program (editorial review)',
    metaDescription: 'Editorial review draft. Not indexable.',
    dek: 'Good science outreach gives people something they can manipulate and question.',
    body: [
      {
        kind: 'p',
        text: 'The canonical record describes founding and leading National Physics Day across four universities, expanding hands-on physics and astronomy activities through double-slit, electrical, and telescope experiments, and developing demonstrations used in university outreach.',
      },
      {
        kind: 'p',
        text: 'Good science outreach gives people something they can manipulate and question. A double-slit experiment turns an abstract account of interference into a visible pattern. A telescope makes scale and observation immediate. The organizing work is in creating stations that are robust, safe, explainable, and still interesting when many groups move through them.',
      },
      {
        kind: 'p',
        text: 'Before indexing, the event dates, participating institutions, collaborator credits, participant scale, photographs, and public references need confirmation. The final piece should document how the program was designed and repeated, not claim institutional impact that has not been measured.',
      },
    ],
    evidence: 'Editorial review pending event dates, host institutions, and collaborator credits.',
    sources: [],
    projectSlug: '',
    topics: [],
    keywords: ['physics outreach', 'astronomy', 'multi-university'],
  },
]

export const articleMap = Object.fromEntries(articles.map((a) => [a.slug, a]))
export const readyArticles = articles.filter((a) => a.state === 'ready')
export const reviewArticles = articles.filter((a) => a.state === 'review')

export function getArticle(slug: string): typeof articles[number] | undefined {
  return articleMap[slug]
}
