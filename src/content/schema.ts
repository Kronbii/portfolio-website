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
  }
  capabilities: SectionIntro & {
    items: Capability[]
  }
  projects: SectionIntro & {
    spotlightSlugs: string[]
  }
}
