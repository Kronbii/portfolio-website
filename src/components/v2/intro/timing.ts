/** Where the preflight plays, and the session cookie that remembers it was seen. */
export const INTRO_PATH = '/v2'
export const INTRO_COOKIE = 'v2-intro'
/** The E58 (its web build, see home/airframes.ts), fetched from the first paint when the intro will play. */
export const INTRO_MODEL = '/models/eachine-e58-web.glb'
export const INTRO_PRELOAD = [INTRO_MODEL]

/** Phase marks of the preflight, in seconds since the arm switch. Shared by the 3D layer and the overlay. */
export const PREFLIGHT = {
  armedOut: 0.62,
  pull: [0.36, 1.34] as const,
  lift: [0.92, 1.66] as const,
  roll: [1.48, 2.14] as const,
  turn: [2.02, 2.5] as const,
  dive: [2.46, 3.08] as const,
  lock: 2.24,
  iris: [2.88, 3.08] as const,
  name: 3.08,
  /** the name glides onto the page heading while the stage crossfades away behind it */
  handoff: 3.95,
  handoffDur: 1.25,
}

