/**
 * Copy for /v4, "Reel": v3's plain-language record, told in motion. Facts are
 * v3's (verified-current items and ready authority records only); what is new
 * here is what each motion graphic shows and the words that frame it. The
 * explainer's four steps describe how such machines work in general; where
 * they point at Rami's work, the project records support the link.
 */

import { v3Home } from '@/content/v3/home'
import { noteHref, rebase, workHref } from '@/content/v3/work'
import { siteConfig } from '@/lib/site'

export const V4 = '/v4'
const w = (slug: string) => workHref(slug, V4)
const WRO = 'https://www.rhu.edu.lb/media-room/news/rhu-engineering-students-win-big-in-the-world-robotics-olympiad'

export type BeatId = 'drones' | 'vision' | 'control' | 'robots' | 'third' | 'merged'

export const v4Home = {
  meta: {
    title: 'Rami Kronbi — Robotics and embedded-systems engineer (v4 preview)',
    description:
      'Rami Kronbi is a Lebanese robotics and embedded-systems engineer. He builds drones, robots, and the vision systems inside them, explained here in motion.',
  },

  hero: v3Home.hero,
  creds: v3Home.creds.map((c) => ({ ...c, href: rebase(c.href, V4) })),

  reel: {
    label: 'Reel',
    play: 'Play the reel',
    pause: 'Pause the reel',
    jump: (word: string) => `Show ${word}`,
    ariaLabel:
      'A looping motion reel of what Rami Kronbi builds: drones, vision, control, robots, third place at the World Robot Olympiad, and a fix merged into Betaflight.',
    beats: [
      { id: 'drones', word: 'Drones', caption: 'Fixes in the firmware that flies FPV drones', href: w('upstream-open-source-contributions') },
      { id: 'vision', word: 'Vision', caption: 'Cameras that find people, signs, and cars', href: `${V4}#loop` },
      { id: 'control', word: 'Control', caption: 'Loops that keep machines on target', href: w('easypid-arduino-library') },
      { id: 'robots', word: 'Robots', caption: 'A self-driving car, built in twenty days', href: w('brainiacs-autonomous-race-car') },
      { id: 'third', word: '3rd', caption: 'World Robot Olympiad 2023, of 95+ teams', href: WRO },
      { id: 'merged', word: 'Merged', caption: 'Accepted into Betaflight by its maintainers', href: w('upstream-open-source-contributions') },
    ] as { id: BeatId; word: string; caption: string; href: string }[],
  },

  loop: {
    slate: 'How it works',
    title: 'How a machine senses the world and acts on it',
    lede: 'The loop behind the robots and vision systems on this page. Scroll to run it.',
    workLabel: 'In my work',
    steps: [
      {
        id: 'sense',
        title: 'Sense',
        text: 'A camera or sensor turns light into numbers, many times a second.',
        work: [
          { label: 'Thermal super-resolution', href: w('thermal-super-resolution') },
          { label: '360° panorama from a phone', href: w('360-spherical-panorama-stitching') },
        ],
      },
      {
        id: 'perceive',
        title: 'Perceive',
        text: 'Software finds what matters in those numbers: people, signs, obstacles, hands.',
        work: [
          { label: 'OmniSign', href: w('omnisign-lebanese-sign-language') },
          { label: 'Basira', href: w('basira-retinal-screening') },
        ],
      },
      {
        id: 'decide',
        title: 'Decide',
        text: 'A controller weighs what it sees against where it needs to be, and chooses a move.',
        work: [
          { label: 'easyPID', href: w('easypid-arduino-library') },
          { label: 'Smart desk', href: w('posture-aware-classroom-desk') },
        ],
      },
      {
        id: 'act',
        title: 'Act',
        text: 'Motors turn the decision into motion, and the loop starts again.',
        work: [
          { label: 'Brainiacs race car', href: w('brainiacs-autonomous-race-car') },
          { label: 'PID Light Tracker', href: w('pid-light-tracking-robot') },
        ],
      },
    ],
    labels: { person: 'person', sign: 'sign', car: 'car', path: 'planned path', frame: 'camera frame' },
  },

  numbers: {
    slate: 'In numbers',
    title: 'The record, in motion',
    lede: 'Six facts, each with its source. Point at one to play it again.',
    replay: 'Replay',
    items: [
      {
        id: 'wro',
        figure: '3rd',
        unit: 'of 95+ teams',
        text: 'World Robot Olympiad 2023, Future Engineers, with Wassim Ghaddar: a self-driving car built from scratch in 20 days.',
        source: 'Rafik Hariri University',
        href: WRO,
      },
      {
        id: 'award',
        figure: 'Full',
        unit: 'master’s scholarship',
        text: 'The Nazik Rafik Hariri Graduate Studies Award for 2025, on graduating in mechatronics engineering.',
        source: 'Rafik Hariri University',
        href: siteConfig.education.url,
      },
      {
        id: 'imagen',
        figure: '~40',
        unit: 'photos a day, per person',
        text: 'Where a team of three had managed 2–3 a day in all, after a pipeline learned one photographer’s editing style. Figures reported by the client.',
        source: 'Imagen',
        href: w('imagen-raw-to-edit-dataset-pipeline'),
      },
      {
        id: 'merged',
        figure: '3',
        unit: 'fixes merged upstream',
        text: 'One into Betaflight, the firmware that flies FPV drones, and two into the OpenFront browser game.',
        source: 'Pull requests',
        href: w('upstream-open-source-contributions'),
      },
      {
        id: 'fps',
        figure: '~45',
        unit: 'frames a second',
        text: 'Thermal images sharpened by a model small enough to run on an NVIDIA Jetson, beside the camera.',
        source: 'Thermal super-resolution',
        href: w('thermal-super-resolution'),
      },
      {
        id: 'talk',
        figure: 'Talk',
        unit: 'GDG DevFest Tripoli 2025',
        text: '“On-Device Multimodal Assistants: Can We Fit GPT-Vision on Small Hardware?”, with a live demo.',
        source: 'Talks and teaching',
        href: noteHref('talks-workshops-and-teaching'),
      },
    ],
  },

  work: {
    slate: 'Selected work',
    title: 'Six projects, explained in motion',
    lede: (total: number) => `Each in one sentence and a few seconds of animation. ${total} projects in all.`,
    all: 'All projects',
    read: 'Read the story',
    items: [
      { slug: 'brainiacs-autonomous-race-car', shows: 'The camera reads the course; a steering loop weaves the car past the markers.' },
      { slug: 'thermal-super-resolution', shows: 'A low-resolution thermal frame goes in; a sharper one comes out, beside the sensor.' },
      { slug: '360-spherical-panorama-stitching', shows: 'One phone sweep becomes frames; the frames become one panorama.' },
      { slug: 'posture-aware-classroom-desk', shows: 'The camera reads posture; the desk changes its height and tilt.' },
      { slug: 'upstream-open-source-contributions', shows: 'A fix branches off, passes review, and is merged into the project.' },
      { slug: 'imagen-raw-to-edit-dataset-pipeline', shows: 'Bracketed exposures go in; the photographer’s edit comes out. (Illustration; the client’s photos stay private.)' },
    ],
  },

  lightField: {
    ...v3Home.lightField,
    links: v3Home.lightField.links.map((l) => ({ ...l, href: rebase(l.href, V4) })),
  },

  log: {
    ...v3Home.log,
    points: v3Home.log.points.map((p) => ({ ...p, href: rebase(p.href, V4) })),
  },

  notes: v3Home.notes,
  signOff: v3Home.signOff,

  /** The page as a timeline: chapters for the scrubber, in page order. */
  chapters: [
    { id: 'top', label: 'Reel' },
    { id: 'loop', label: 'How it works' },
    { id: 'numbers', label: 'In numbers' },
    { id: 'work', label: 'Work' },
    { id: 'trackers', label: 'Trackers' },
    { id: 'log', label: 'Flight log' },
    { id: 'writing', label: 'Writing' },
    { id: 'contact', label: 'Contact' },
  ],
}

export const v4Nav = [
  { label: 'Work', href: `${V4}#work` },
  { label: 'Numbers', href: `${V4}#numbers` },
  { label: 'Path', href: `${V4}#log` },
  { label: 'Projects', href: `${V4}/projects` },
] as const

export const v4Chrome = {
  preview: 'v4 preview',
  footer: 'This is /v4, a design exploration of ramikronbi.com, told in motion. It is not indexed; the live site stays canonical.',
  timeline: 'Page timeline',
}
