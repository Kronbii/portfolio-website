import { type Project } from '@/content/schema'

// NOTE: `technologies[0]` is rendered as the card's category label on the
// homepage, and `features[]` are the bullets shown in the expanded panel.
// Everything else is reserved for the future /projects/[slug] pages.

export const projects: Project[] = [
  {
    slug: 'oreyeon-rsms',
    title: 'Runway Surface Monitoring System',
    summary:
      'Vehicle-mounted perception system that inspects an airport runway in a single pass, detecting foreign object debris and pavement damage in real time.',
    description:
      "Production computer vision for airport ground safety, built at Oreyeon and running in live airport operations. The detection pipeline rides on the company's Mobile Detection Unit — a sensor array mounted to an ordinary airport support vehicle.",
    problem:
      'Runway inspection is done by eye, from a moving vehicle, on a fixed schedule. It is slow, it competes with aircraft movements for runway time, and what gets found depends on who is looking.',
    solution:
      'A deep-learning detection pipeline running on the Mobile Detection Unit (MDU), classifying debris and pavement damage by location, size, material, and hazard level as the vehicle drives the runway. Paired with IDRA, Oreyeon\'s augmented-reality reporting app for inspectors on the ground.',
    myRole:
      'Embedded Systems & Vision Engineer at Oreyeon — detection model development, real-time inference optimisation, and getting the pipeline running reliably on the vehicle. [VERIFY] Confirm the exact scope before this goes on a project page.',
    outcome:
      'Oreyeon reports full inspection in under five minutes against 15–20 minutes manually, inspection times cut by over 40% at its Middle East and US deployments, and safety management aligned with ICAO and FAA standards. These are the company\'s figures for the product, not personal measurements.',
    externalUrl: 'https://www.oreyeon.com',
    githubUrl: 'https://www.oreyeon.com',
    media: {
      src: '/images/projects/oreyeon.webp',
      alt: 'Yellow and black airport inspection pickup with a roof-mounted sensor pod, parked on an apron',
    },
    technologies: [
      'Aviation Safety',
      'Computer Vision',
      'Edge Inference',
      'PyTorch',
      'Object Detection',
      'Real-Time Systems',
    ],
    features: [
      'Vehicle-mounted sensing that inspects a runway in a single drive-through',
      'Detects foreign object debris and pavement damage as the vehicle moves',
      'Classifies what it finds by location, size, material, and hazard level',
      'Runs day or night, in poor weather, and without a network connection',
      'In service in the Middle East and the US',
      'My part: detection models, real-time inference, and deployment',
    ],
  },
  {
    slug: 'autonomous-race-car',
    title: 'Autonomous Race Car — WRO 2023 Champion',
    summary:
      'A self-driving vehicle built from scratch in 20 days for World Robot Olympiad Future Engineers 2023 — perception, decision, and control in one loop.',
    description:
      'Team Brainiacs, WRO Future Engineers 2023. A dual-processor vehicle that splits perception and control across a Jetson Nano and an Arduino Mega so neither starves the other.',
    problem:
      'Build a car that drives itself around an unseen track, reads traffic signs, avoids obstacles, and completes timed laps — in under three weeks, on a student budget.',
    solution:
      'Jetson Nano running the OpenCV lane- and sign-detection pipeline; Arduino Mega closing a PID steering loop over the drivetrain; an MPU6050 IMU and TCS34725 colour sensor fused for heading and lap logic.',
    myRole:
      'Technical lead — system architecture, the computer vision pipeline, sensor fusion, and coordinating the build.',
    outcome:
      'Won World Robot Olympiad Future Engineers 2023. [VERIFY] Placement is not recorded in the repo README or any public WRO/RHU record found — confirm before this goes on a project page.',
    githubUrl: 'https://github.com/Kronbii/autonomous-race-car',
    media: {
      src: '/images/projects/race-car.webp',
      alt: 'Four-wheeled autonomous car with an aluminium chassis, single-board computer, camera, and battery pack',
    },
    technologies: [
      'Autonomous Systems',
      'Sensor Fusion',
      'Embedded Control',
      'Jetson Nano',
      'OpenCV',
      'PID Control',
      'C++',
      'Python',
    ],
    features: [
      'The whole loop in one vehicle: perception, decision, control, actuation',
      'Dual processor — vision on a Jetson Nano, control on an Arduino Mega',
      'Lane and traffic-sign detection feeding a PID steering controller',
      'IMU and colour-sensor fusion for heading and lap logic',
      'Designed, built, and tuned in 20 days',
      'Built for World Robot Olympiad Future Engineers 2023, team Brainiacs',
    ],
  },
  {
    slug: 'thermal-super-resolution',
    title: 'Real-Time Thermal Super-Resolution',
    summary:
      'A small neural network that upscales low-resolution thermal video without leaving real time, so a cheap sensor can do the work of an expensive one.',
    description:
      'Thermal cameras are expensive in proportion to their resolution. This is an attempt to buy resolution with compute instead: a 0.69M-parameter IMDN variant, trained with a thermal-aware loss and rebuilt in TensorRT for edge hardware.',
    problem:
      'High-resolution thermal sensors cost an order of magnitude more than low-resolution ones, which puts thermal perception out of reach for most robotics and inspection work. Generic super-resolution models make it worse — trained on RGB, they hallucinate texture that does not exist in a heat map.',
    solution:
      'A lightweight IMDN architecture with a multi-component thermal-aware loss, cross-domain transfer from RGB data to work around the scarcity of thermal training data, and a multithreaded C++ TensorRT pipeline for deployment.',
    myRole: 'Sole developer — architecture, training pipeline, and TensorRT deployment.',
    outcome:
      '34.2 dB PSNR and 0.840 SSIM; roughly 130 FPS at 2x on an RTX 3070, and 20–30 FPS on an NVIDIA Jetson Orin — fast enough to sit inline with an object detector on an edge device.',
    githubUrl: 'https://github.com/Kronbii/thermal-super-resolution',
    media: {
      src: '/images/projects/thermal-sr.webp',
      alt: 'A thermal street scene at 170x213 pixels beside the same frame upscaled three times to 510x639',
    },
    technologies: [
      'Edge Inference',
      'TensorRT',
      'PyTorch',
      'Computer Vision',
      'Deep Learning',
      'Thermal Imaging',
    ],
    features: [
      'Upscales low-resolution thermal video without leaving real time',
      '0.69M parameters — small enough to run on an edge device',
      'Thermal-aware loss instead of a borrowed RGB objective',
      'Cross-domain transfer from RGB to work around scarce thermal data',
      '34.2 dB PSNR, 0.840 SSIM; 20–30 FPS on a Jetson Orin',
      'Multithreaded C++ TensorRT pipeline for deployment',
    ],
  },
  {
    slug: 'omnisign',
    title: 'Real-Time Lebanese Sign Language Translator',
    summary:
      'OmniSign reads Lebanese Sign Language from a live camera and turns it into text and speech — built for a language with almost no training data.',
    description:
      'A gesture-recognition and translation pipeline for Lebanese Sign Language, built because dozens of spoken languages have real-time translation in your pocket and this one did not.',
    problem:
      'Deaf and hard-of-hearing people in Lebanon had no real-time way to communicate with non-signers. The technical obstacle is not the model — it is that Lebanese Sign Language has almost no usable dataset.',
    solution:
      'Hand-landmark tracking feeding a gesture-recognition model and a translation layer, with the dataset treated as the actual work rather than a preprocessing step: diversity of signers over raw volume.',
    myRole:
      'Computer vision lead — gesture recognition, real-time inference, and the vision-to-language pipeline. [VERIFY] Confirm role and team credits.',
    outcome:
      'Public Choice Award at the National FYP Demo Day 2025, and a working translator people could actually use. [VERIFY] award name and year.',
    githubUrl: 'https://laythayache.com/projects/omnisign',
    externalUrl: 'https://laythayache.com/projects/omnisign',
    media: {
      src: '/images/projects/omnisign.webp',
      alt: 'Chart of Arabic sign-language handshapes, each labelled with its letter',
    },
    technologies: [
      'Accessibility',
      'Computer Vision',
      'Gesture Recognition',
      'NLP',
      'Real-Time Systems',
      'Deep Learning',
    ],
    features: [
      'Reads Lebanese Sign Language from a live camera feed',
      'Hand-landmark tracking into gesture recognition, end to end',
      'Outputs Arabic, English, and French',
      'Built the dataset first — the language had almost none',
      'Low enough latency to hold a conversation',
      'Public Choice Award, National FYP Demo Day 2025',
    ],
  },
  {
    slug: 'smart-learning-table',
    // [NEEDS INFO] The prototype in the photo is branded "BEMO" — confirm the
    // project's real name and I will use it here.
    title: 'Posture-Aware Classroom Desk',
    summary:
      'A desk that watches how you sit and moves to fit you — camera-based posture tracking driving motorised height and tilt.',
    description:
      'An IoT workstation built as a university prototype: computer vision on the desk itself, actuators underneath it, and a dashboard behind it.',
    problem:
      'Students spend hours at desks that do not fit them, and nobody notices posture drifting until it has already caused a problem.',
    solution:
      'ESP32 controllers driving motorised height and tilt, an OpenCV posture-tracking model running against a desk-mounted camera, LED feedback in the moment, and a dashboard for the longer trend.',
    myRole:
      'Lead engineer — system architecture, the posture-tracking model, hardware control, and the dashboard.',
    outcome:
      'A working prototype tested in classroom conditions, adjusting to the person sitting at it in real time.',
    githubUrl: 'https://github.com/Kronbii/smart-interactive-desk',
    media: {
      src: '/images/projects/smart-desk.webp',
      alt: 'Wooden prototype desk with a tilting top, gooseneck camera, and a small control screen',
    },
    technologies: [
      'Embedded Systems',
      'Computer Vision',
      'ESP32',
      'Motor Control',
      'IoT',
      'Real-Time Systems',
    ],
    features: [
      'Camera-based posture tracking running on the desk itself',
      'Motorised height and tilt that adjust to the person sitting there',
      'ESP32 controllers driving the actuators',
      'LED feedback in the moment, dashboard for the trend',
      'Bluetooth control interface',
      'Built and tested as a university prototype in classroom conditions',
    ],
  },
  {
    slug: 'spherical-panorama',
    title: '360° Panorama Reconstruction',
    summary:
      'A stitching pipeline that reconstructs a full spherical panorama from handheld phone photos or video — the multi-view geometry underneath visual mapping.',
    description:
      'Feature matching, outlier rejection, homography estimation, and spherical projection, ending in an interactive Three.js viewer.',
    problem:
      'Handheld capture drifts. Frames overlap unevenly, exposure shifts, and naive stitching leaves seams and ghosting across the result.',
    solution:
      'ORB feature detection with RANSAC to reject bad correspondences, homography estimation between frames, and projection onto a sphere — with keyframe extraction so video can be used as input and memory management so 8K output does not blow up.',
    myRole: 'Sole developer.',
    outcome:
      'A pipeline that produces 8K+ spherical panoramas from a phone, viewable interactively in the browser.',
    githubUrl: 'https://github.com/Kronbii/360-spherical-stitching',
    media: {
      src: '/images/projects/goat.webp',
      alt: 'Stitched 360-degree panorama of an interior, shown in the interactive web viewer',
    },
    technologies: [
      'Computer Vision',
      'Multi-View Geometry',
      'OpenCV',
      'Python',
      'Three.js',
      'Image Stitching',
    ],
    features: [
      'Builds a full spherical panorama from handheld phone photos or video',
      'ORB feature matching with RANSAC to throw out bad correspondences',
      'Homography estimation and spherical projection — the geometry behind visual mapping',
      'Keyframe extraction so video works as an input',
      'Memory-managed up to 8K+ output',
      'Interactive Three.js viewer',
    ],
  },
]

export const projectMap = Object.fromEntries(
  projects.map((project) => [project.slug, project])
)
