'use client'

import { HeatShot } from '@/components/v6/scenes/heat'
import { MapShot } from '@/components/v6/scenes/map'
import { SeeShot } from '@/components/v6/scenes/see'
import { refinedSee } from '@/content/vneo/see-refined'
import { ShipShot } from '@/components/v6/scenes/ship'
import { TraceShot } from '@/components/v6/scenes/trace'
import { TuneShot } from '@/components/v6/scenes/tune'
import { ShotModeContext } from '@/components/v6/shot'
import type { ReelId } from '@/content/vneo/site'

/** A project's reel shot, played calm, as its page's first picture. */
const SCENES: Record<
  ReelId,
  (p: { label: string; replay?: string }) => React.ReactNode
> = {
  see: (p) => <SeeShot {...p} plate={refinedSee} />,
  map: MapShot,
  heat: HeatShot,
  tune: TuneShot,
  trace: TraceShot,
  ship: ShipShot,
}
const CALM = { calm: true, speed: 0.75 }

export function CaseShot({ id, label }: { id: ReelId; label: string }) {
  const Scene = SCENES[id]
  return (
    <div className="vn-reel vn-case-reel">
      <ShotModeContext.Provider value={CALM}>
        <Scene label={label} />
      </ShotModeContext.Provider>
    </div>
  )
}
