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
  glance: v3Home.creds.map((c) => ({ ...c, href: rebase(c.href, VN) })),
  reel: {
    label: 'Under the hood',
    title: 'The engineering, in motion.',
    hot: 'motion',
    lede: 'Six pieces of the work, the way the flight reel cuts them. Each plays, holds, and hands over to the next; pick any to see it again.',
    open: 'Open the project',
    pause: 'Pause',
    play: 'Play',
  },
  tracker: {
    ...v2Home.lightField,
    label: 'A small experiment',
    links: [
      {
        label: 'PID Light Tracker',
        href: workHref('pid-light-tracking-robot', VN),
      },
      { label: 'easyPID', href: workHref('easypid-arduino-library', VN) },
      {
        label: 'What a two-axis light tracker teaches',
        href: noteHref(
          'what-a-two-axis-light-tracker-teaches-about-pid-control'
        ),
      },
    ],
  },
  path: {
    label: 'The path',
    title: 'The path so far, one waypoint at a time.',
    hot: 'waypoint',
    points: v3Home.log.points.map((p) => ({ ...p, href: rebase(p.href, VN) })),
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
    title: 'Everything else, by who it serves.',
    hot: 'serves',
    all: 'Every project',
  },
  signOff: v2Home.signOff,
}

export const vneoChrome = {
  brand: 'Rami Kronbi',
  skip: 'Skip to content',
  nav: [
    { label: 'Work', href: `${VN}#voters` },
    { label: 'Under the hood', href: `${VN}#reel` },
    { label: 'Projects', href: `${VN}/projects` },
    { label: 'Contact', href: `${VN}#sign-off` },
  ],
  /** The chapter rail: where you are on the page. */
  rail: [
    { id: 'top', label: 'Rami Kronbi' },
    { id: 'voters', label: 'For voters' },
    { id: 'families', label: 'For families in a crisis' },
    { id: 'clinics', label: 'For clinics' },
    { id: 'signers', label: 'For people who sign' },
    { id: 'students', label: 'For students' },
    { id: 'machines', label: 'Machines that move' },
    { id: 'reel', label: 'Under the hood' },
    { id: 'tracker', label: 'A small experiment' },
    { id: 'path', label: 'The path' },
    { id: 'more', label: 'More of the work' },
    { id: 'sign-off', label: 'Contact' },
  ],
  footer: {
    note: 'This is /vneo, the candidate for ramikronbi.com. It is not indexed yet; the live site stays canonical until it is promoted.',
    live: 'Open the live site',
    copyright: `© 2026 ${siteConfig.name} · ${siteConfig.location}`,
  },
}

export { works, workHref }
