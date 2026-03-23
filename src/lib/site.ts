export const siteConfig = {
  name: 'Rami Kronbi',
  shortName: 'Rami Kronbi',
  title: 'Rami Kronbi | AI Systems Engineer',
  description:
    'AI systems engineer building computer vision products, intelligent interfaces, and high-performance digital experiences.',
  url: 'https://ramikronbi.com',
  email: 'ramykronby@gmail.com',
  location: 'Lebanon',
  availability: 'Available for select projects',
  socials: {
    github: 'https://github.com/Kronbii',
    linkedin: 'https://www.linkedin.com/in/rami-kronbi/',
  },
} as const

export type SiteConfig = typeof siteConfig
