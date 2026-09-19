import type { ProjectRecord } from './types'

export const projects: ProjectRecord[] = [
  {
    slug: '360-spherical-panorama-stitching',
    state: 'ready',
    title: '360° Spherical Panorama Stitching',
    metaTitle: '360° Spherical Panorama Stitching — CPU-only OpenCV pipeline',
    metaDescription:
      'A CPU-only Python and OpenCV pipeline that turns handheld phone video into an equirectangular panorama and a self-contained Three.js viewer.',
    summary:
      'A CPU-only Python and OpenCV pipeline that turns handheld phone video or stills into an equirectangular panorama and generates a Three.js viewer.',
    role: 'Sole developer.',
    form: 'artifact',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/spherical-panorama/panorama.jpg',
        alt: 'Full equirectangular panorama reconstructed from a handheld phone sweep of an interior room.',
        caption:
          'Equirectangular panorama recovered from a 309-frame phone sweep. 4096 × 2048 output; 36.9% of the sphere imaged.',
      },
    },
    answer: {
      what: 'A CPU-only Python and OpenCV pipeline that turns handheld phone video or stills into an equirectangular panorama and generates a self-contained Three.js viewer.',
      problem:
        'General-purpose stitchers hide the geometric decisions behind a single call, which makes it hard to explain why a panorama tilts, ghosts, or drifts under real handheld capture.',
      how: 'Frames are extracted, matched with ORB features and RANSAC, related by homography under a pure-rotation camera model, projected back onto a sphere, and rendered in a browser viewer. Temporal smoothing damps the pitch and roll wobble left after per-pair estimation.',
      role: 'Rami Kronbi is the sole developer of the pipeline, viewer, tests, and technical documentation.',
    },
    stages: [
      {
        step: '01',
        title: 'Extract',
        detail:
          'Frames are pulled from a phone video by interval, count, frame rate, or measured motion. Camera intrinsics come from EXIF when available, otherwise from an explicit field of view or calibration file.',
      },
      {
        step: '02',
        title: 'Match',
        detail:
          'ORB features are matched between adjacent frames, filtered with Lowe’s ratio test, and validated by RANSAC. If an adjacent pair fails, the matcher tries across the gap and interpolates the missing step rather than silently discarding the frame.',
      },
      {
        step: '03',
        title: 'Rotate',
        detail:
          'The relative rotation is recovered from R = K⁻¹HK under a pure-rotation model. Numerical noise means the matrix is rarely a perfect rotation, so singular-value decomposition projects it back onto the rotation manifold before chaining.',
      },
      {
        step: '04',
        title: 'Warp',
        detail:
          'Each source frame is inverse-warped onto an equirectangular canvas. Each output pixel is a world direction; that direction is rotated into the camera, projected onto the image plane, and sampled.',
      },
      {
        step: '05',
        title: 'Smooth',
        detail:
          'A moving average over the chained global rotations damps per-pair pitch and roll wobble while remaining honest about what it is not: bundle adjustment, loop closure, or exposure matching.',
      },
      {
        step: '06',
        title: 'View',
        detail:
          'The final 4096 × 2048 panorama is served through a self-contained Three.js viewer that makes the recovered geometry directly inspectable in a browser.',
      },
    ],
    measurements: [
      { label: 'Sample frames', value: '309', context: 'phone video, single handheld sweep' },
      { label: 'Recovered sweep', value: '333°', context: 'from a horizontal pan' },
      { label: 'Median RANSAC inliers', value: '921', context: 'per adjacent pair' },
      { label: 'Interpolated pairs', value: '15 of 308', context: 'recovered across a gap' },
      { label: 'Sphere imaged', value: '36.9%', context: 'phone-height horizontal band' },
      { label: 'Output resolution', value: '4096 × 2048', context: 'equirectangular' },
      { label: 'End-to-end time', value: '~2 minutes', context: 'Ryzen 7 5800H, CPU only' },
      { label: 'Pitch wobble reduction', value: '13.5×', context: 'temporal smoothing, documented sample' },
      { label: 'Roll wobble reduction', value: '5.2×', context: 'temporal smoothing, documented sample' },
    ],
    limits: [
      'Pure-rotation camera model — translation while sweeping introduces parallax that no homography can explain.',
      'A phone-height horizontal sweep sees a band around the viewer, so the poles are never captured; filling is not reconstruction.',
      'Blank walls and repeated textures weaken ORB matching and can force interpolation.',
      'No bundle adjustment or global loop closure; drift is damped rather than corrected.',
      'No exposure matching; brightness changes remain visible across seams.',
    ],
    media: [
      {
        src: '/images/authority/spherical-panorama/stage1-frame.jpg',
        alt: 'A single extracted phone-video frame that becomes an input to the pipeline.',
        caption: 'Stage 1 — frame extraction.',
      },
      {
        src: '/images/authority/spherical-panorama/stage2-matches.jpg',
        alt: 'A pair of adjacent frames with ORB feature matches drawn between them.',
        caption: 'Stage 2 — ORB matches surviving Lowe’s ratio and RANSAC.',
      },
      {
        src: '/images/authority/spherical-panorama/stage3-many.jpg',
        alt: 'A mosaic of intermediate stitched frames laid onto the equirectangular canvas.',
        caption: 'Stage 3 — chained per-pair rotations before smoothing.',
      },
      {
        src: '/images/authority/spherical-panorama/side-by-side.jpg',
        alt: 'Side-by-side comparison of the panorama with and without temporal smoothing.',
        caption: 'Smoothing comparison — long horizontal edges before and after.',
      },
      {
        src: '/images/authority/spherical-panorama/pano-on-band.jpg',
        alt: 'The recovered panorama shown as a horizontal band, illustrating incomplete spherical coverage.',
        caption: 'The captured band is only about 37% of the full sphere.',
      },
      {
        src: '/images/authority/spherical-panorama/goat.gif',
        alt: 'Interactive Three.js viewer showing the reconstructed panorama being explored.',
        caption: 'Three.js viewer — the reconstructed geometry, in a browser.',
      },
    ],
    sources: [
      {
        label: 'GitHub — 360-spherical-stitching',
        href: 'https://github.com/Kronbii/360-spherical-stitching',
        kind: 'repository',
      },
      { label: 'Live viewer — 360.ramikronbi.com', href: 'https://360.ramikronbi.com', kind: 'demo' },
      {
        label: 'README, TECHNICAL.md, and TEMPORAL_SMOOTHING.md',
        href: 'https://github.com/Kronbii/360-spherical-stitching#readme',
        kind: 'documentation',
      },
    ],
    articleSlug: 'building-a-360-panorama-stitcher-from-a-phone-sweep',
    topics: ['computer-vision', 'robotics-perception', 'open-source-engineering'],
    keywords: [
      'panorama stitching',
      'equirectangular projection',
      'OpenCV',
      'ORB features',
      'RANSAC',
      'temporal smoothing',
      'Three.js viewer',
    ],
  },
  {
    slug: 'easypid-arduino-library',
    state: 'ready',
    title: 'easyPID',
    metaTitle: 'easyPID — hardware-agnostic Arduino PID controller library',
    metaDescription:
      'A hardware-agnostic Arduino PID library with independent instances, anti-windup, derivative filtering, state introspection, and an optional relay autotuner.',
    summary:
      'A hardware-agnostic Arduino PID controller library with independent instances, timing controls, anti-windup, derivative filtering, state introspection, and an optional relay autotuner.',
    role: 'Author.',
    form: 'diagram',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'diagram',
      diagramId: 'pid-loop',
      caption:
        'The closed-loop signal path exposed by easyPID: setpoint, measured value, error, term contributions, and bounded output.',
      alt: 'Block diagram of a PID control loop showing setpoint, error, proportional, integral, and derivative branches, output saturation, and feedback from the plant sensor.',
    },
    answer: {
      what: 'A hardware-agnostic Arduino PID controller library published through Arduino Library Manager.',
      problem:
        'Most PID examples end at the equation, leaving timing, windup, noise, and diagnostics implicit — precisely the parts that decide whether a controller actually settles.',
      how: 'The library exposes independent controller instances with automatic or caller-supplied timing, selectable anti-windup, optional derivative low-pass filtering, output limits, runtime tuning, and per-term state introspection. An optional relay autotuner is available with documented operating conditions.',
      role: 'Rami Kronbi is the author of the library, examples, and documentation.',
    },
    stages: [
      {
        step: '01',
        title: 'Instance',
        detail:
          'Each control loop is its own object with its own gains and state, so a project can run multiple loops without sharing global state.',
      },
      {
        step: '02',
        title: 'Timing',
        detail:
          'Timing can be handled automatically from millis() or provided by a scheduler as an explicit delta, which keeps behavior stable when logging or another sensor changes loop duration.',
      },
      {
        step: '03',
        title: 'Bound',
        detail:
          'Output limits and selectable anti-windup behavior treat actuator saturation as an expected operating condition rather than an afterthought.',
      },
      {
        step: '04',
        title: 'Filter',
        detail:
          'An optional low-pass filter on the derivative term makes derivative action usable on the noisy sensors typically connected to microcontrollers.',
      },
      {
        step: '05',
        title: 'Inspect',
        detail:
          'Per-term contributions are exposed so tuning becomes diagnosis: it is possible to see whether the integral is carrying the system or the derivative is amplifying noise.',
      },
      {
        step: '06',
        title: 'Autotune',
        detail:
          'An optional relay autotuner deliberately drives the process into oscillation to derive candidate gains, with documented preconditions around bounded actuation and human supervision.',
      },
    ],
    measurements: [
      { label: 'Distribution', value: 'Arduino Library Manager', context: 'contributed Device Control library' },
      { label: 'Version', value: '1.0.0', context: 'listing dated 2026-01-15' },
      { label: 'License', value: 'MIT' },
      { label: 'Architecture', value: 'Any', context: 'runs on AVR Uno-class boards and beyond' },
    ],
    limits: [
      'Tuning is system-specific; a gain set that behaves on one plant will misbehave on another.',
      'Autotuning drives the process into sustained oscillation and requires safe actuator bounds, a tolerant process, and a person ready to stop the run.',
      'Filter and anti-windup behavior are choices with tradeoffs; the library exposes them rather than hiding them.',
    ],
    sources: [
      { label: 'GitHub — easyPID', href: 'https://github.com/Kronbii/easyPID', kind: 'repository' },
      {
        label: 'Arduino Library Manager listing',
        href: 'https://www.arduinolibraries.info/libraries/easy-pid',
        kind: 'listing',
      },
      {
        label: 'Author profile — Arduino Libraries',
        href: 'https://www.arduinolibraries.info/authors/kronbii',
        kind: 'listing',
      },
      {
        label: 'README and examples',
        href: 'https://github.com/Kronbii/easyPID/tree/main/examples',
        kind: 'documentation',
      },
    ],
    articleSlug: 'designing-a-pid-library-for-real-embedded-control',
    topics: ['embedded-systems', 'control-systems', 'open-source-engineering'],
    keywords: [
      'PID controller',
      'Arduino library',
      'anti-windup',
      'derivative filtering',
      'relay autotuner',
      'embedded control',
    ],
  },
  {
    slug: 'brainiacs-autonomous-race-car',
    state: 'ready',
    title: 'Brainiacs Autonomous Race Car',
    metaTitle: 'Brainiacs autonomous race car — WRO Future Engineers 2023',
    metaDescription:
      'A dual-processor WRO Future Engineers vehicle that splits perception on a Jetson Nano from real-time control on an Arduino Mega, with OpenCV traffic-sign logic and PID steering.',
    summary:
      'A WRO Future Engineers vehicle dividing Jetson Nano perception from Arduino Mega real-time control, with OpenCV traffic-sign logic, PID steering, an MPU6050 IMU, and TCS34725 color sensing.',
    role: 'Team member with Wassim Ghaddar — system architecture, vision, sensor integration, and embedded control, per the repository history and existing first-party content.',
    form: 'artifact',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/race-car/demo.png',
        alt: 'The Brainiacs vehicle running an obstacle-course lap during a WRO Future Engineers demonstration.',
        caption: 'The vehicle in motion, demonstrating a full obstacle-avoidance lap.',
      },
    },
    answer: {
      what: 'A dual-processor autonomous vehicle built for the 2023 World Robot Olympiad Future Engineers challenge.',
      problem:
        'A twenty-day build had to combine visual understanding, traffic-marker logic, obstacle avoidance, and reliable motion on limited compute and a student budget.',
      how: 'Perception runs in Python and OpenCV on a Jetson Nano and is sent as compact events to an Arduino Mega, which owns the time-sensitive steering PID and drivetrain commands. A TCS34725 color sensor and MPU6050 IMU close gaps the camera cannot handle alone.',
      role: 'Rami Kronbi contributed to system architecture, computer vision, sensor integration, and embedded control alongside team member Wassim Ghaddar.',
    },
    stages: [
      {
        step: '01',
        title: 'See',
        detail:
          'The Jetson Nano runs OpenCV lane and traffic-sign logic in Python. Its output is a small stream of events, not raw imagery.',
      },
      {
        step: '02',
        title: 'Decide',
        detail:
          'A TCS34725 color sensor and MPU6050 IMU refine track- and heading-related decisions when the visual channel is uncertain or off-cadence.',
      },
      {
        step: '03',
        title: 'Steer',
        detail:
          'The Arduino Mega closes a PID steering loop at a predictable cadence, isolating time-sensitive control from the vision pipeline’s bursty timing.',
      },
      {
        step: '04',
        title: 'Move',
        detail:
          'Motor commands drive the physical vehicle. Chassis, wiring, and power are part of the tuning problem, not incidental to it.',
      },
    ],
    measurements: [
      { label: 'Build time', value: '20 days', context: 'from scratch, per RHU coverage' },
      { label: 'Placement', value: 'Third, Future Engineers', context: 'World Robot Olympiad, July 2023' },
      { label: 'Team scale reported', value: '>95 teams / >250 participants', context: 'WRO Future Engineers per RHU' },
    ],
    limits: [
      'A twenty-day build imposes clear boundaries on how much of each subsystem can be optimised or documented.',
      'Rami’s exact scope is described conservatively; individual credit within the team should not be inflated beyond what the repository and existing first-party content support.',
      'Track and traffic-sign behavior are tied to the WRO Future Engineers 2023 environment and cannot be generalized without new testing.',
    ],
    media: [
      {
        src: '/images/authority/race-car/front.jpeg',
        alt: 'Front view of the Brainiacs vehicle showing camera, chassis, and drive wheels.',
        caption: 'Front view — camera mounted above the drivetrain for the perception pipeline.',
      },
      {
        src: '/images/authority/race-car/schematic.png',
        alt: 'Full electrical schematic of the vehicle, including Jetson Nano, Arduino Mega, motor driver, IMU, and color sensor.',
        caption: 'System schematic — perception, control, sensing, and drive on one diagram.',
      },
      {
        src: '/images/authority/race-car/team.jpeg',
        alt: 'Team Brainiacs standing with the vehicle at the WRO Future Engineers competition venue.',
        caption: 'Team Brainiacs at the competition venue.',
        credit: 'Photo from the project team gallery.',
      },
    ],
    sources: [
      {
        label: 'GitHub — autonomous-race-car',
        href: 'https://github.com/Kronbii/autonomous-race-car',
        kind: 'repository',
      },
      {
        label: 'RHU — Engineering students win big in the World Robotics Olympiad',
        href: 'https://www.rhu.edu.lb/media-room/news/rhu-engineering-students-win-big-in-the-world-robotics-olympiad',
        kind: 'institution',
      },
    ],
    articleSlug: 'building-an-autonomous-race-car-in-twenty-days',
    topics: ['robotics', 'embedded-systems', 'computer-vision', 'control-systems'],
    keywords: [
      'WRO Future Engineers',
      'Jetson Nano',
      'Arduino Mega',
      'PID steering',
      'MPU6050',
      'TCS34725',
      'sensor fusion',
    ],
  },
  {
    slug: 'thermal-super-resolution',
    state: 'ready',
    title: 'Thermal Super-Resolution',
    metaTitle: 'Thermal super-resolution — IMDN adapted to single-channel thermal imagery',
    metaDescription:
      'An IMDN-derived thermal super-resolution pipeline trained with thermal-specific objectives and optimized for edge inference on NVIDIA Jetson hardware.',
    summary:
      'An IMDN-derived single-channel thermal super-resolution pipeline trained with thermal-specific objectives and optimized for deployment on NVIDIA Jetson hardware.',
    role: 'Computer vision engineer — architecture adaptation, training, and edge inference work, per the canonical CV.',
    form: 'artifact',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/thermal-super-resolution/x2-showcase.png',
        alt: 'Side-by-side comparison of a low-resolution thermal frame and its ×2 super-resolved output.',
        caption:
          '×2 super-resolution — a low-resolution thermal frame beside the reconstructed output on the same scene.',
      },
    },
    answer: {
      what: 'A single-channel super-resolution pipeline that adapts an Information Multi-Distillation Network to thermal imagery for deployment near the sensor.',
      problem:
        'RGB-trained super-resolution models can hallucinate texture that has no thermal meaning, and higher-resolution thermal sensors are expensive relative to lower-resolution alternatives.',
      how: 'The IMDN architecture is adapted to a single channel, pretraining is transferred from RGB data, a thermal-specific training objective shifts attention toward heat-relevant gradients and contrast, and the model is optimized toward FP16 and INT8 execution on NVIDIA Jetson hardware.',
      role: 'Rami Kronbi contributed to architecture adaptation, training, and edge inference work, as recorded in the canonical CV.',
    },
    stages: [
      {
        step: '01',
        title: 'Adapt',
        detail:
          'Information Multi-Distillation Network layers are adapted from three-channel RGB to a single thermal channel to match sensor semantics.',
      },
      {
        step: '02',
        title: 'Transfer',
        detail:
          'Weights pretrained on RGB provide a useful starting point in a domain where thermal training data is scarce.',
      },
      {
        step: '03',
        title: 'Retrain',
        detail:
          'A thermal-specific objective moves the model toward gradients, contrast, and structure that belong to heat imagery, rather than photographic texture priors.',
      },
      {
        step: '04',
        title: 'Deploy',
        detail:
          'Inference is moved toward FP16 and INT8 execution and measured as a complete pipeline on named NVIDIA Jetson hardware, not as a bare model file.',
      },
    ],
    measurements: [
      { label: '×2 quality', value: '34.2 dB / 0.840', context: 'PSNR / SSIM, per canonical CV' },
      { label: '×3 quality', value: '31.0 dB / 0.757', context: 'PSNR / SSIM, per canonical CV' },
      { label: '×4 quality', value: '29.6 dB / 0.713', context: 'PSNR / SSIM, per canonical CV' },
      { label: 'Edge inference', value: '~45 FPS', context: 'Jetson AGX Orin, per canonical CV' },
    ],
    limits: [
      'Reported quality numbers are dataset-specific and become less constrained at larger enlargement factors.',
      '“Real time” is a property of a full pipeline on named hardware at a named input size, not a property of a model file. The 45 FPS figure is bound to Jetson AGX Orin.',
      'Repository claims of first/SOTA, 15× faster, 40× parameter reduction, or 250–270 FPS are held back until benchmark protocol and hardware are reconciled.',
      'Task-based evaluation — does downstream detection improve? — is the next honest measurement of value.',
    ],
    media: [
      {
        src: '/images/authority/thermal-super-resolution/x2-showcase.png',
        alt: 'Low-resolution thermal frame and its ×2 super-resolved reconstruction placed side by side.',
        caption: '×2 comparison.',
      },
      {
        src: '/images/authority/thermal-super-resolution/x3-showcase.png',
        alt: 'Low-resolution thermal frame and its ×3 super-resolved reconstruction placed side by side.',
        caption: '×3 comparison — the task becomes less constrained as scale grows.',
      },
    ],
    sources: [
      {
        label: 'GitHub — thermal-super-resolution',
        href: 'https://github.com/Kronbii/thermal-super-resolution',
        kind: 'repository',
      },
      {
        label: 'Canonical CV (2026)',
        href: 'https://github.com/Kronbii/thermal-super-resolution#readme',
        kind: 'cv',
        note: 'Quality figures and Jetson AGX Orin frame rate are quoted from the canonical CV.',
      },
    ],
    articleSlug: 'adapting-super-resolution-to-thermal-imagery',
    topics: ['computer-vision', 'edge-ai', 'robotics-perception'],
    keywords: [
      'thermal super-resolution',
      'IMDN',
      'Jetson AGX Orin',
      'edge inference',
      'single-channel super-resolution',
    ],
  },
  {
    slug: 'pid-light-tracking-robot',
    state: 'ready',
    title: 'PID Light Tracker',
    metaTitle: 'PID light tracker — a two-axis Arduino experiment in real control',
    metaDescription:
      'An Arduino two-axis light-tracking robot that turns PID tuning, sensor noise, saturation, and settling into a visible control experiment.',
    summary:
      'An Arduino project that uses light sensing and two servo axes to follow a light source with PID control.',
    role: 'Rami Kronbi — lead developer and system architecture; Wassim Ghaddar — hardware integration and testing, per repository credits.',
    form: 'diagram',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'diagram',
      diagramId: 'light-tracker',
      caption:
        'The tracker as a control loop: four LDRs form the error signal, a PID controller drives the yaw and pitch servos, and the assembly’s new pose feeds back into the sensor readings.',
      alt: 'Diagram of a two-axis light-tracker control loop showing four light-dependent resistors, a PID controller block, yaw and pitch servos, and the feedback path from mechanical pose back to the sensor.',
    },
    answer: {
      what: 'An Arduino two-axis light-tracking robot that runs a PID controller against a small light-sensor array.',
      problem:
        'A tracker that can be made to move with proportional control is not the same as one that settles: gain, noise, saturation, and mechanical behavior all conspire.',
      how: 'Four light-dependent resistors form directional error signals, the Arduino runs a PID controller against them, and yaw and pitch servos move the sensor assembly. Calibration includes safe mechanical limits, sensor filtering, and a consistent update rate.',
      role: 'Rami Kronbi led the software and system architecture; Wassim Ghaddar contributed hardware integration and testing, as recorded in the repository.',
    },
    stages: [
      {
        step: '01',
        title: 'Sense',
        detail:
          'Light-dependent resistors produce an error signal in two axes. Filtering and centering matter as much as the raw reading.',
      },
      {
        step: '02',
        title: 'Control',
        detail:
          'A PID controller converts error into servo commands. Proportional gain provides response; integral removes bias; derivative damps motion when the sensor is quiet enough for it to help.',
      },
      {
        step: '03',
        title: 'Actuate',
        detail:
          'Yaw and pitch servos move the sensor assembly. Backlash, limited travel, and chassis flex are inside the loop, not outside it.',
      },
      {
        step: '04',
        title: 'Calibrate',
        detail:
          'The system requires a defined center, safe mechanical limits, sensible sensor filtering, and a consistent update rate before tuning is meaningful.',
      },
    ],
    limits: [
      'PID tuning is system-specific; per-axis gains may differ because inertia and friction differ per axis.',
      'Sensor noise can turn derivative action into jitter unless it is filtered.',
      'README performance claims that are not supported by test logs are held back rather than published as measurements.',
    ],
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
    articleSlug: 'what-a-two-axis-light-tracker-teaches-about-pid-control',
    topics: ['robotics', 'embedded-systems', 'control-systems'],
    keywords: [
      'PID tuning',
      'light tracker',
      'Arduino',
      'two-axis servo',
      'sensor filtering',
    ],
  },
  {
    slug: 'fine-crack-tracing-toolkit',
    state: 'ready',
    title: 'Fine Crack Tracing Toolkit',
    metaTitle: 'Fine crack tracing — turning segmentation masks into measurable paths',
    metaDescription:
      'An installable Python package and CLI that turns pre-segmented crack masks into ordered lines, splines, overlays, and evaluation metrics for infrastructure inspection.',
    summary:
      'An installable Python package and CLI for turning pre-segmented crack masks into ordered lines, optional splines, visual overlays, and evaluation metrics.',
    role: 'Repository owner and maintainer. Authorship of underlying algorithms is not claimed beyond what the repository history supports.',
    form: 'artifact',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/fine-crack/test-frame.png',
        alt: 'Test frame containing a thin crack across a rough surface, used as an input to the tracing toolkit.',
        caption: 'Test frame from the repository — a starting point for the tracing pipeline.',
      },
    },
    answer: {
      what: 'A Python package and command-line interface that turn pre-segmented crack masks into ordered paths, smoothed curves, overlays, and metric exports.',
      problem:
        'A segmentation mask names the pixels but leaves inspection engineers without an ordered trace, a comparable reference, or an evaluation record.',
      how: 'The toolkit accepts frames and masks, extracts candidate crack points, orders them with a choice of classic, minimum-spanning-tree, or greedy strategies, optionally fits smoother curves, generates overlays, and exports metrics as CSV and JSON.',
      role: 'Rami Kronbi owns and maintains the package, its command-line interface, and its documentation. Underlying algorithmic choices are attributed to their sources.',
    },
    stages: [
      {
        step: '01',
        title: 'Ingest',
        detail:
          'The toolkit consumes raw frames and pre-segmented masks. It begins after segmentation and does not attempt to detect cracks itself.',
      },
      {
        step: '02',
        title: 'Order',
        detail:
          'Candidate points can be ordered with a classic approach, a minimum-spanning-tree path, or a greedy alternative, chosen for the geometry at hand.',
      },
      {
        step: '03',
        title: 'Smooth',
        detail:
          'Optional spline fitting produces smoother traces without erasing meaningful bends. ORB or Shi-Tomasi features support corner detection where local structure matters.',
      },
      {
        step: '04',
        title: 'Evaluate',
        detail:
          'Outputs can be evaluated with precision, recall, F1, IoU, mean and maximum distance, and RMS error, and exported to CSV and JSON.',
      },
    ],
    limits: [
      'The toolkit begins after segmentation and is not a crack detector.',
      'Dataset-level validation across crack types, widths, and imaging conditions is the next serious step and is not yet in scope.',
      'Metric definitions are inherited from the referenced references; the package does not redefine them.',
    ],
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
    articleSlug: 'turning-segmented-cracks-into-measurable-paths',
    topics: ['computer-vision', 'infrastructure-inspection', 'open-source-engineering'],
    keywords: [
      'crack tracing',
      'segmentation post-processing',
      'infrastructure inspection',
      'ordered paths',
      'evaluation metrics',
    ],
  },
  {
    slug: 'multilingual-medical-prescription-ocr',
    state: 'ready',
    title: 'Multilingual Medical Prescription OCR',
    metaTitle: 'Multilingual medical prescription OCR — CLI and FastAPI service',
    metaDescription:
      'A CLI and FastAPI service that extracts medicine names from Arabic, English, and French prescription images, framed as a prototype extraction tool with human review.',
    summary:
      'A CLI and FastAPI service that uses Gemini to extract medicine names from Arabic, English, and French prescription images, with an optional medicine database.',
    role: 'Repository owner and implementer.',
    form: 'diagram',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'diagram',
      diagramId: 'prescription-flow',
      caption:
        'Flow of a prescription through the service — from ingest, through model extraction and optional database normalization, to a reviewable structured result.',
      alt: 'Diagram of a prescription OCR service showing image ingest, request validation, model extraction, optional medicine database normalization, and a structured result destined for human review.',
    },
    answer: {
      what: 'A CLI and FastAPI service that uses a Gemini-based extraction step to pull medicine names from prescription images in Arabic, English, and French.',
      problem:
        'Prescriptions are ambiguous inputs: handwriting varies, abbreviations are local, medicine names are easy to confuse, and pages routinely mix scripts.',
      how: 'The service wraps a bounded model call in a validated API and a batch-friendly CLI, supports an optional medicine database for normalization, keeps configuration and credentials out of the repository, and structures output for human verification.',
      role: 'Rami Kronbi owns and implements the service, CLI, and documentation.',
    },
    stages: [
      {
        step: '01',
        title: 'Ingest',
        detail:
          'The CLI handles individual images or directories with bounded parallelism; the FastAPI service accepts validated requests and returns predictable responses.',
      },
      {
        step: '02',
        title: 'Extract',
        detail:
          'A Gemini-based extraction step produces a structured list of medicine names from images in Arabic, English, or French.',
      },
      {
        step: '03',
        title: 'Normalize',
        detail:
          'An optional medicine database supports normalization and review without pretending that a fuzzy match is a clinical decision.',
      },
      {
        step: '04',
        title: 'Review',
        detail:
          'The structured result is designed to be reviewed by a person against the source image. It is a prototype extraction step, not a prescribing, dispensing, or clinical decision system.',
      },
    ],
    limits: [
      'The service extracts and does not prescribe, dispense, or check interactions.',
      'Every result requires human verification against the source image.',
      'Real prescription images may contain personal health information and are not published as demo material.',
    ],
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
    articleSlug: 'extracting-medicine-names-from-multilingual-prescriptions',
    topics: ['applied-ai', 'health-technology', 'document-intelligence'],
    keywords: [
      'medical OCR',
      'multilingual prescriptions',
      'Arabic OCR',
      'FastAPI',
      'Gemini',
      'human-in-the-loop',
    ],
  },
  {
    slug: 'daleel-lebanese-election-information',
    state: 'ready',
    title: 'Daleel',
    metaTitle: 'Daleel — a verifiable Lebanese parliamentary-election information platform',
    metaDescription:
      'An independent multilingual Lebanese parliamentary-election information platform designed around source archiving, append-only history, and verifiable records.',
    summary:
      'An independent, multilingual Lebanese parliamentary-election information platform designed around source archiving, append-only history, and verifiable records.',
    role: 'Repository owner and implementer. No institutional endorsement or political affiliation is implied.',
    form: 'artifact',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/daleel/hero.jpeg',
        alt: 'Daleel product hero image from the project repository showing the platform’s branded interface.',
        caption: 'Daleel — the platform’s hero identity as published in the project repository.',
      },
    },
    answer: {
      what: 'An independent, multilingual civic-technology platform for Lebanese parliamentary-election information.',
      problem:
        'Political information becomes more useful when a reader can see where each fact came from and how it changed. Ordinary content systems optimize for the current value and lose that trail.',
      how: 'The platform pairs a Next.js frontend with an Express backend, Prisma and PostgreSQL, JWT authentication, CSRF protection, rate limiting, and immutable data models intended to preserve a verifiable trail of sources and changes.',
      role: 'Rami Kronbi owns and implements the project. Daleel does not imply institutional endorsement, and its dataset is not claimed to be complete, live, or officially certified.',
    },
    stages: [
      {
        step: '01',
        title: 'Archive',
        detail:
          'Sources are archived alongside the records they support so a reader can inspect where a fact came from.',
      },
      {
        step: '02',
        title: 'Preserve',
        detail:
          'Data models are designed to be append-only, so record history is retained rather than overwritten.',
      },
      {
        step: '03',
        title: 'Translate',
        detail:
          'The platform is multilingual across Arabic, English, and French, treating direction, names, and source availability as first-class concerns rather than a translation layer.',
      },
      {
        step: '04',
        title: 'Protect',
        detail:
          'JWT authentication, CSRF protection, and rate limiting are part of editorial integrity because unauthorized changes would undermine the central promise.',
      },
    ],
    limits: [
      'Daleel is not an official election authority.',
      'The public repository alone does not prove the dataset is complete, currently operational, or officially certified.',
      'Correction workflows, contributor governance, legal review, and a visible policy for disputed information remain institutional work that a database cannot do on its own.',
    ],
    sources: [
      { label: 'GitHub — daleel', href: 'https://github.com/Kronbii/daleel', kind: 'repository' },
      {
        label: 'Technical documentation (TECHNICAL.md)',
        href: 'https://github.com/Kronbii/daleel/blob/main/TECHNICAL.md',
        kind: 'documentation',
      },
    ],
    articleSlug: 'designing-election-information-for-verifiability',
    topics: ['civic-technology', 'information-integrity', 'full-stack-systems'],
    keywords: [
      'civic technology',
      'Lebanese elections',
      'append-only data',
      'verifiability',
      'multilingual platform',
    ],
  },
  {
    slug: 'lebanese-motorcycle-theory-trainer',
    state: 'ready',
    title: 'Lebanese Motorcycle Theory Trainer',
    metaTitle: 'Lebanese motorcycle theory trainer — an Arabic RTL study tool',
    metaDescription:
      'An Arabic right-to-left Vite/React/TypeScript study tool for the Lebanese motorcycle theory exam with adaptive review and localStorage-only progress.',
    summary:
      'An Arabic right-to-left Vite/React/TypeScript study tool for the Lebanese motorcycle theory exam with adaptive review, coverage-aware selection, and localStorage-only progress.',
    role: 'Repository owner and implementer. No institutional or government endorsement is implied.',
    form: 'diagram',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'gallery',
      items: [
        {
          src: '/images/authority/motorcycle-trainer/sign-127.webp',
          alt: 'Lebanese road-sign image from the trainer question bank.',
          caption: 'Road-sign question — sign 127.',
        },
        {
          src: '/images/authority/motorcycle-trainer/sign-135.webp',
          alt: 'Lebanese road-sign image from the trainer question bank.',
          caption: 'Road-sign question — sign 135.',
        },
        {
          src: '/images/authority/motorcycle-trainer/sign-140.webp',
          alt: 'Lebanese road-sign image from the trainer question bank.',
          caption: 'Road-sign question — sign 140.',
        },
        {
          src: '/images/authority/motorcycle-trainer/sign-150.webp',
          alt: 'Lebanese road-sign image from the trainer question bank.',
          caption: 'Road-sign question — sign 150.',
        },
      ],
    },
    answer: {
      what: 'A focused Arabic right-to-left React application for studying the Lebanese motorcycle theory exam.',
      problem:
        'Learning a fixed question bank rewards coverage of what a learner does not yet know, not repetition of what they already do. Doing this in a right-to-left interface adds directional detail that a generic quiz app does not handle well.',
      how: 'The trainer holds 251 multiple-choice questions including 101 road-sign questions, offers a 30-question exam mode with a 25/30 passing threshold, uses coverage-aware selection to surface unseen material, and stores per-learner progress in localStorage.',
      role: 'Rami Kronbi owns and implements the project. The tool is not an official government application and does not imply endorsement.',
    },
    stages: [
      {
        step: '01',
        title: 'Bank',
        detail:
          '251 multiple-choice questions and 101 road-sign questions with extracted sign imagery form the trainer’s content base.',
      },
      {
        step: '02',
        title: 'Select',
        detail:
          'Coverage-aware selection surfaces unseen material before over-drilling familiar questions; missed and weaker questions receive more attention.',
      },
      {
        step: '03',
        title: 'Practice',
        detail:
          'Practice mode focuses on weak and recently missed items; review mode makes mistakes easy to revisit; exam mode uses a 30-question set with a 25/30 pass threshold.',
      },
      {
        step: '04',
        title: 'Preserve',
        detail:
          'Progress is stored in the browser’s localStorage. It is usable without an account and no personal study history is collected.',
      },
    ],
    measurements: [
      { label: 'Total questions', value: '251', context: 'multiple choice' },
      { label: 'Road-sign questions', value: '101', context: 'with extracted sign imagery' },
      { label: 'Exam length', value: '30', context: 'per attempt' },
      { label: 'Passing threshold', value: '25 / 30', context: 'documented exam mode' },
    ],
    limits: [
      'The trainer is not an official government application.',
      'Rules and exam procedures can change; the question source and update date must remain visible when the tool is published.',
      'Progress belongs to one browser unless a future feature exports or moves it.',
    ],
    media: [
      {
        src: '/images/authority/motorcycle-trainer/sign-127.webp',
        alt: 'Lebanese road-sign extracted from the trainer question bank (sign 127).',
        caption: 'A single road-sign question tile.',
      },
      {
        src: '/images/authority/motorcycle-trainer/sign-135.webp',
        alt: 'Lebanese road-sign extracted from the trainer question bank (sign 135).',
        caption: 'A single road-sign question tile.',
      },
    ],
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
    articleSlug: 'building-an-adaptive-motorcycle-theory-trainer-for-lebanon',
    topics: ['education-technology', 'lebanon', 'frontend-engineering'],
    keywords: [
      'motorcycle theory exam',
      'Arabic RTL',
      'adaptive practice',
      'localStorage progress',
      'Vite React TypeScript',
    ],
  },
  {
    slug: 'local-first-ai-support-triage',
    state: 'ready',
    title: 'AI Customer Support Council',
    metaTitle: 'AI Customer Support Council — a local-first internal triage console',
    metaDescription:
      'A self-hosted internal admin console built as a Valsoft Corporation technical assessment: LLM triage, deterministic routing, human review, and JSON export.',
    summary:
      'A self-hosted internal admin console for synthetic B2B support intake and triage, built as a technical-assessment deliverable for Valsoft Corporation. It is not a customer-facing platform.',
    role: 'Repository owner and implementer; the project is a technical-assessment deliverable for Valsoft Corporation, exactly as the public README states.',
    form: 'diagram',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'diagram',
      diagramId: 'support-council',
      caption:
        'A submission moves from intake through machine-assisted triage, deterministic routing and escalation, human review, persistence, and JSON export.',
      alt: 'Diagram of the AI Customer Support Council architecture: intake, LLM proposal, deterministic rules, human review, PostgreSQL persistence, and JSON export, with Redis-backed background work.',
    },
    answer: {
      what: 'A self-hosted internal admin console for synthetic B2B support intake and triage.',
      problem:
        'An LLM can fluently propose categories and urgency, but if it quietly becomes the policy engine the workflow loses both auditability and control.',
      how: 'A React/TypeScript/Vite frontend talks to a FastAPI/Pydantic/SQLAlchemy backend with Redis- and RQ-based background jobs, PostgreSQL persistence, and an Ollama-by-default local model provider or an optional OpenAI-compatible endpoint. Deterministic rules such as confidence thresholds and escalation conditions live outside the model.',
      role: 'Rami Kronbi owns and implements the project as a technical-assessment deliverable for Valsoft Corporation, per the public README.',
    },
    stages: [
      {
        step: '01',
        title: 'Intake',
        detail:
          'Synthetic B2B support submissions enter the system through a narrow admin console with a login, dashboard, submissions view, and submission detail view.',
      },
      {
        step: '02',
        title: 'Propose',
        detail:
          'A local LLM proposes a category, urgency, and rationale for each submission. Ollama is the default provider; an OpenAI-compatible endpoint is optional.',
      },
      {
        step: '03',
        title: 'Enforce',
        detail:
          'Deterministic rules apply confidence thresholds and escalation conditions. A low-confidence response can be sent for human review no matter how fluent the explanation sounds.',
      },
      {
        step: '04',
        title: 'Review',
        detail:
          'Human reviewers see the original submission, the model’s proposal, its confidence, and the rules that changed or escalated it. Accepting or overriding a result is explicit.',
      },
      {
        step: '05',
        title: 'Persist',
        detail:
          'State lives in PostgreSQL. Background work is scheduled through Redis and RQ. JSON export reflects the reviewed state, not a hidden intermediate prediction.',
      },
    ],
    limits: [
      'The console is an internal admin tool for a technical assessment. It is not a customer-facing help desk.',
      'Local-first operation is a privacy and repeatability choice; it also creates operational responsibilities around model availability, queue state, and migrations.',
      'A failed inference and a failed support request are separate failure modes and are handled as such.',
    ],
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
    articleSlug: 'building-a-local-first-ai-support-triage-council',
    topics: ['applied-ai', 'full-stack-systems', 'local-first-software'],
    keywords: [
      'local-first AI',
      'support triage',
      'LLM plus deterministic rules',
      'Ollama',
      'FastAPI',
      'PostgreSQL',
    ],
  },
  {
    slug: 'ree-personal-finance-tracker',
    state: 'ready',
    title: 'REE Personal Finance Tracker',
    metaTitle: 'REE — an offline-first personal finance desktop app',
    metaDescription:
      'A Flutter desktop personal-finance application for multi-wallet transactions, subscriptions, debts, savings goals, and local insights.',
    summary:
      'A Flutter desktop personal-finance application for multi-wallet transactions, subscriptions, debts, savings goals, and local insights, with local SQLite storage.',
    role: 'Repository owner and implementer.',
    form: 'artifact',
    schemaType: 'SoftwareSourceCode',
    hero: {
      kind: 'image',
      media: {
        src: '/images/authority/ree-finance/image1.jpeg',
        alt: 'Screenshot of REE showing the desktop finance interface with wallets, transactions, and analysis views.',
        caption: 'REE desktop — the primary workspace as shipped in the repository.',
      },
    },
    answer: {
      what: 'A Flutter desktop personal-finance application designed as a private, keyboard-aware, offline-first workflow.',
      problem:
        'Finance tools that begin with a dashboard hide the repeated work of records — wallets, income, expenses, transfers, subscriptions, debts, and goals — that dashboards are built on.',
      how: 'REE targets Flutter desktop with a clean data / domain / presentation split and local SQLite storage. Multi-wallet accounts, categorized transactions, bulk entry, subscriptions, debts in both directions, savings goals, and monthly and yearly analysis are first-class workflows.',
      role: 'Rami Kronbi owns and implements the project. Backup and export are essential because local ownership without recovery is fragile.',
    },
    stages: [
      {
        step: '01',
        title: 'Record',
        detail:
          'Wallets, income, expenses, transfers, subscriptions, debts, and savings goals are entered efficiently, with bulk entry as a core workflow rather than a hidden setting.',
      },
      {
        step: '02',
        title: 'Store',
        detail:
          'Data lives locally in SQLite. The app starts and remains useful without an account or continuous network connection.',
      },
      {
        step: '03',
        title: 'Analyze',
        detail:
          'Monthly and yearly analysis, subscription tracking, and debt visibility emerge from records the user can inspect.',
      },
      {
        step: '04',
        title: 'Recover',
        detail:
          'Backup and export are essential; local ownership without recovery is fragile.',
      },
    ],
    limits: [
      'The application does not claim an Apple-quality interface; it describes design intent and observable behavior.',
      'Long-term reliability — migration tests, backup restoration, import validation, rounding and currency handling — is the next quality bar rather than a shipped guarantee.',
    ],
    media: [
      {
        src: '/images/authority/ree-finance/image1.jpeg',
        alt: 'REE desktop screenshot showing wallets and transaction entry.',
        caption: 'Primary workspace.',
      },
      {
        src: '/images/authority/ree-finance/image2.jpeg',
        alt: 'REE desktop screenshot showing analysis and category views.',
        caption: 'Monthly and yearly analysis.',
      },
      {
        src: '/images/authority/ree-finance/image3.jpeg',
        alt: 'REE desktop screenshot showing subscriptions and debts views.',
        caption: 'Subscriptions, debts, and goals.',
      },
    ],
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
    articleSlug: 'designing-an-offline-first-personal-finance-desktop-app',
    topics: ['local-first-software', 'flutter', 'product-engineering'],
    keywords: [
      'personal finance',
      'Flutter desktop',
      'local-first',
      'SQLite',
      'offline-first',
    ],
  },
  // ---- Review-only project records (noindex; not surfaced in indexes) ----
  {
    slug: 'omnisign-lebanese-sign-language',
    state: 'review',
    title: 'OmniSign — Lebanese Sign Language translation',
    metaTitle: 'OmniSign — real-time Lebanese Sign Language translation (editorial review)',
    metaDescription:
      'Editorial review draft. Not indexable. Real-time Lebanese Sign Language translation system spanning mobile, web, and offline embedded deployments.',
    summary:
      'A real-time translation system for Lebanese Sign Language spanning camera input, visual recognition, language output, and deployment across mobile, web, and offline embedded environments.',
    role: 'Team member. Individual roles and collaborator credits require confirmation before publication.',
    form: 'diagram',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'diagram',
      diagramId: 'sign-translation',
      caption:
        'A signer’s camera input flows through visual recognition into language output; deployment fans out to mobile, web, and offline embedded targets.',
      alt: 'Diagram of a sign-language translation system: camera capture, visual recognition, language output, and three deployment targets — mobile, web, and offline embedded.',
    },
    answer: {
      what: 'A real-time Lebanese Sign Language translation system.',
      problem:
        'General sign-language datasets do not transfer to local vocabulary, signing patterns, or the communication settings in which the system will be used.',
      how: 'A recognition model consumes camera input and produces language output; the system is deployed across mobile, web, and offline embedded targets. Uncertainty handling and the option to request a repeated sign are treated as design decisions.',
      role: 'Rami Kronbi contributed as a team member. Precise individual roles are held for review.',
    },
    stages: [
      {
        step: '01',
        title: 'Capture',
        detail:
          'Camera input is the primary channel; signer, background, lighting, and camera differ between deployments.',
      },
      {
        step: '02',
        title: 'Recognize',
        detail:
          'A visual model classifies signs; performance on a curated dataset is not the same as performance for a specific signer in a specific room.',
      },
      {
        step: '03',
        title: 'Translate',
        detail:
          'Recognized signs are converted into language output for a listener in a shared context.',
      },
      {
        step: '04',
        title: 'Deploy',
        detail:
          'Deployment targets include mobile, web, and offline embedded configurations, each with its own constraints.',
      },
    ],
    limits: [
      'Award language, pilot sites, dataset consent and governance, and individual credit are all pending editorial confirmation.',
      'Existing origin-story language from earlier public writing is not reproduced.',
    ],
    sources: [
      {
        label: 'Canonical CV (2026)',
        href: 'https://laythayache.com/projects/omnisign',
        kind: 'cv',
        note: 'Referenced for dataset scale and deployment scope; not treated as narrative authority.',
      },
      {
        label: 'Team project page',
        href: 'https://laythayache.com/projects/omnisign',
        kind: 'article',
      },
    ],
    articleSlug: 'building-real-time-lebanese-sign-language-translation',
    topics: ['computer-vision', 'edge-ai', 'embedded-systems'],
    keywords: [
      'Lebanese Sign Language',
      'gesture recognition',
      'edge deployment',
      'accessibility',
    ],
  },
  {
    slug: 'posture-aware-classroom-desk',
    state: 'review',
    title: 'Posture-aware classroom desk',
    metaTitle: 'Posture-aware classroom desk (editorial review)',
    metaDescription:
      'Editorial review draft. Not indexable. A posture-estimation prototype that closes a physical loop with a motorized desk.',
    summary:
      'A prototype that combines computer vision, ESP32 control, motorized height and tilt, immediate LED feedback, and a dashboard for longer-term patterns.',
    role: 'Team member. Individual role and public repository are pending confirmation.',
    form: 'diagram',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'diagram',
      diagramId: 'posture-loop',
      caption:
        'A closed loop between visual posture estimation, ESP32 control decisions, motorized desk motion, and immediate LED feedback back to the user.',
      alt: 'Diagram of a posture-aware desk control loop: camera-based posture estimator, ESP32 decision logic with dead bands, motorized height and tilt, and an LED feedback channel to the user.',
    },
    answer: {
      what: 'A prototype posture-aware desk that closes a physical loop between vision, control, and motion.',
      problem:
        'A posture model cannot be treated as an isolated prediction: camera placement, desk motion, false corrections, and mechanical limits all matter.',
      how: 'A camera-based posture estimator informs an ESP32 controller with dead bands, mechanical limits, and slow transitions, driving motorized height and tilt while an LED and dashboard communicate state back to the user.',
      role: 'Rami Kronbi’s exact contribution is under editorial review.',
    },
    stages: [
      { step: '01', title: 'Observe', detail: 'A desk-mounted camera estimates posture.' },
      {
        step: '02',
        title: 'Decide',
        detail: 'The ESP32 applies dead bands, mechanical limits, and slow transitions before acting.',
      },
      { step: '03', title: 'Move', detail: 'Motorized height and tilt actuators change the work surface.' },
      {
        step: '04',
        title: 'Signal',
        detail: 'Immediate LED feedback and a longer-term dashboard keep the user in the loop.',
      },
    ],
    limits: [
      'Repository URL, final project name, authorship split, and testing evidence are unresolved.',
    ],
    sources: [
      {
        label: 'Canonical CV (2026)',
        href: 'https://ramikronbi.com',
        kind: 'cv',
        note: 'CV entry cited pending public repository confirmation.',
      },
    ],
    articleSlug: 'connecting-posture-estimation-to-a-motorized-desk',
    topics: ['embedded-systems', 'computer-vision', 'robotics-perception'],
    keywords: ['posture estimation', 'ESP32', 'motorized desk', 'closed loop'],
  },
  {
    slug: 'raspberry-pi-runway-inspection-uav',
    state: 'review',
    title: 'Raspberry Pi runway-inspection UAV',
    metaTitle: 'Raspberry Pi runway-inspection UAV (editorial review)',
    metaDescription:
      'Editorial review draft. Not indexable. A UAV prototype running lightweight FOD detection at the edge with parking-lot flight tests.',
    summary:
      'A Raspberry Pi 5B UAV prototype running a lightweight YOLOv11 foreign-object-debris detector, trained with online and synthetic data and tested in parking-lot environments used to simulate runway conditions.',
    role: 'Contributor. Public repository, model variant, dataset rights, evaluation split, and separation from employer work require confirmation.',
    form: 'diagram',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'diagram',
      diagramId: 'uav-fod',
      caption:
        'A Raspberry Pi 5B UAV runs an onboard detector at the edge, applies similarity matching and false-positive filtering, and returns tracked detections.',
      alt: 'Diagram of a Raspberry Pi 5B UAV foreign-object-debris pipeline: onboard camera, YOLOv11 inference, similarity matching, false-positive filtering, and tracked detections.',
    },
    answer: {
      what: 'A UAV prototype for runway foreign-object-debris detection at the edge.',
      problem:
        'Vehicle vibration, altitude changes, and repeated pavement texture can turn a detector that works on static images into a stream of false positives.',
      how: 'A Raspberry Pi 5B onboard a UAV runs a lightweight YOLOv11 variant, trained on a mix of online and synthetic data, with similarity matching and explicit false-positive handling. Parking-lot flight tests simulate runway conditions.',
      role: 'Rami Kronbi’s contribution scope, employer separation, and public repository are all pending editorial confirmation.',
    },
    stages: [
      { step: '01', title: 'Fly', detail: 'A UAV moves the sensor over a paved area at controlled altitude.' },
      { step: '02', title: 'See', detail: 'The Raspberry Pi 5B runs a YOLOv11 detector onboard.' },
      { step: '03', title: 'Match', detail: 'Similarity matching and false-positive filtering trim noisy detections.' },
      { step: '04', title: 'Track', detail: 'A tracked detection stream is produced for downstream review.' },
    ],
    limits: [
      'Exact model variant, input size, data rights, evaluation split, meaning of the reported 75–80% development accuracy, and flight-test ownership are pending editorial review.',
      'Confidential employer work is intentionally not expanded in this draft.',
    ],
    sources: [
      { label: 'Canonical CV (2026)', href: 'https://ramikronbi.com', kind: 'cv' },
    ],
    articleSlug: 'running-fod-detection-on-a-raspberry-pi-uav',
    topics: ['edge-ai', 'robotics-perception', 'computer-vision'],
    keywords: ['FOD detection', 'Raspberry Pi 5B', 'YOLOv11', 'edge inference'],
  },
  {
    slug: 'five-inch-carbon-fiber-fpv-drone',
    state: 'review',
    title: 'Five-inch carbon-fiber FPV drone',
    metaTitle: 'Five-inch carbon-fiber FPV drone (editorial review)',
    metaDescription:
      'Editorial review draft. Not indexable. A five-inch FPV quadcopter designed from thrust, weight, and current calculations, then tuned in Betaflight.',
    summary:
      'A five-inch carbon-fiber quadcopter designed from thrust, weight, and current calculations, followed by Betaflight configuration, PID tuning, flight-mode setup, GPS features, and return-to-home behavior.',
    role: 'Builder. Public media, dates, hardware specifications, and test locations are pending review.',
    form: 'diagram',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'diagram',
      diagramId: 'fpv-stack',
      caption:
        'The FPV stack as coupled constraints: motors and propellers, battery and current, weight and placement, and the Betaflight tuning that follows.',
      alt: 'Diagram of a five-inch FPV drone build stack: motor and propeller selection, battery and current budget, frame weight and placement, and a Betaflight configuration and tuning column.',
    },
    answer: {
      what: 'A five-inch carbon-fiber FPV drone build derived from first-principles calculations.',
      problem:
        'FPV builds fail when component choices are made independently; motor, propeller, battery, frame, and firmware are coupled constraints.',
      how: 'Motor and propeller choices flow from thrust and current targets; battery voltage sets the power budget; frame weight and component placement decide response. Software tuning begins only after the physical build is coherent, using Betaflight configuration, PID tuning, flight modes, GPS features, and return-to-home behavior.',
      role: 'Rami Kronbi built and tuned the aircraft; public media, dates, hardware specifications, and test locations are pending editorial confirmation.',
    },
    stages: [
      { step: '01', title: 'Size', detail: 'Motor and propeller choices flow from thrust and current requirements.' },
      { step: '02', title: 'Power', detail: 'Battery voltage sets the power budget; frame weight decides response.' },
      { step: '03', title: 'Configure', detail: 'Betaflight configuration wires the flight-controller behavior together.' },
      { step: '04', title: 'Tune', detail: 'PID tuning, flight modes, GPS features, and return-to-home behavior are set after the build is coherent.' },
    ],
    limits: [
      'GPS accuracy, RF link quality, and observations under GNSS jamming or IMU/GNSS integration constraints require careful public boundaries and are not published as measurements here.',
    ],
    sources: [
      { label: 'Canonical CV (2026)', href: 'https://ramikronbi.com', kind: 'cv' },
    ],
    articleSlug: 'engineering-a-five-inch-fpv-drone-from-first-principles',
    topics: ['embedded-systems', 'control-systems', 'robotics-perception'],
    keywords: ['FPV drone', 'Betaflight', 'PID tuning', 'GPS return-to-home'],
  },
  {
    slug: 'emotion-recognition-autism-support',
    state: 'review',
    title: 'Edge emotion-recognition prototype',
    metaTitle: 'Edge emotion-recognition prototype (editorial review)',
    metaDescription:
      'Editorial review draft. Not indexable. A Jetson Orin Nano facial-landmark and CNN prototype intended to support work with children with autism.',
    summary:
      'A facial-landmark and convolutional-neural-network pipeline developed on Jetson Orin Nano as a prototype intended to support work with children with autism.',
    role: 'Contributor. Team credits, dataset licenses, class definitions, evaluation protocol, and clinical review are pending confirmation.',
    form: 'diagram',
    schemaType: 'CreativeWork',
    hero: {
      kind: 'diagram',
      diagramId: 'emotion-pipeline',
      caption:
        'A facial-landmark extractor feeds a small CNN on Jetson Orin Nano. Predictions are qualified with confidence and framed as engineering signals, not diagnostic labels.',
      alt: 'Diagram of an edge emotion-recognition prototype: camera input, facial-landmark extraction, CNN classifier, confidence estimation, and a qualified engineering output rather than a clinical label.',
    },
    answer: {
      what: 'A Jetson Orin Nano prototype for edge emotion recognition, intended to support work with children with autism.',
      problem:
        'Facial expression is not a direct measurement of a person’s internal emotional state, and curated-dataset accuracy does not establish clinical validity.',
      how: 'A facial-landmark extractor feeds a small convolutional neural network trained on cleaned and combined data from CALMED, Kaggle, and other sources, running on Jetson Orin Nano at the edge.',
      role: 'Rami Kronbi’s contribution scope and team credits are pending editorial review; clinical framing must be resolved before publication.',
    },
    stages: [
      { step: '01', title: 'Detect', detail: 'A camera captures the face; landmarks are extracted.' },
      { step: '02', title: 'Classify', detail: 'A CNN produces a candidate label at the edge on Jetson Orin Nano.' },
      { step: '03', title: 'Qualify', detail: 'Predictions are qualified with confidence and framed as engineering signals.' },
      { step: '04', title: 'Review', detail: 'Any useful system must communicate uncertainty and be evaluated with the people and contexts it is intended to support.' },
    ],
    limits: [
      'Team credits, dataset licenses, class definitions, evaluation protocol, acquisition language, intended users, and clinical review are pending confirmation.',
      'Approximately 92% development accuracy is a development-set figure, not clinical validation.',
    ],
    sources: [
      { label: 'Canonical CV (2026)', href: 'https://ramikronbi.com', kind: 'cv' },
    ],
    articleSlug: 'lessons-from-an-edge-emotion-recognition-prototype',
    topics: ['edge-ai', 'computer-vision'],
    keywords: ['edge inference', 'emotion recognition', 'Jetson Orin Nano', 'responsible AI'],
  },
]

export const projectMap = Object.fromEntries(projects.map((p) => [p.slug, p]))

export const readyProjects = projects.filter((p) => p.state === 'ready')
export const reviewProjects = projects.filter((p) => p.state === 'review')

export function getProject(slug: string): typeof projects[number] | undefined {
  return projectMap[slug]
}
