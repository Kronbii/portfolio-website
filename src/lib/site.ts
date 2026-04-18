export const siteConfig = {
  name: 'Rami Kronbi',
  shortName: 'Rami Kronbi',
  title: 'Rami Kronbi | AI Systems Engineer',
  description:
    'Rami Kronbi is an AI systems and computer vision engineer based in Beirut, Lebanon. Embedded Systems & Vision Engineer at Oreyeon, building real-time runway safety monitoring systems for production airports. Creator of thermal super-resolution pipelines at 229+ FPS, OmniSign Lebanese Sign Language AI, and Nasna NGO. NASA Space Apps Beirut organizer (2022–2025). Rafik Hariri University graduate and Nazik Rafik Hariri Award recipient (2025).',
  url: 'https://ramikronbi.com',
  email: 'ramykronby@gmail.com',
  location: 'Beirut, Lebanon',
  availability: 'Available for select projects',
  socials: {
    github: 'https://github.com/Kronbii',
    linkedin: 'https://www.linkedin.com/in/rami-kronbi/',
    medium: 'https://medium.com/@ramikronbi',
    devto: 'https://dev.to/ramikronbi',
    hashnode: 'https://hashnode.com/@kronbii',
    researchgate: 'https://www.researchgate.net/profile/Rami-Kronbi',
    arduinolibraries: 'https://www.arduinolibraries.info/authors/kronbii',
  },
  employer: {
    name: 'Oreyeon',
    url: 'https://www.oreyeon.com/',
  },
  education: {
    name: 'Rafik Hariri University',
    url: 'https://www.rhu.edu.lb',
  },
} as const

export type SiteConfig = typeof siteConfig
