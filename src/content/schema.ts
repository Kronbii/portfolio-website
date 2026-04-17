export interface NavItem {
  label: string
  href: string
}

export interface SectionIntro {
  eyebrow: string
  title: string
  description: string
}

export interface HeroMetric {
  label: string
  value: string
}

export interface Capability {
  title: string
  description: string
}

export interface CommunityItem {
  id: string
  title: string
  tagline: string
  date: string
  link?: string
  image: ProjectMedia
  points?: string[]
}

export interface ContactChannel {
  label: string
  sublabel: string
  href: string
}

export interface AboutContent {
  titleLeading: string
  titleAccent: string
  intro: string
  paragraphs: string[]
  image: ProjectMedia
  stats: HeroMetric[]
}

export interface ProjectMedia {
  src: string
  alt: string
}

export interface Project {
  slug: string
  title: string
  summary: string
  description: string
  problem: string
  solution: string
  myRole: string
  outcome: string
  githubUrl: string
  demoUrl?: string
  externalUrl?: string
  media: ProjectMedia
  technologies: string[]
  features: string[]
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  period: string
  location?: string
  description: string
  technologies: string[]
}

export interface HomeContent {
  navigation: NavItem[]
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    description: string
    primaryCta: {
      label: string
      href: string
    }
    secondaryCta: {
      label: string
      href: string
    }
    image: ProjectMedia
    metrics: HeroMetric[]
    location: string
    specialty: string
    role: string
    name: string
    mission: string
  }
  about: AboutContent
  capabilities: SectionIntro & {
    items: Capability[]
  }
  projects: SectionIntro & {
    spotlightSlugs: string[]
  }
  experience: SectionIntro & {
    items: ExperienceEntry[]
  }
  community: SectionIntro & {
    items: CommunityItem[]
  }
  contact: SectionIntro & {
    channels: ContactChannel[]
    note: string
    responseTime: string
  }
}
