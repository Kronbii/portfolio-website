export const motionTokens = {
  duration: {
    fast: 0.28,
    base: 0.5,
    slow: 0.8,
  },
  ease: [0.22, 1, 0.36, 1] as const,
}

export const pageEnter = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: motionTokens.duration.slow,
    ease: motionTokens.ease,
  },
}

export const revealUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: {
    duration: motionTokens.duration.base,
    ease: motionTokens.ease,
  },
}

export const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true, amount: 0.2 },
  transition: {
    staggerChildren: 0.1,
  },
}

export const hoverLift = {
  whileHover: {
    y: -4,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease,
    },
  },
}
