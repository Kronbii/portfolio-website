import { type LineupEntry } from './sticky-lineup'

// Sandbox-local content on purpose: this folder gets deleted whole, and
// src/content should not accumulate throwaway fixtures. Copy is drawn from
// src/content/projects.ts and kept to the claims that survive verification —
// no placement claim on WRO, and the published thermal FPS figures.

export const lineupEntries: LineupEntry[] = [
  {
    id: 'oreyeon-rsms',
    index: '01',
    kicker: 'Production · Oreyeon',
    title: 'Runway Surface Monitoring',
    body: 'Vehicle-mounted perception that inspects an airport runway in a single pass, detecting foreign object debris and pavement damage in real time. Runway inspection is otherwise done by eye, from a moving vehicle, on a fixed schedule — slow, competing with aircraft movements for runway time, and dependent on who happens to be looking.',
    specs: [
      { label: 'Platform', value: 'Mobile Detection Unit' },
      { label: 'Runtime', value: 'Edge inference, no network required' },
      { label: 'Status', value: 'In service — Middle East and US' },
    ],
    items: [
      { name: 'MDU', note: 'Sensor array mounted to an ordinary airport support vehicle — no dedicated platform, no runway closure for the rig itself.' },
      { name: 'Detection', note: 'Foreign object debris and pavement damage classified by location, size, material, and hazard level as the vehicle drives.' },
      { name: 'IDRA', note: "Oreyeon's augmented-reality reporting app, so what the vehicle finds reaches the inspector standing on the ground." },
      { name: 'Envelope', note: 'Runs day or night, through poor weather, and with no network connection available.' },
    ],
    image: {
      src: '/images/projects/oreyeon.webp',
      alt: 'Yellow and black airport inspection pickup with a roof-mounted sensor pod, parked on an apron',
    },
  },
  {
    id: 'thermal-sr',
    index: '02',
    kicker: 'Research · Sole developer',
    title: 'Thermal Super-Resolution',
    body: 'A small neural network that upscales low-resolution thermal video without leaving real time, so a cheap sensor can do the work of an expensive one. Thermal cameras cost in proportion to their resolution, which puts thermal perception out of reach for most robotics and inspection work. This buys the resolution back with compute instead.',
    specs: [
      { label: 'Model', value: '0.69M-parameter IMDN variant' },
      { label: 'Throughput', value: '~130 FPS at 2×, RTX 3070' },
      { label: 'Edge', value: '20–30 FPS on Jetson Orin' },
    ],
    items: [
      { name: 'IMDN', note: '0.69M parameters — small enough to sit inline with an object detector rather than replacing its compute budget.' },
      { name: 'Loss', note: 'Thermal-aware objective instead of a borrowed RGB one, which otherwise hallucinates texture that no heat map contains.' },
      { name: 'Transfer', note: 'Cross-domain training from RGB data to work around how little thermal training data exists.' },
      { name: 'Deploy', note: 'Multithreaded C++ TensorRT pipeline; 34.2 dB PSNR and 0.840 SSIM on the benchmark set.' },
    ],
    image: {
      src: '/images/projects/thermal-sr.webp',
      alt: 'A thermal street scene at 170x213 pixels beside the same frame upscaled three times to 510x639',
    },
  },
  {
    id: 'race-car',
    index: '03',
    kicker: 'WRO Future Engineers 2023 · Team Brainiacs',
    title: 'Autonomous Race Car',
    body: 'A self-driving vehicle built from scratch in 20 days — perception, decision, and control closed in a single loop. Dual-processor by design, splitting vision and control across separate hardware so that neither one starves the other of the timing it needs.',
    specs: [
      { label: 'Compute', value: 'Jetson Nano + Arduino Mega' },
      { label: 'Control', value: 'PID steering over fused IMU and colour' },
      { label: 'Build', value: '20 days, student budget' },
    ],
    items: [
      { name: 'Jetson Nano', note: 'Runs the OpenCV lane- and traffic-sign detection pipeline, kept off the control loop entirely.' },
      { name: 'Arduino Mega', note: 'Closes a PID steering loop over the drivetrain at a rate vision could never sustain.' },
      { name: 'Fusion', note: 'MPU6050 IMU and TCS34725 colour sensor combined for heading estimation and lap logic.' },
      { name: 'Constraint', note: 'Designed, built, and tuned in 20 days on a student budget, for WRO Future Engineers 2023.' },
    ],
    image: {
      src: '/images/projects/race-car.webp',
      alt: 'Four-wheeled autonomous car with an aluminium chassis, single-board computer, camera, and battery pack',
    },
  },
  {
    id: 'omnisign',
    index: '04',
    kicker: 'Accessibility · Final year project',
    title: 'OmniSign',
    body: 'Reads Lebanese Sign Language from a live camera and turns it into text and speech. Dozens of spoken languages have real-time translation in your pocket and this one did not. The obstacle was never the model — the language had almost no usable dataset, so building one was the actual work.',
    specs: [
      { label: 'Input', value: 'Live hand-landmark tracking' },
      { label: 'Output', value: 'Arabic, English, French' },
      { label: 'Latency', value: 'Low enough to hold a conversation' },
    ],
    items: [
      { name: 'Dataset', note: 'Built from scratch — Lebanese Sign Language had almost none. Diversity of signers was prioritised over raw volume.' },
      { name: 'Tracking', note: 'Hand-landmark extraction from a live camera feed, feeding gesture recognition end to end.' },
      { name: 'Translation', note: 'Gesture sequences resolved into Arabic, English, and French text and speech.' },
      { name: 'Latency', note: 'Low enough that two people can hold an actual conversation through it.' },
    ],
    image: {
      src: '/images/projects/omnisign.webp',
      alt: 'Chart of Arabic sign-language handshapes, each labelled with its letter',
    },
  },
]
