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
  projects: {
    eyebrow: 'Portfolio Projects',
    title: 'Real work, delivered with impact.',
    description:
      'From thermal imaging and accessibility AI to embedded robotics and immersive computer vision systems.',
    spotlightSlugs: [
      'thermal-super-resolution',
      'omnisign',
      'autonomous-race-car',
      'smart-learning-table',
      'spherical-panorama',
      'oreyeon-rsms',
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
