import { type HomeContent } from '@/content/schema'

export const homeContent: HomeContent = {
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#selected-work' },
    { label: 'Community', href: '#community' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'Home',
    title: 'Rami Kronbi',
    subtitle:
      'AI systems and computer vision engineer focused on real-time products.',
    description:
      'Building ultidisciplinary intelligent systems from autonomous robotics to enterprise computer vision and real-time ML applications.',
    primaryCta: {
      label: 'View projects',
      href: '#selected-work',
    },
    secondaryCta: {
      label: 'Contact me',
      href: '#contact',
    },
    image: {
      src: '/images/home/portrait.avif',
      alt: 'Portrait of Rami Kronbi',
    },
    metrics: [
      { value: '4', label: 'Years Experience' },
      { value: '10', label: 'Projects Delivered' },
      { value: '5', label: 'Awards Won' },
    ],
    location: 'Based in Lebanon',
    specialty: 'AI Systems, Computer Vision, and Autonomous Robotics',
    role: 'Systems Engineer',
    name: 'Rami Kronbi',
    mission: 'Multidisciplinary intelligent systems.',
  },
  about: {
    titleLeading: 'About',
    titleAccent: 'Me',
    intro: 'I build fast, reliable AI and computer vision products.',
    paragraphs: [
      'From robotics to safety systems, I ship production-ready solutions.',
    ],
    image: {
      src: '/images/home/portrait.avif',
      alt: 'Portrait of Rami Kronbi',
    },
    stats: [
      { value: '4', label: 'Years Experience' },
      { value: '10', label: 'Projects Delivered' },
      { value: '5', label: 'Awards Won' },
    ],
  },
  capabilities: {
    eyebrow: 'Core Expertise',
    title: 'Computer vision, real-time AI, and autonomous systems.',
    description:
      'The old site focused on shipping applied AI systems in production and competition environments with measurable outcomes.',
    items: [
      {
        title: 'Computer Vision',
        description:
          'Built perception systems for lane detection, sign-language recognition, posture tracking, and runway safety.',
      },
      {
        title: 'Real-Time AI',
        description:
          'Delivered low-latency machine learning pipelines, including thermal super-resolution at 229+ FPS.',
      },
      {
        title: 'Autonomous Robotics',
        description:
          'Designed and built autonomous vehicle systems using sensor fusion, embedded control, and real-time decision loops.',
      },
      {
        title: 'Edge ML Deployment',
        description:
          'Optimized lightweight models for deployment with TensorRT and edge-first constraints on performance and memory.',
      },
      {
        title: 'Applied Machine Learning',
        description:
          'Shipped practical ML products for accessibility, education, safety, and industrial workflows.',
      },
    ],
  },
  experience: {
    eyebrow: 'Professional Experience',
    title: 'Where work shaped expertise.',
    description: 'Roles across applied AI, computer vision, and intelligent systems.',
    items: [
      {
        id: '1',
        role: 'AI Systems Engineer',
        company: 'Oreyeon',
        period: '2022 – Present',
        location: 'Beirut, Lebanon',
        description:
          'Building real-time computer vision and runway safety monitoring systems deployed in production airport environments.',
        technologies: ['Python', 'PyTorch', 'TensorRT', 'OpenCV', 'FastAPI', 'Docker'],
      },
      {
        id: '2',
        role: 'Embedded AI Developer',
        company: 'Freelance',
        period: '2021 – 2022',
        location: 'Remote',
        description:
          'Designed and shipped edge-deployed ML models for accessibility and gesture recognition across multiple client projects.',
        technologies: ['C++', 'TensorFlow Lite', 'ONNX', 'Raspberry Pi', 'OpenCV'],
      },
      {
        id: '3',
        role: 'Research Engineer Intern',
        company: 'Lebanese American University',
        period: '2020 – 2021',
        location: 'Beirut, Lebanon',
        description:
          'Researched thermal image super-resolution and edge inference optimization, achieving 229+ FPS on constrained hardware.',
        technologies: ['Python', 'Keras', 'CUDA', 'NumPy', 'OpenCV'],
      },
    ],
  },
  projects: {
    eyebrow: 'Portfolio Projects',
    title: 'Real work, delivered with impact.',
    description:
      '',
    spotlightSlugs: [
      'oreyeon-rsms',
      'thermal-super-resolution',
      'omnisign',
      'autonomous-race-car',
      'smart-learning-table',
      'spherical-panorama',
    ],
  },
  community: {
    eyebrow: 'Mission & Vision',
    title: 'Building communities beyond code.',
    description:
      'Leadership, volunteering, and civic-tech initiatives built alongside technical work.',
    items: [
      {
        id: '1',
        title: '"Nasna" - crisis support',
        tagline:
          'Founder of a nonprofit NGO that applies data to deliver aid and crisis support to communities impacted by the war in Lebanon.',
        date: '2024',
        image: {
          src: '/images/community/nasna.webp',
          alt: 'Nasna crisis support initiative',
        },
        points: [
          'Founded a data-driven nonprofit NGO during the 2024 Lebanon war to coordinate emergency aid distribution.',
          'Built mapping and logistics tools to identify at-risk communities and prioritize relief delivery.',
          'Coordinated cross-sector partnerships with local organizations, donors, and aid networks.',
          'Delivered measurable relief to hundreds of displaced families across active conflict zones.',
        ],
      },
      {
        id: '2',
        title: 'NASA Space Apps Beirut',
        tagline:
          "Organizing the Beirut chapter of NASA's Space Apps, the world's largest global hackathon.",
        date: '2022 - 2025',
        link: 'https://www.spaceappschallenge.org/',
        image: {
          src: '/images/community/nasa-space-apps.webp',
          alt: 'NASA Space Apps Beirut',
        },
        points: [
          "Led the Beirut chapter of the world's largest hackathon across four consecutive years (2022-2025).",
          'Recruited and managed multi-disciplinary teams of engineers, designers, and scientists.',
          'Mentored 100+ participants on space-tech and AI problem-solving challenges.',
          'Represented Lebanon on the global NASA Space Apps platform and judging pipeline.',
        ],
      },
      {
        id: '3',
        title: 'Daleel (دليل)',
        tagline:
          'Security-first platform for Lebanese election transparency with immutable history, source archiving, and multilingual support.',
        date: '2026',
        link: 'https://daleel-lb.vercel.app',
        image: {
          src: '/images/community/daleel.webp',
          alt: 'Daleel election transparency platform',
        },
        points: [
          'Engineered a tamper-proof election transparency platform with an immutable, auditable data history.',
          'Implemented automated source archiving to preserve electoral records against takedowns or edits.',
          'Built full Arabic/English multilingual support for broad civic accessibility.',
          'Deployed with a security-first architecture designed to resist data manipulation and misinformation.',
        ],
      },
      {
        id: '4',
        title: 'DevFest Beirut',
        tagline:
          "Delivered a lecture on embedded AI at Lebanon's premier developer conference.",
        date: '2025',
        link: 'https://devfest.gdglebanon.com/',
        image: {
          src: '/images/community/devfest-2025.webp',
          alt: 'DevFest Beirut lecture',
        },
        points: [
          "Delivered a technical lecture on embedded AI at Lebanon's largest annual developer conference.",
          'Demonstrated real-time edge inference on constrained hardware to an audience of 500+ engineers.',
          'Covered on-device model optimization, quantization, and end-to-end deployment pipelines.',
          'Inspired the Lebanese developer community to pursue accessible, production-ready AI deployments.',
        ],
      },
      {
        id: '5',
        title: 'National Physics Day',
        tagline:
          "Leading and organizing Lebanon's biggest annual event for the physics and astronomy community.",
        date: '2021 - 2025',
        link: 'https://www.rhu.edu.lb/media-room/news/rhu-physics-day-2025-celebrates-the-wonders-of-the-universe-with-inspiring-lectures-experiments-and-stargazing',
        image: {
          src: '/images/community/physics-day-1.webp',
          alt: 'National Physics Day event',
        },
        points: [
          "Organized Lebanon's largest annual public physics and astronomy event across five consecutive years.",
          'Curated interactive experiments, expert-led lectures, and live stargazing sessions each edition.',
          'Grew attendance year-over-year, engaging thousands of students, enthusiasts, and academics.',
          'Fostered a national culture of scientific curiosity and long-term STEM participation.',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'Preferred Channels',
    title: "Let's build your next intelligent product.",
    description: 'Open to new opportunities and collaborations.',
    channels: [
      {
        label: 'github',
        sublabel: 'github',
        href: 'https://github.com/Kronbii',
      },
      {
        label: 'linkedin',
        sublabel: 'linkedin',
        href: 'https://www.linkedin.com/in/rami-kronbi/',
      },
      {
        label: 'email',
        sublabel: 'email',
        href: 'mailto:ramykronby@gmail.com',
      },
      {
        label: '+96171170226',
        sublabel: '+96171170226',
        href: 'tel:+96171170226',
      },
    ],
    note: 'Open to new opportunities and collaborations.',
    responseTime: 'Typical response time: 24-48 hours.',
  },
}
