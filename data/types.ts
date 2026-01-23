export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string
  githubUrl: string
  demoUrl?: string
  externalUrl?: string // If provided, opens this URL instead of internal page
  image?: string
  features?: string[]
}

export interface CommunityItem {
  id: string
  type: 'speaking' | 'leadership'
  title: string
  tagline: string
  image: string
  imagePosition?: string
  date?: string
  link?: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  credentialId?: string
  link?: string
}

export interface BlogArticle {
  slug: string
  title: string
  description: string
  content: string // Full article content (HTML or markdown)
  bannerImage?: string
  publishedDate: string
  mediumUrl?: string
  devToUrl?: string
  externalUrl?: string // Custom external link - if provided, opens this URL when article is clicked
  tags?: string[]
}
