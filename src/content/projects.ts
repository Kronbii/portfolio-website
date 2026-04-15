import { type Project } from '@/content/schema'

export const projects: Project[] = [
  {
    slug: 'thermal-super-resolution',
    title: 'Real-Time Thermal Super-Resolution System',
    summary:
      'Machine learning system that enhances low-resolution thermal camera feeds to high-quality images at 229+ FPS for robotics and autonomous systems.',
    description:
      'First real-time thermal super-resolution framework optimized for autonomous vehicles, robotics, and industrial applications.',
    problem:
      'Thermal cameras produce low-resolution images, limiting their use in autonomous vehicles, robotics, industrial inspection, and surveillance applications that require high-quality thermal perception.',
    solution:
      'Developed a lightweight neural network (IMDN architecture with 0.69M parameters) optimized for real-time thermal image enhancement with custom thermal-aware loss function and TensorRT optimization.',
    myRole:
      'Sole developer - designed architecture, implemented thermal-aware training pipeline, optimized for real-time inference with TensorRT, and validated on thermal datasets.',
    outcome:
      'Achieved 34.2 dB PSNR at 229+ FPS, the first real-time thermal super-resolution system suitable for edge deployment in robotics and autonomous systems.',
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
      'Real-time performance: 34.2 dB PSNR at 229+ FPS',
      'Lightweight architecture with only 0.69M parameters',
      'Custom thermal-aware multi-component loss function',
      'Cross-domain RGB-to-thermal transfer learning',
      'TensorRT optimization for production deployment',
    ],
  },
  {
    slug: 'omnisign',
    title: 'Real-Time Lebanese Sign Language Translator',
    summary:
      'AI system that translates Lebanese Sign Language into spoken and written text in real-time using computer vision and natural language processing.',
    description:
      'AI-driven sign language interpreter developed to improve communication accessibility for the deaf and hard-of-hearing community in Lebanon.',
    problem:
      'The deaf and hard-of-hearing community in Lebanon lacked accessible tools for real-time communication with non-signers, limiting social integration and access to services.',
    solution:
      'Built a computer vision and NLP pipeline that recognizes Lebanese Sign Language gestures and translates them into multiple spoken and written languages in real-time.',
    myRole:
      'Lead AI engineer responsible for gesture recognition model development, real-time inference optimization, and CV-to-NLP pipeline integration.',
    outcome:
      'Won Public Choice Award at National FYP Demo Day 2025, enabling real-time communication for Lebanese Sign Language users with measurable social impact.',
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
      'Real-time Lebanese Sign Language gesture recognition',
      'Arabic, English, and French output',
      'Computer vision interpretation with 90%+ accuracy',
      'NLP-powered translation module',
      'Low-latency inference for communication use cases',
      'Public Choice Award at National FYP Demo Day 2025',
    ],
  },
  {
    slug: 'autonomous-race-car',
    title: 'Autonomous Race Car - WRO 2023 Champion',
    summary:
      'Fully autonomous vehicle built in 20 days that won the World Robot Olympiad Future Engineers 2023 competition using computer vision and sensor fusion.',
    description:
      'Fully integrated autonomous vehicle built from scratch in 20 days with a dual-processor architecture for robust perception and control.',
    problem:
      'Build a self-driving car capable of autonomous navigation with traffic sign recognition and obstacle avoidance in under 3 weeks for the WRO Future Engineers 2023 competition.',
    solution:
      'Designed dual-processor system: Jetson Nano for computer vision (lane and sign detection) and Arduino Mega for real-time motor control with PID steering and IMU-based sensor fusion.',
    myRole:
      'Technical lead for system architecture, OpenCV computer vision pipeline, sensor fusion integration, and team development coordination.',
    outcome:
      'Won WRO Future Engineers 2023 championship with 95%+ navigation accuracy in autonomous challenges.',
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
      'C++',
      'Python',
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
      'IoT desk with computer vision-based posture tracking and automatic ergonomic adjustments for enhanced learning and health outcomes.',
    description:
      'Interactive sensor-driven workstation built to improve student engagement, ergonomic comfort, and learning outcomes in classroom and office environments.',
    problem:
      'Students and office workers suffer from poor posture and ergonomic issues during long study or work sessions, leading to health problems and reduced focus.',
    solution:
      'Built an IoT desk with ESP32 controllers, motorized actuators, and OpenCV posture analysis that automatically adjusts desk height and tilt while providing real-time posture feedback.',
    myRole:
      'Lead engineer for system architecture, OpenCV posture tracking model, dashboard development, and hardware control integration.',
    outcome:
      'University prototype deployed in classroom conditions, monitoring posture for 30+ students with real-time feedback and ergonomic adjustments.',
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
      'Real-Time Systems',
      'Python',
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
      'Professional computer vision pipeline for creating seamless 360° spherical panoramas from phone footage.',
    description:
      'Robust computer vision tool that reconstructs seamless 360° panoramas from phone photos or videos using ORB matching, RANSAC, and spherical projection.',
    problem:
      'High-quality panoramic capture from handheld devices is difficult because of alignment issues, stitching artifacts, and viewer complexity.',
    solution:
      'Built a Python pipeline with feature detection, robust matching, and spherical projection, then generated an interactive Three.js web viewer.',
    myRole:
      'Sole developer and researcher.',
    outcome:
      'Developed a professional-grade tool capable of generating 8K+ panoramas suitable for immersive viewing use cases.',
    githubUrl: 'https://github.com/Kronbii/360-spherical-stitching',
    media: {
      src: '/images/projects/goat.webp',
      alt: '360 spherical panorama project preview',
    },
    technologies: [
      'Python',
      'OpenCV',
      'NumPy',
      'Three.js',
      'Computer Vision',
      'HTML5',
      'RANSAC',
      'ORB',
      'Video Processing',
      'Memory Management',
      'Image Stitching',
      'Homography Estimation',
      'JavaScript',
      'WebGL',
    ],
    features: [
      'Automatic video and photo stitching',
      'Robust ORB feature matching',
      'Spherical projection mapping',
      'Interactive web viewer',
      'Video keyframe extraction',
      '8K+ resolution support',
      'Memory-optimized processing',
    ],
  },
  {
    slug: 'oreyeon-rsms',
    title: 'Runway Surface Monitoring System',
    summary:
      'AI-powered computer vision platform for real-time Foreign Object Debris (FOD) detection and pavement damage analysis on airport runways, deployed across international airports in Madrid, the Middle East, and the US.',
    description:
      'End-to-end computer vision system that detects FOD and runway surface damage in real-time using deep learning, cutting full inspection time from 15–20 minutes to under 4 minutes while exceeding manual detection accuracy.',
    problem:
      'Manual runway inspections take 15–20 minutes, achieve only 50–70% detection accuracy, and rely entirely on human vigilance — leaving airports exposed to FOD incidents that cost the aviation industry over $4 billion annually.',
    solution:
      'Built a deep learning detection pipeline running on the Mobile Detection Unit (MDU), a vehicle-mounted sensor array that classifies debris and pavement damage by size, material, and hazard level as the vehicle traverses the runway. Paired with IDRA, an augmented-reality inspector reporting app for immediate incident documentation.',
    myRole:
      'Computer Vision & ML Engineer at Oreyeon — responsible for model development, real-time inference optimization, and deployment of the detection pipeline across live airport environments.',
    outcome:
      'System achieves 85–100% detection accuracy versus 50–70% for manual inspection, reduces inspection time by over 40%, and delivers savings of up to €3 million per operational runway annually. Certified against ICAO and FAA standards.',
    externalUrl: 'https://www.oreyeon.com',
    githubUrl: 'https://www.oreyeon.com',
    media: {
      src: '/images/projects/oreyeon.webp',
      alt: 'Oreyeon Runway Surface Monitoring System preview',
    },
    technologies: [
      'Computer Vision',
      'Deep Learning',
      'Object Detection',
      'PyTorch',
      'Edge Deployment',
      'Real-Time Inference',
      'Aviation Safety',
    ],
    features: [
      '85–100% FOD detection accuracy vs. 50–70% for manual inspection',
      'Full runway inspection in 3–4 minutes vs. 15–20 minutes manually',
      'Real-time classification of debris by size, material, and hazard level',
      'Operates 24/7 in all weather conditions including darkness',
      'Deployed at international airports in Madrid, the Middle East, and the US',
      'Up to €3M in annual savings per operational runway — ICAO & FAA aligned',
    ],
  },
]

export const projectMap = Object.fromEntries(
  projects.map((project) => [project.slug, project])
)
