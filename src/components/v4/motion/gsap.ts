'use client'

import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { TextPlugin } from 'gsap/TextPlugin'

/*
 * One registration for every motion graphic in /v4, and the house curves: a
 * cut (fast in, hard settle), a slam (overshoot, like the ARMED stamp), and a
 * glide. Every piece of motion on the page uses these, so it reads as one edit.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, ScrollTrigger, SplitText, TextPlugin)
  CustomEase.create('cut', '0.7, 0, 0.1, 1')
  CustomEase.create('slam', 'M0,0 C0.18,0 0.24,1.18 0.42,1.1 0.6,1.02 0.72,1 1,1')
  CustomEase.create('glide', '0.22, 1, 0.36, 1')
}

export { gsap, ScrollTrigger, SplitText }

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
