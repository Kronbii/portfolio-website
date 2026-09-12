'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Full-bleed video ground.
 *
 * The clip is atmosphere, never the subject: it is graded hard into the
 * graphite palette so type and the 3D machine stay the brightest things on
 * screen. Two modes:
 *
 *   loop  — autoplays muted and loops. Cheap, always smooth.
 *   scrub — scroll position drives currentTime. The clip only advances when
 *           the reader does. Needs a keyframe-dense encode to seek smoothly.
 *
 * The poster paints immediately and the video file is only fetched once the
 * section is near the viewport, so a page of these does not cost six downloads
 * up front. Honors prefers-reduced-motion by holding on the poster frame.
 */

export type VideoMode = 'loop' | 'scrub'

export interface VideoStageProps {
  /** basename in /public/videos, without extension */
  src: string
  mode?: VideoMode
  /** 0..1 — how far the graphite veil is pulled over the footage */
  veil?: number
  /** extra darkening at the bottom so overlaid type always has a ground */
  gradient?: boolean
  className?: string
  children?: ReactNode
  /** element whose scroll progress drives scrub mode; defaults to this stage */
  scrollTargetId?: string
  /** slower than 1 reads as more deliberate */
  rate?: number
}

export function VideoStage({
  src,
  mode = 'loop',
  veil = 0.72,
  gradient = true,
  className,
  children,
  scrollTargetId,
  rate = 0.7,
}: VideoStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [load, setLoad] = useState(false)

  // only fetch the clip when the section is close
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const host = hostRef.current
    if (!video || !load) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      video.pause()
      return
    }

    video.playbackRate = rate

    if (mode === 'loop') {
      // pause while off-screen: decoding a video nobody can see is pure cost
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) void video.play().catch(() => {})
          else video.pause()
        },
        { threshold: 0.01 }
      )
      io.observe(host as Element)
      return () => io.disconnect()
    }

    // scrub: scroll is the transport
    video.pause()
    const target = scrollTargetId ? document.getElementById(scrollTargetId) : host
    let raf = 0
    let want = 0

    const measure = () => {
      if (!target) return
      const rect = target.getBoundingClientRect()
      const span = rect.height + window.innerHeight || 1
      const p = Math.min(Math.max((window.innerHeight - rect.top) / span, 0), 1)
      const dur = video.duration
      if (Number.isFinite(dur) && dur > 0) want = p * dur
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!Number.isFinite(video.duration)) return
      // ease toward the target so a fast flick does not stutter the decoder
      const next = video.currentTime + (want - video.currentTime) * 0.12
      if (Math.abs(next - video.currentTime) > 0.002) video.currentTime = next
    }

    const onScroll = () => measure()
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [load, mode, rate, scrollTargetId])

  return (
    <div ref={hostRef} className={cn('relative overflow-hidden bg-[var(--ground)]', className)}>
      {/* poster paints instantly; the clip fades in over it once decoded */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/videos/${src}.jpg)` }}
      />

      {load ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={`/videos/${src}.mp4`}
          poster={`/videos/${src}.jpg`}
          muted
          loop={mode === 'loop'}
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />
      ) : null}

      {/* the grade: pull the daylight footage down onto the graphite ground */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `var(--ground)`,
          opacity: veil,
          mixBlendMode: 'normal',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(14,16,20,0.55) 0%, rgba(14,16,20,0) 32%)',
        }}
      />
      {gradient ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, var(--ground) 2%, rgba(14,16,20,0.82) 26%, rgba(14,16,20,0.1) 70%)',
          }}
        />
      ) : null}

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

export default VideoStage
