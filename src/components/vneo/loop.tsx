'use client'

import { ShotModeContext } from '@/components/v6/shot'
import { vneo } from '@/content/vneo/site'

import { RobotsShot } from './robots'
import { SlateMark } from './slate'

/*
 * The closing shot, before the sign-off: sense, decide, act, played calm, as
 * the robot pack (36 Go2s on a circuit board) for the robotics, vision, and
 * embedded work. The drone-swarm cut of the same three bars (v6's FlyShot,
 * which takes Vneo's accent) is in the backlog.
 */

const CALM = { calm: true, speed: 0.75 }

export function Loop() {
  const c = vneo.loop
  return (
    <section id="loop" className="vn-loop" aria-labelledby="loop-h">
      <div className="vn-loop-head">
        <SlateMark no={7} label={c.label} />
        <h2 id="loop-h" className="v7-vh">
          {c.heading}
        </h2>
      </div>
      <div className="vn-loop-frame">
        <ShotModeContext.Provider value={CALM}>
          <RobotsShot replay={c.replay} accent={c.accent} />
        </ShotModeContext.Provider>
      </div>
      <p className="vn-loop-credit">{c.pack.credit}</p>
    </section>
  )
}
