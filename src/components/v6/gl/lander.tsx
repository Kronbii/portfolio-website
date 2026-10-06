'use client'

import { useEffect, useRef, type RefObject } from 'react'

import { B, E, lerp, prog } from '../armed'
import type { ShotClock } from '../shot'
import { environment, loadAirframe, makeAirframe, spin } from './airframe'
import { reelLights, startGL, yieldFrame } from './host'

/*
 * LAND's 3D layer, from the reel's heroShot: the E58 arrives over the
 * lockup, hovers, sets down on the pad beside the address with a small
 * flare, and disarms: the rotor rate falls away until the blades are
 * visible. The pad is a DOM element; its centre is projected onto the
 * canvas each frame, so the drone lands on it at any layout.
 */

const FOV = 30
const CAM_Z = 7

export function Lander({
  clock,
  pad,
}: {
  clock: ShotClock
  pad: RefObject<HTMLElement | null>
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    return startGL(
      cv,
      async (THREE, renderer) => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.02, 100)
        camera.position.set(0, 0, CAM_Z)
        camera.lookAt(0, 0, 0)
        reelLights(THREE, scene, renderer)
        scene.environment = await environment(THREE, renderer)
        await yieldFrame()
        const tpl = await loadAirframe(THREE)
        await yieldFrame()
        const hero = makeAirframe(THREE, tpl)
        // visible from the start so it compiles ahead; nothing draws until the section rolls
        scene.add(hero)
        const halfH = CAM_Z * Math.tan((FOV / 2) * (Math.PI / 180))
        let cleared = false

        return {
          warm: { scene, camera },
          frame: (_now, { w, h }) => {
            const l = clock.time()
            const padEl = pad.current
            if (l < 0 || !padEl || !w || !h) {
              if (!cleared) renderer.clear()
              cleared = true
              return
            }
            cleared = false
            const aspect = w / h
            if (camera.aspect !== aspect) {
              camera.aspect = aspect
              camera.updateProjectionMatrix()
            }
            // the pad's centre, in world units on the z = 0 plane
            const cr = cv.getBoundingClientRect()
            const pr = padEl.getBoundingClientRect()
            const nx = ((pr.left + pr.width / 2 - cr.left) / cr.width) * 2 - 1
            const ny = 1 - ((pr.top + pr.height / 2 - cr.top) / cr.height) * 2
            const halfW = halfH * aspect
            const lx = nx * halfW
            const ly = ny * halfH + 0.15
            // the airframe's width tracks the pad's
            const perWorld = cr.height / (2 * halfH)
            hero.scale.setScalar(
              Math.min(0.62, (pr.width * 1.15) / (2.1 * perWorld))
            )

            const hover = 1 - prog(l, 4 * B, 5 * B)
            const arrive = E.out(prog(l, 0, 0.5))
            const down = E.inOut(prog(l, 4 * B, 5 * B + 0.2))
            const flare = Math.sin(Math.PI * prog(l, 4 * B + 0.3, 5 * B + 0.25))
            const hx = lerp(lx + 1.36, lx - 0.22, arrive)
            const hy =
              lerp(ly + 3.19, ly + 2.01, arrive) +
              0.04 * Math.sin(l * 3.1) * hover
            hero.visible = true
            hero.position.set(lerp(hx, lx, down), lerp(hy, ly, down), 0)
            hero.rotation.set(
              0.05 * Math.sin(l * 2.3) * hover - 0.25 * (1 - arrive),
              lerp(-0.95, -0.62, down) + 0.06 * Math.sin(l * 1.7) * hover,
              0.12 * hover + 0.16 * flare,
              'YZX'
            )
            // disarm on beat 6: the rate falls away and the blades come back into view
            const T0 = 6 * B
            const off = prog(l, T0, T0 + 0.75)
            const rate = 150 * (1 - E.out(off))
            let ang = Math.min(l, T0) * 150
            for (let s = T0; s < Math.min(l, T0 + 0.8); s += 1 / 480)
              ang += (150 * (1 - E.out(prog(s, T0, T0 + 0.75)))) / 480
            spin(hero, ang, rate)
            renderer.render(scene, camera)
          },
          dispose: () => {
            hero.userData.blurMat.dispose()
            scene.environment?.dispose()
          },
        }
      },
      { margin: '20% 0px' }
    )
  }, [clock, pad])

  return <canvas ref={canvas} aria-hidden="true" />
}
