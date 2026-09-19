import { type HomeContent } from '@/content/schema'

export const homeContent: HomeContent = {
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#selected-work' },
    { label: 'Projects', href: '/projects' },
    { label: 'Writing', href: '/writing' },
    { label: 'Community', href: '#community' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    // Fields below marked "not rendered" are kept for schema completeness.
    // home-hero.tsx renders: specialty, secondaryCta, image, role, name, mission.
    eyebrow: 'Home', // not rendered
    title: 'Rami Kronbi', // not rendered
    subtitle:
      'Robotics and embedded systems engineer working on intelligent physical systems.', // not rendered
    description:
      'Embedded perception and real-time vision in production today; robotics, aerial systems, and autonomy next.', // not rendered
    primaryCta: {
      label: 'View work', // not rendered
      href: '#selected-work',
    },
    secondaryCta: {
      label: 'Contact me',
      href: '#contact',
    },
    image: {
      src: '/images/home/portrait.avif',
      alt: 'Rami Kronbi, robotics and embedded systems engineer',
    },
    // not rendered — see about.stats for the visible counters
    metrics: [
      { value: '4', label: 'Years Experience' },
      { value: '10', label: 'Projects Delivered' },
      { value: '5', label: 'Awards Won' },
    ],
    chain: [
      {
        label: 'Sense',
        note: 'Cameras, thermal, LiDAR and inertial data off real hardware.',
      },
      {
        label: 'Perceive',
        note: 'Real-time inference on edge compute, not a workstation.',
      },
      {
        label: 'Act',
        note: 'Control loops that move something in the physical world.',
      },
    ],
    location: 'Based in Lebanon', // not rendered
    specialty: 'Lebanon · Robotics, Perception, Autonomy',
    role: 'Robotics & Embedded Systems Engineer',
    name: 'Rami Kronbi',
    mission: 'Intelligent systems for the physical world.',
  },
  about: {
    titleLeading: 'About',
    titleAccent: 'Me',
    intro: 'I build systems that sense the world and act on it.',
    paragraphs: [],
    image: {
      src: '/images/home/portrait.avif',
      alt: 'Rami Kronbi, robotics and embedded systems engineer',
    },
    // [VERIFY] All three counters are unconfirmed. Values preserved from the
    // previous copy — replace with real numbers or remove the block.
    stats: [
      { value: '4', label: 'Years Experience' },
      { value: '10', label: 'Systems Shipped' },
      { value: '5', label: 'Awards Won' },
    ],
  },
  // Not rendered — HomeCapabilitiesSection is not mounted in src/app/page.tsx.
  // Kept in sync with the current positioning in case the section returns.
  capabilities: {
    eyebrow: 'What I Work On',
    title: 'Systems that perceive, decide, and act.',
    description:
      'Perception and embedded software taken all the way to hardware running in the field.',
    items: [
      {
        title: 'Embedded Perception',
        description:
          'Vision systems that run on the device: runway inspection, lane and sign detection, gesture recognition, posture tracking.',
      },
      {
        title: 'Real-Time & Edge Inference',
        description:
          'Models compressed and rebuilt with TensorRT until they hold frame rate on constrained hardware.',
      },
      {
        title: 'Autonomous Systems',
        description:
          'Full loops from sensor to actuator — sensor fusion, PID control, and the embedded software between them.',
      },
      {
        title: 'Systems Integration',
        description:
          'Cameras, microcontrollers, compute modules, and services wired into one system that stays up.',
      },
      {
        title: 'Applied Machine Learning',
        description:
          'Models built for a specific job — accessibility, safety, education — and judged on whether they work in use.',
      },
    ],
  },
  experience: {
    eyebrow: 'Experience & Roles',
    title: 'Engineering under real constraints.',
    description:
      'Production vision and embedded work, plus the people and spaces around it.',
    items: [
      {
        id: '1',
        role: 'Embedded Systems & Vision Engineer',
        company: 'Oreyeon',
        period: '2024 – Present',
        location: 'Beirut, Lebanon',
        description:
          'Perception and embedded software for runway safety systems: real-time detection on edge hardware, running in live airport operations.',
        technologies: [
          'Python',
          'OpenCV',
          'PyTorch',
          'TensorRT',
          'Edge Inference',
          'Docker',
          'FastAPI',
        ],
      },
      {
        id: '2',
        // [VERIFY] Start year and whether this is still active.
        role: 'Co-organizer',
        company: 'space²',
        period: '2025 – Present',
        location: 'Lebanon',
        description:
          'Helping build an engineering space where students and small teams in Lebanon turn ideas into working prototypes, aimed at problems the region actually has.',
        technologies: [
          'Electronics',
          'Embedded Systems',
          'Prototyping',
          '3D Printing',
          'Mentorship',
        ],
      },
      {
        id: '3',
        // [VERIFY] Period "2023 – 2026" overlaps the Oreyeon role.
        role: 'Embedded Vision Engineer',
        company: 'Independent',
        period: '2023 – 2026',
        location: 'Remote',
        description:
          'Edge-deployed vision and control work for client projects, plus easyPID — an open-source PID controller library published in the Arduino Library Manager.',
        technologies: [
          'C++',
          'TensorFlow Lite',
          'ONNX',
          'Raspberry Pi',
          'OpenCV',
          'Arduino',
        ],
      },
      {
        id: '4',
        role: 'Startups Mentor',
        company: 'INJAZ MENA',
        period: '2026',
        location: 'Beirut, Lebanon',
        description:
          'Mentoring early-stage founders on scoping and prototyping technical products — what to build first, and what the engineering will actually cost.',
        technologies: [
          'Mentorship',
          'Technical Scoping',
          'Prototyping',
          'Product Strategy',
        ],
      },
    ],
  },
  projects: {
    eyebrow: 'Selected Work',
    title: 'From perception to autonomy.',
    description:
      'One line runs through these — making machines perceive their surroundings, run in real time on limited hardware, and act on what they find.',
    spotlightSlugs: [
      'oreyeon-rsms',
      'autonomous-race-car',
      'thermal-super-resolution',
      'omnisign',
      'smart-learning-table',
      'spherical-panorama',
    ],
  },
  community: {
    eyebrow: 'Community & Impact',
    title: 'Engineering with, and for, other people.',
    description:
      'Hackathons, public science, civic tools, and crisis work — built with others, alongside the technical work.',
    items: [
      {
        id: '1',
        // [VERIFY] Founder / co-founder role is unconfirmed — phrasing kept neutral.
        title: 'Nasna — Crisis Support',
        tagline:
          'A volunteer crisis-response effort built during the 2024 war in Lebanon, using data to decide where aid should go.',
        date: '2024',
        image: {
          src: '/images/community/nasna.webp',
          alt: 'Nasna crisis support initiative',
        },
        points: [
          'Started during the 2024 war in Lebanon to help route aid to the people who needed it first.',
          'Mapping and logistics tooling to identify at-risk areas and prioritise deliveries.',
          'Coordinated with local organisations, donors, and volunteer networks.',
          'Data used to make relief decisions, not to produce reports.',
        ],
      },
      {
        id: '2',
        // [VERIFY] Public sources describe a volunteer/participant role in 2022,
        // not a chapter lead. Wording softened to "organizing team".
        title: 'NASA Space Apps Beirut',
        tagline:
          "On the organizing team for the Beirut edition of NASA's Space Apps Challenge, the largest global hackathon.",
        date: '2022 - 2025',
        link: 'https://www.spaceappschallenge.org/',
        image: {
          src: '/images/community/nasa-space-apps.webp',
          alt: 'NASA Space Apps Beirut',
        },
        points: [
          'On the organizing team for the Beirut edition across four years, 2022 to 2025.',
          'Logistics, judging, and mentoring for a multi-day hackathon.',
          'Worked alongside engineers, designers, and scientists from across the Lebanese tech community.',
          'Connected Lebanese teams into the global Space Apps programme.',
        ],
      },
      {
        id: '3',
        title: 'Daleel (دليل)',
        tagline:
          'Election-transparency platform for Lebanon with an append-only record, source archiving, and full Arabic/English support.',
        date: '2026',
        link: 'https://daleel-lb.vercel.app',
        image: {
          src: '/images/community/daleel.webp',
          alt: 'Daleel election transparency platform',
        },
        points: [
          'Election-transparency platform with an append-only, auditable record of every change.',
          'Automatic source archiving so records survive edits and takedowns.',
          'Arabic and English throughout, not as an afterthought.',
          'Built security-first: the threat model is manipulation, not traffic.',
        ],
      },
      {
        id: '4',
        // [VERIFY] The 2025 DevFest talk was GDG North Lebanon, BAU Tripoli campus
        // — not Beirut. Title generalised to "DevFest Lebanon".
        title: 'DevFest Lebanon',
        tagline:
          'Talk on running multimodal vision and language models on small hardware, at GDG DevFest Lebanon 2025.',
        date: '2025',
        link: 'https://devfest.gdglebanon.com/',
        image: {
          src: '/images/community/devfest-2025.webp',
          alt: 'DevFest Lebanon talk on on-device AI',
        },
        points: [
          '"On-Device Multimodal Assistants: Can We Fit GPT-Vision on Small Hardware?"',
          'Quantisation, memory budgets, and hardware acceleration for on-device inference.',
          'Ended with a live demo running on consumer hardware.',
          'GDG DevFest Lebanon, December 2025.',
        ],
      },
      {
        id: '5',
        // [VERIFY] Linked source is RHU Physics Day — confirm whether the event
        // is national or university-run before restoring a broader claim.
        title: 'Physics & Astronomy Day',
        tagline:
          'Organizing an annual public physics and astronomy day — experiments, lectures, and stargazing.',
        date: '2021 - 2025',
        link: 'https://www.rhu.edu.lb/media-room/news/rhu-physics-day-2025-celebrates-the-wonders-of-the-universe-with-inspiring-lectures-experiments-and-stargazing',
        image: {
          src: '/images/community/physics-day-1.webp',
          alt: 'Physics and astronomy day event',
        },
        points: [
          'On the organizing team for five consecutive editions, 2021 to 2025.',
          'Hands-on experiments, public lectures, and live stargazing sessions.',
          'Built for school and university students, not for specialists.',
          'The clearest version of why I got into engineering in the first place.',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'Research, Roles & Collaboration',
    title: "Let's build something that has to work.",
    description:
      'Open to research collaborations, engineering roles, and work on autonomous and aerial systems.', // not rendered
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
    note: 'Open to research collaborations and engineering roles.', // not rendered
    responseTime: 'Typical response time: 24-48 hours.', // not rendered
  },
}
