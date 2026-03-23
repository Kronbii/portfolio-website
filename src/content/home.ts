import { type HomeContent } from '@/content/schema'

export const homeContent: HomeContent = {
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Selected Work', href: '#selected-work' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'Home',
    title: 'Building a cleaner portfolio system before the redesign begins.',
    subtitle:
      'A new baseline for motion-heavy storytelling, shadcn-ready UI, and scalable project detail pages.',
    description:
      'This reset turns the site into a maintainable content-driven codebase with strong tokens, strict import boundaries, and room for future case-study pages.',
    primaryCta: {
      label: 'Explore selected work',
      href: '#selected-work',
    },
    secondaryCta: {
      label: 'Get in touch',
      href: '#contact',
    },
    image: {
      src: '/images/home/portrait.jpeg',
      alt: 'Portrait of Rami Kronbi',
    },
    metrics: [
      { value: '01', label: 'Active domain in the rebuild: home' },
      { value: '02', label: 'Future-ready routes: /projects/[slug]' },
      { value: '03', label: 'Design system first: tokens + wrappers' },
    ],
  },
  capabilities: {
    eyebrow: 'System Design',
    title: 'A structure built for speed now and consistency later.',
    description:
      'The new repo separates primitives, blocks, sections, content, motion, and metadata so redesign work stays fast without letting the codebase collapse.',
    items: [
      {
        title: 'Token-first styling',
        description:
          'Tailwind utilities are backed by CSS variables for color, spacing, radius, shadows, and motion timing.',
      },
      {
        title: 'Wrapped UI dependencies',
        description:
          'shadcn and future third-party components enter through local wrappers instead of leaking vendor APIs into the app.',
      },
      {
        title: 'Typed content model',
        description:
          'Homepage copy and project summaries live outside JSX, making redesign and future project routing easier.',
      },
    ],
  },
  projects: {
    eyebrow: 'Project Content',
    title: 'Project summaries are already typed and ready for dedicated pages.',
    description:
      'The route is intentionally deferred, but the data model is prepared now so case-study pages can be added without refactoring the content layer again.',
    spotlightSlugs: [
      'thermal-super-resolution',
      'omnisign',
      'autonomous-race-car',
    ],
  },
}
