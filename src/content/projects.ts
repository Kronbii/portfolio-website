import { type Project } from '@/content/schema'

export const projects: Project[] = [
  {
    slug: 'thermal-super-resolution',
    title: 'Real-Time Thermal Super-Resolution System',
    summary:
      'Machine learning system that enhances low-resolution thermal camera feeds into high-quality images at 229+ FPS.',
    description:
      'First real-time thermal super-resolution framework optimized for autonomous systems, robotics, and industrial monitoring.',
    problem:
      'Thermal cameras produce low-resolution images, which limits their reliability in edge robotics and autonomous applications.',
    solution:
      'Designed a lightweight IMDN-based neural network with a custom thermal-aware loss and TensorRT optimization for real-time deployment.',
    myRole:
      'Sole developer responsible for architecture, training pipeline, transfer learning strategy, and inference optimization.',
    outcome:
      'Reached 34.2 dB PSNR at 229+ FPS, establishing a production-ready benchmark for real-time thermal enhancement.',
    githubUrl: 'https://github.com/Kronbii/thermal-super-resolution',
    media: {
      src: '/images/projects/thermal-sr.webp',
      alt: 'Thermal super-resolution project preview',
    },
    technologies: [
      'PyTorch',
      'TensorRT',
      'OpenCV',
      'Computer Vision',
      'Deep Learning',
      'Edge ML Deployment',
    ],
    features: [
      '229+ FPS inference speed',
      '0.69M parameter edge-friendly architecture',
      'Custom thermal-aware loss function',
      'RGB-to-thermal transfer learning',
      'TensorRT production optimization',
    ],
  },
  {
    slug: 'omnisign',
    title: 'Real-Time Lebanese Sign Language Translator',
    summary:
      'AI system translating Lebanese Sign Language into spoken and written language in real time.',
    description:
      'Accessibility-focused AI pipeline combining gesture recognition, computer vision, and NLP translation.',
    problem:
      'The Lebanese deaf and hard-of-hearing community lacked practical real-time tools for everyday communication with non-signers.',
    solution:
      'Built a computer vision plus NLP pipeline that detects Lebanese Sign Language gestures and translates them into multiple languages.',
    myRole:
      'Lead AI engineer for gesture recognition, inference optimization, and CV-to-language-system integration.',
    outcome:
      'Won the Public Choice Award at National FYP Demo Day 2025 while delivering a meaningful accessibility prototype.',
    githubUrl: 'https://laythayache.com/projects/omnisign',
    externalUrl: 'https://laythayache.com/projects/omnisign',
    media: {
      src: '/images/projects/omnisign.webp',
      alt: 'Omnisign project preview',
    },
    technologies: [
      'Computer Vision',
      'Machine Learning',
      'NLP',
      'Real-Time Processing',
      'Deep Learning',
      'Gesture Recognition',
    ],
    features: [
      'Real-time LSL gesture recognition',
      'Arabic, English, and French output',
      'Low-latency translation pipeline',
      'Accessibility-focused product direction',
      'Award-winning social impact project',
    ],
  },
  {
    slug: 'autonomous-race-car',
    title: 'Autonomous Race Car',
    summary:
      'Self-driving vehicle built in 20 days that won WRO Future Engineers 2023 with computer vision and sensor fusion.',
    description:
      'Competition robot architecture combining embedded control, OpenCV perception, and robust real-time handling.',
    problem:
      'Needed to build a reliable autonomous race car with perception and control under severe competition time constraints.',
    solution:
      'Split perception and control across Jetson Nano and Arduino, combining lane detection, sign recognition, PID steering, and sensor fusion.',
    myRole:
      'Technical lead across system architecture, computer vision pipeline, sensor integration, and team coordination.',
    outcome:
      'Won WRO Future Engineers 2023 with 95%+ autonomous navigation accuracy.',
    githubUrl: 'https://github.com/Kronbii/autonomous-race-car',
    media: {
      src: '/images/projects/race-car.webp',
      alt: 'Autonomous race car project preview',
    },
    technologies: [
      'OpenCV',
      'Jetson Nano',
      'Arduino',
      'Computer Vision',
      'PID Control',
      'Sensor Fusion',
      'Embedded Systems',
    ],
    features: [
      'Built in 20 days',
      'Dual-processor architecture',
      'Lane and traffic sign perception',
      'IMU and color-sensor fusion',
      'Competition-winning autonomous performance',
    ],
  },
  {
    slug: 'smart-learning-table',
    title: 'AI-Powered Smart Desk for Classrooms',
    summary:
      'IoT desk with posture tracking and ergonomic adjustment for learning and comfort.',
    description:
      'An intelligent workstation that monitors posture and adjusts height or tilt using computer vision and embedded control.',
    problem:
      'Students and workers often maintain poor posture during long sessions, reducing comfort and focus.',
    solution:
      'Combined ESP32 control, motorized adjustment, and OpenCV-based posture analysis with dashboard feedback.',
    myRole:
      'Lead engineer for system architecture, posture model development, dashboard design, and hardware integration.',
    outcome:
      'Validated as a classroom prototype with real-time feedback for more than 30 students.',
    githubUrl: 'https://github.com/Kronbii/smart-interactive-desk',
    media: {
      src: '/images/projects/smart-desk.webp',
      alt: 'Smart desk project preview',
    },
    technologies: [
      'ESP32',
      'OpenCV',
      'Computer Vision',
      'IoT',
      'Web Development',
      'Motor Control',
    ],
    features: [
      'Motorized ergonomic adjustment',
      'Real-time posture tracking',
      'LED posture feedback',
      'Monitoring dashboard',
      'Bluetooth control interface',
    ],
  },
  {
    slug: 'spherical-panorama',
    title: '360° Spherical Mobile Panorama',
    summary:
      'Computer vision pipeline for stitching seamless spherical panoramas from mobile video and image inputs.',
    description:
      'A stitching and projection system for turning regular handheld captures into immersive 360° experiences.',
    problem:
      'High-quality panoramic capture from handheld devices is difficult because of alignment issues, stitching artifacts, and viewer complexity.',
    solution:
      'Built a Python pipeline using ORB, RANSAC, and spherical projection, then generated an interactive Three.js viewer.',
    myRole:
      'Sole developer and researcher from algorithm design through viewer delivery.',
    outcome:
      'Produced professional-grade 8K+ panoramas suitable for immersive viewing and presentation use cases.',
    githubUrl: 'https://github.com/Kronbii/360-spherical-stitching',
    media: {
      src: '/images/projects/goat.gif',
      alt: '360 spherical panorama project preview',
    },
    technologies: [
      'Python',
      'OpenCV',
      'NumPy',
      'Three.js',
      'RANSAC',
      'ORB',
      'Image Stitching',
      'WebGL',
    ],
    features: [
      'Automatic video and photo stitching',
      'Spherical projection mapping',
      'Interactive web viewer',
      '8K+ output support',
      'Memory-optimized processing',
    ],
  },
]

export const projectMap = Object.fromEntries(
  projects.map((project) => [project.slug, project])
)
