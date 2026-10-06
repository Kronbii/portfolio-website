/**
 * Curated homepage work data for the sandbox pairings. Copy is drawn from the
 * authority records (accurate titles, roles, and results); media is the
 * strongest real plate available for each item. Every item links to its
 * canonical page when one exists and to its external evidence.
 */

export interface WorkItem {
  slug: string
  title: string
  dek: string
  role: string
  field: string
  media: { src: string; alt: string; w: number; h: number }
  /** Light-ground plates get a deeper veil so the field stays near-black. */
  tone?: 'light'
  /** object-position for tiles and chapters when the default center crop fails. */
  focus?: string
  canonical?: string
  external: { label: string; href: string }
}

export interface MomentItem {
  id: string
  title: string
  role: string
  where: string
  when: string
  dek: string
  media: { src: string; alt: string; w: number; h: number }
  canonical?: string
  external?: { label: string; href: string }
}

export const work: WorkItem[] = [
  {
    slug: '360-spherical-panorama-stitching',
    title: '360° Spherical Panorama Stitching',
    dek: 'A CPU-only OpenCV pipeline that turns a handheld phone sweep into an equirectangular panorama and a browser viewer.',
    role: 'Sole developer',
    field: 'Computer vision',
    media: {
      src: '/images/authority/spherical-panorama/panorama.jpg',
      alt: 'Equirectangular panorama of an interior reconstructed from a handheld phone sweep.',
      w: 4096,
      h: 2048,
    },
    canonical: '/projects/360-spherical-panorama-stitching',
    external: { label: 'Live viewer', href: 'https://360.ramikronbi.com' },
  },
  {
    slug: 'thermal-super-resolution',
    title: 'Thermal Super-Resolution',
    dek: 'An IMDN-derived network adapted to single-channel thermal imagery and deployed on Jetson Orin.',
    role: 'Computer vision engineer',
    field: 'Edge AI',
    tone: 'light',
    focus: '25% 50%',
    media: {
      src: '/images/authority/thermal-super-resolution/thermal-plate.webp',
      alt: 'A low-resolution thermal street scene beside the same frame upscaled three times.',
      w: 1424,
      h: 536,
    },
    canonical: '/projects/thermal-super-resolution',
    external: { label: 'GitHub', href: 'https://github.com/Kronbii/thermal-super-resolution' },
  },
  {
    slug: 'brainiacs-autonomous-race-car',
    title: 'Brainiacs Autonomous Race Car',
    dek: 'Jetson Nano perception and Arduino Mega control, built in twenty days; third place, WRO Future Engineers 2023.',
    role: 'Team member with Wassim Ghaddar',
    field: 'Robotics',
    media: {
      src: '/images/projects/race-car.webp',
      alt: 'Four-wheeled autonomous car with an aluminium chassis, single-board computer, camera, and battery pack.',
      w: 1024,
      h: 1024,
    },
    canonical: '/projects/brainiacs-autonomous-race-car',
    external: { label: 'GitHub', href: 'https://github.com/Kronbii/autonomous-race-car' },
  },
  {
    slug: 'omnisign-lebanese-sign-language',
    title: 'OmniSign',
    dek: 'Real-time Lebanese Sign Language translation across mobile, web, and offline embedded targets.',
    role: 'Co-founder and computer vision engineer',
    field: 'Accessibility',
    tone: 'light',
    media: {
      src: '/images/projects/omnisign.webp',
      alt: 'Chart of Arabic sign-language handshapes, each labelled with its letter.',
      w: 600,
      h: 465,
    },
    canonical: '/projects/omnisign-lebanese-sign-language',
    external: { label: 'Team page', href: 'https://laythayache.com/projects/omnisign' },
  },
  {
    slug: 'posture-aware-classroom-desk',
    title: 'Smart Interactive Desk (BEMO)',
    dek: 'A senior graduation project: posture sensing, ESP32 control, and motorized height and tilt in one workstation.',
    role: 'Team lead, five-person team',
    field: 'Embedded systems',
    media: {
      src: '/images/projects/smart-desk.webp',
      alt: 'Wooden prototype desk with a tilting top, gooseneck camera, and a small control screen.',
      w: 1600,
      h: 899,
    },
    canonical: '/projects/posture-aware-classroom-desk',
    external: { label: 'Demo video', href: 'https://youtu.be/5TPmpPc6rjY' },
  },
  {
    slug: 'easypid-arduino-library',
    title: 'easyPID',
    dek: 'A hardware-agnostic Arduino PID library in the Arduino Library Manager: timing, anti-windup, filtering, autotuning.',
    role: 'Author',
    field: 'Control systems',
    media: {
      src: '/images/authority/easypid/pid-loop.svg',
      alt: 'Closed-loop PID control diagram for easyPID: setpoint and measurement form an error, P, I, and D terms with anti-windup and filtering are summed, bounded output drives the plant, and the sensor feeds back.',
      w: 1600,
      h: 1000,
    },
    canonical: '/projects/easypid-arduino-library',
    external: { label: 'Arduino Library Manager', href: 'https://www.arduinolibraries.info/libraries/easy-pid' },
  },
]

export const moments: MomentItem[] = [
  {
    id: 'nasna',
    title: 'NASNA',
    role: 'Co-founder, AI engineer and developer',
    where: 'Lebanon',
    when: '2024–2025',
    dek: 'A humanitarian coordination platform connecting displaced families with NGOs and volunteers, live at nasna.world.',
    media: { src: '/images/community/nasna.webp', alt: 'Nasna crisis support initiative.', w: 857, h: 1198 },
    canonical: '/writing/building-technology-around-crisis-response-operations',
    external: { label: 'nasna.world', href: 'https://nasna.world' },
  },
  {
    id: 'space-apps',
    title: 'NASA Space Apps Beirut',
    role: 'Lead technical organizer',
    where: 'Beirut',
    when: '2021–2024',
    dek: 'Technical bootcamps and on-ground operations for a hackathon of 250–400 participants a year.',
    media: { src: '/images/community/nasa-space-apps.webp', alt: 'NASA Space Apps Beirut.', w: 1350, h: 1800 },
    canonical: '/writing/what-four-years-of-technical-mentoring-taught-me',
    external: { label: 'Space Apps', href: 'https://www.spaceappschallenge.org/' },
  },
  {
    id: 'daleel',
    title: 'Daleel (دليل)',
    role: 'Lead developer, with Layth Ayache',
    where: 'Lebanon',
    when: '2026',
    dek: 'A verifiable, multilingual election-information platform built around source archiving and append-only history.',
    media: { src: '/images/community/daleel.webp', alt: 'Daleel election information platform.', w: 2560, h: 1435 },
    canonical: '/projects/daleel-lebanese-election-information',
    external: { label: 'GitHub', href: 'https://github.com/Kronbii/daleel' },
  },
  {
    id: 'devfest',
    title: 'DevFest Tripoli 2025',
    role: 'Speaker',
    where: 'GDG North Lebanon, BAU Tripoli',
    when: 'December 2025',
    dek: 'On-device multimodal assistants: fitting vision-language models on small hardware, with a live demo.',
    media: { src: '/images/community/devfest-2025.webp', alt: 'DevFest 2025 talk on on-device AI.', w: 728, h: 587 },
    canonical: '/writing/talks-workshops-and-teaching',
    external: { label: 'Event', href: 'https://north25.gdglebanon.com/' },
  },
  {
    id: 'physics',
    title: 'Physics & Astronomy Day',
    role: 'Society lead, Physics & Astronomy Club',
    where: 'Rafik Hariri University',
    when: '2021–2024',
    dek: 'Hands-on experiments, public lectures, and stargazing built for students rather than specialists.',
    media: { src: '/images/community/physics-day-1.webp', alt: 'Physics and astronomy day event.', w: 1080, h: 720 },
    external: {
      label: 'RHU Physics Day 2025',
      href: 'https://www.rhu.edu.lb/media-room/news/rhu-physics-day-2025-celebrates-the-wonders-of-the-universe-with-inspiring-lectures-experiments-and-stargazing',
    },
  },
]
