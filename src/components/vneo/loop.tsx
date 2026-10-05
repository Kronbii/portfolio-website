'use client'

import { useState } from 'react'

import { FlyShot } from '@/components/v6/scenes/fly'
import { ShotModeContext } from '@/components/v6/shot'
import { vneo } from '@/content/vneo/site'

import { BoardShot } from './board'
import { SlateMark } from './slate'

/*
 * The closing shot, before the sign-off: sense, decide, act, played calm.
 * Two cuts of it: v6's drone swarm spelling RK., and the systems board, the
 * same three bars for the robotics, vision, and embedded work. Both are here
 * until Rami picks the one to keep.
 */

const CALM = { calm: true, speed: 0.75 }
type Pick = (typeof vneo.loop.options)[number]['id']

export function Loop() {
  const c = vneo.loop
  const [pick, setPick] = useState<Pick>('drones')
  return (
    <section id="loop" className="vn-loop" aria-labelledby="loop-h">
      <div className="vn-loop-head">
        <SlateMark no={7} label={c.label} />
        <h2 id="loop-h" className="v7-vh">
          {c.heading}
        </h2>
        <div className="vn-pick" role="group" aria-label={c.pick}>
          <span className="vn-pick-k" aria-hidden="true">
            {c.pick}
          </span>
          {c.options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={pick === o.id}
              onClick={() => setPick(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="vn-loop-frame">
        <ShotModeContext.Provider value={CALM}>
          {pick === 'drones' ? (
            <FlyShot key="drones" replay={c.replay} accent={c.accent} />
          ) : (
            <BoardShot key="board" replay={c.replay} />
          )}
        </ShotModeContext.Provider>
      </div>
    </section>
  )
}
