'use client'

import { useEffect, useRef } from 'react'

import { BAR, E, lerp, prog } from '../armed'
import type { ShotClock } from '../shot'
import { environment, loadAirframe, makeAirframe, spin } from './airframe'
import { reelLights, startGL, yieldFrame } from './host'
import { makeMotes, makeTerrain } from './terrain'

/*
 * GLIDE's 3D layer, from the reel's chaseShot: a chase camera floats behind
 * the E58 as it banks low over the contour field, then cranes up. It flies
 * before the shot rolls and after it holds; the shot's clock only sets where
 * in the move the camera is.
 */

export function Chase({ clock }: { clock: ShotClock }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    return startGL(cv, async (THREE, renderer) => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(46, 1920 / 1080, 0.02, 200)
      reelLights(THREE, scene, renderer)
      scene.environment = await environment(THREE, renderer)
      await yieldFrame()
      const ground = makeTerrain(THREE)
      ground.mesh.position.set(0, -1.75, -22)
      ground.mat.uniforms.uOpacity.value = 1.25
      ground.mat.uniforms.uNear.value = 1.0
      ground.mat.uniforms.uGrid.value = 0.22
      ground.mat.uniforms.uFar.value = 40
      scene.add(ground.mesh)
      const motes = makeMotes(THREE)
      scene.add(motes.points)
      const tpl = await loadAirframe(THREE)
      await yieldFrame()
      const hero = makeAirframe(THREE, tpl)
      hero.scale.setScalar(0.62)
      scene.add(hero)
      const born = performance.now()
      const pos = new THREE.Vector3()
      const look = new THREE.Vector3()

      return {
        warm: { scene, camera },
        frame: (now) => {
          const shot = clock.time()
          // the flight never stops: before the roll it idles in the low pass
          const air = reduce ? 1.2 : (now - born) / 1000
          const l = shot >= 0 ? shot : 0
          const f = air // the flight's own time, for the ground and the blades
          ground.mat.uniforms.uTime.value = 20 + f * 5.5
          ground.mat.uniforms.uShift.value = 2.4 * Math.sin(f * 0.45)
          motes.move(f * 5.5, 0.6, 0.5, -0.2)
          const bank = 0.34 * Math.sin(f * 0.9)
          hero.position.set(
            0.18 * Math.sin(f * 0.45),
            0.12 + 0.05 * Math.sin(f * 2.1),
            0
          )
          hero.rotation.set(
            bank,
            Math.PI / 2 + 0.12 * Math.sin(f * 0.9),
            -0.2,
            'YZX'
          )
          spin(hero, f * 150, 150)
          // the move is the shot's: push in, then crane up over the second bar
          const crane = E.inOut(prog(l, BAR, 2 * BAR))
          const push = shot >= 0 ? E.out(prog(l, 0, 1.2)) : 0
          pos.set(
            0.5 * Math.sin(f * 0.45),
            lerp(0.6, 1.9, crane),
            lerp(4.2, 3.1, push) + 1.6 * crane
          )
          look.set(0.15 * Math.sin(f * 0.45), lerp(-0.02, -0.5, crane), -2.5)
          camera.position.copy(pos)
          camera.up.set(0, 1, 0)
          camera.lookAt(look)
          camera.rotateZ(-0.1 * bank)
          const fov = lerp(46, 52, crane)
          if (camera.fov !== fov) {
            camera.fov = fov
            camera.updateProjectionMatrix()
          }
          renderer.render(scene, camera)
        },
        dispose: () => {
          ground.geo.dispose()
          ground.mat.dispose()
          motes.geo.dispose()
          motes.mat.dispose()
          scene.environment?.dispose()
        },
      }
    })
  }, [clock])

  return (
    <canvas ref={canvas} className="v6-canvas" width={1920} height={1080} />
  )
}
