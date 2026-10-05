/**
 * Vneo: the site the versions were for. Its words are the ones Rami already
 * kept: v7's chapters (the work by who it serves), v3's plain-language layer
 * and flight log, v2's tracker field and sign-off, and v6's reel scenes for
 * the engineering underneath. Every fact comes from a ready record or a
 * ready article; nothing marked [VERIFY] is used.
 */

import { getArticle } from '@/content/authority'
import { v2Home } from '@/content/v2/home'
import { v3Home } from '@/content/v3/home'
import {
  noteHref,
  rebase,
  workBySlug,
  workHref,
  works,
} from '@/content/v3/work'
import { shotAlt } from '@/content/v6/reel'
import { buildChapters, buildGroups, type Chapter } from '@/content/v7/home'
import { siteConfig } from '@/lib/site'

export const VN = '/vneo'

export const chapters: Chapter[] = buildChapters(VN)
export const groups = buildGroups(VN)
/** "More of the work": the groups, minus what the page already shows. */
export const moreGroups = () =>
  groups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => !shownAbove.has(it.href.split('/').pop()!)),
    }))
    .filter((g) => g.items.length)
export const chapterOf = (slug: string) =>
  chapters.find((c) => c.link.href === workHref(slug, VN))

/** The reel: the engineering underneath, one shot at a time. */
export const reel = (
  [
    {
      id: 'see',
      tab: 'See',
      slug: 'brainiacs-autonomous-race-car',
      line: 'A car that reads the course and steers itself: the camera’s view, its edges, its strongest corners, and the lock.',
    },
    {
      id: 'map',
      tab: 'Map',
      slug: '360-spherical-panorama-stitching',
      line: 'One handheld phone sweep, 309 frames, stitched into a sphere you can walk around.',
    },
    {
      id: 'heat',
      tab: 'Heat',
      slug: 'thermal-super-resolution',
      line: 'A low-resolution thermal image, upscaled three times by a model small enough to run beside the sensor.',
    },
    {
      id: 'tune',
      tab: 'Tune',
      slug: 'easypid-arduino-library',
      line: 'The feedback loop that keeps a motor on target, as a library anyone can install.',
    },
    {
      id: 'trace',
      tab: 'Trace',
      slug: 'fine-crack-tracing-toolkit',
      line: 'A crack already found in an image, turned into an ordered path you can measure.',
    },
    {
      id: 'ship',
      tab: 'Ship',
      slug: 'upstream-open-source-contributions',
      line: 'Fixes sent to the open-source projects themselves: three merged by their maintainers.',
    },
  ] as const
).map((r) => {
  const w = workBySlug(r.slug)!
  return {
    ...r,
    title: w.project.title.split(' — ')[0],
    href: workHref(r.slug, VN),
    alt: shotAlt[r.id],
  }
})
export type ReelId = (typeof reel)[number]['id']

/** Work: four told in motion (the sticky player), then the rest at a glance (the bento). */
type Motion =
  | { kind: 'shot'; id: ReelId }
  | { kind: 'scene'; id: Chapter['id'] }
const workItem = (slug: string, motion: Motion | undefined, shows: string) => {
  const w = workBySlug(slug)!
  return {
    slug,
    title: w.project.title.split(' — ')[0],
    kind: w.plain.kind,
    line: w.plain.line,
    proof: w.plain.proof,
    part: w.plain.part,
    href: workHref(slug, VN),
    motion,
    shows,
    alt:
      motion?.kind === 'shot'
        ? shotAlt[motion.id]
        : (chapters.find((c) => c.id === motion?.id)?.alt ?? w.plain.line),
  }
}
export type WorkItem = ReturnType<typeof workItem>

export const featured: WorkItem[] = [
  workItem(
    'brainiacs-autonomous-race-car',
    { kind: 'shot', id: 'see' },
    'The car’s camera view, its edges, its strongest corners, and the lock.'
  ),
  workItem(
    'daleel-lebanese-election-information',
    { kind: 'scene', id: 'voters' },
    'A fact, traced back to its source, with its history kept.'
  ),
  workItem(
    'thermal-super-resolution',
    { kind: 'shot', id: 'heat' },
    'The low-resolution thermal input, swept by its ×3 output.'
  ),
  workItem(
    '360-spherical-panorama-stitching',
    { kind: 'shot', id: 'map' },
    '309 frames from one phone sweep, closing into one sphere.'
  ),
]

export type TileSize = 'wide' | 'tall' | 'one'
export const bento: (WorkItem & {
  size: TileSize
  image?: { src: string; position?: string; fit?: 'contain' }
  figure?: { from: string; fromNote: string; to: string; toNote: string }
})[] = [
  {
    ...workItem(
      'upstream-open-source-contributions',
      { kind: 'shot', id: 'ship' },
      ''
    ),
    size: 'wide',
  },
  {
    ...workItem('easypid-arduino-library', { kind: 'shot', id: 'tune' }, ''),
    size: 'one',
  },
  {
    ...workItem(
      'fine-crack-tracing-toolkit',
      { kind: 'shot', id: 'trace' },
      ''
    ),
    size: 'tall',
  },
  {
    ...workItem('imagen-raw-to-edit-dataset-pipeline', undefined, ''),
    size: 'one',
    figure: {
      from: '2–3',
      fromNote: 'a day, team of three',
      to: '~40',
      toNote: 'a day, per person',
    },
  },
  {
    ...workItem('lebanese-motorcycle-theory-trainer', undefined, ''),
    size: 'one',
    image: {
      src: '/images/authority/motorcycle-trainer/sign-127.webp',
      fit: 'contain',
    },
  },
  {
    ...workItem('ree-personal-finance-tracker', undefined, ''),
    size: 'one',
    image: {
      src: '/images/authority/ree-finance/image1.jpeg',
      position: '50% 30%',
    },
  },
]

/** In the community: the work built for people, and the rooms where it is shared. */
const scene = (id: Chapter['id']) => chapters.find((c) => c.id === id)!
export const community = {
  label: 'In the community',
  title: 'Built for people, and shared in person.',
  hot: 'people',
  lede: 'Software for families in a crisis, clinics, and people who sign; a desk for students; and the talks and workshops where I teach what I know.',
  built: [
    { ...scene('families'), size: 'big' as const },
    { ...scene('clinics'), size: 'one' as const },
    { ...scene('signers'), size: 'one' as const },
    { ...scene('students'), size: 'one' as const },
  ],
  talk: {
    label: 'Speaker',
    event: 'GDG DevFest Tripoli 2025',
    when: '20 December 2025',
    title:
      'On-Device Multimodal Assistants: Can We Fit GPT-Vision on Small Hardware?',
    note: 'Quantization, memory budgets, and hardware acceleration, ending with a live demo.',
    demo: 'Live demo',
    href: noteHref('talks-workshops-and-teaching'),
  },
  workshops: {
    label: 'Workshops',
    title: 'Git & GitHub, hands on',
    items: [
      'CodewithSerah bootcamp · January 2026',
      'LAU Byblos Software Engineering Club · April 2026',
    ],
    href: noteHref('talks-workshops-and-teaching'),
  },
  mentoring: {
    label: 'Mentoring',
    title: 'NASA Space Apps, Beirut',
    years: ['2021', '2022', '2023', '2024'],
    note: 'Lead technical organizer, per my CV: bootcamps on NASA data, problem selection, and prototyping for its teams.',
    href: noteHref('what-four-years-of-technical-mentoring-taught-me'),
  },
  read: 'Read more',
}

/** Already shown above, so "More of the work" lists only the rest. */
export const shownAbove = new Set([
  ...featured.map((f) => f.slug),
  ...bento.map((b) => b.slug),
  'basira-retinal-screening',
  'omnisign-lebanese-sign-language',
  'posture-aware-classroom-desk',
])

const note = (slug: string) => {
  const a = getArticle(slug)
  return a && a.state === 'ready'
    ? { title: a.title, dek: a.dek, href: noteHref(a.slug) }
    : undefined
}

export const vneo = {
  meta: {
    title: 'Rami Kronbi — Robotics, embedded, and systems engineer',
    description:
      'Rami Kronbi is a robotics, embedded, and systems engineer in Beirut who builds for people: election information for voters, crisis coordination for displaced families, second readings for clinics, and robots that steer themselves.',
  },
  hero: {
    id: 'ID lock · engineer',
    first: 'Rami',
    last: 'Kronbi',
    sub: 'Robotics, embedded & systems engineer',
    line: 'I build for people: voters, clinics, students, people who sign, and families in a crisis.',
    where: siteConfig.location.replace(', ', ' · '),
    now: v3Home.hero.now,
    chips: [
      { label: 'Work', href: '#work' },
      { label: 'Community', href: '#community' },
      { label: 'Contact', href: '#sign-off' },
    ],
  },
  glance: v3Home.creds.map((c) => ({ ...c, href: rebase(c.href, VN) })),
  work: {
    no: 2,
    label: 'Selected work',
    title: 'Work you can watch work.',
    hot: 'watch',
    lede: 'Four pieces in motion, then the rest at a glance. Every one says what it does, my part, and the fact to check.',
    all: 'All projects',
    open: 'Open the project',
    playing: 'Now showing',
  },

  notes: {
    label: 'Writing',
    title: 'How the work was done.',
    hot: 'done',
    lede: v3Home.notes.lede,
    items: [
      'designing-election-information-for-verifiability',
      'building-technology-around-crisis-response-operations',
      'building-an-autonomous-race-car-in-twenty-days',
    ]
      .map(note)
      .filter((n): n is NonNullable<typeof n> => !!n),
    all: { label: 'All writing', href: '/writing' },
  },
  more: {
    label: 'More of the work',
    title: 'And the rest, by who it serves.',
    hot: 'serves',
    all: 'Every project',
  },
  signOff: v2Home.signOff,
}

export const vneoChrome = {
  brand: 'Rami Kronbi',
  skip: 'Skip to content',
  nav: [
    { label: 'Work', href: `${VN}#work` },
    { label: 'Community', href: `${VN}#community` },
    { label: 'Projects', href: `${VN}/projects` },
    { label: 'Contact', href: `${VN}#sign-off` },
  ],
  footer: {
    note: 'This is /vneo, the candidate for ramikronbi.com. It is not indexed yet; the live site stays canonical until it is promoted.',
    live: 'Open the live site',
    copyright: `© 2026 ${siteConfig.name} · ${siteConfig.location}`,
  },
}

export { works, workHref }
