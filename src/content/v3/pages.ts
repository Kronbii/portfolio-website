/** Labels for the /v3 project index and case pages. */
export const v3Index = {
  meta: {
    title: 'Projects — Rami Kronbi (v3 preview)',
    description:
      'Every project Rami Kronbi has published: robots and drones, computer vision and AI, health, civic, and open-source work, each in one plain sentence.',
  },
  title: 'Projects',
  lede: (n: number) => `${n} projects, sorted by what they are for. Each one in a sentence; the full story is a click away.`,
  all: 'All',
  empty: 'Nothing filed here yet.',
}

export const v3Case = {
  crumbs: { home: 'Home', projects: 'Projects' },
  glance: { part: 'My part', proof: 'Checkable', links: 'See it' },
  short: {
    title: 'The short version',
    what: 'What it is',
    why: 'Why it matters',
    did: 'What I did',
  },
  steps: 'How it works, step by step',
  results: 'Results',
  gallery: 'From the project',
  engineers: {
    title: 'For engineers',
    summary: 'The technical detail: mechanism, limits, and keywords.',
    how: 'Mechanism',
    limits: 'Known limits',
    keywords: 'Keywords',
  },
  evidence: 'Evidence and links',
  story: 'Read the full write-up',
  next: 'Next project',
  back: 'All projects',
}
