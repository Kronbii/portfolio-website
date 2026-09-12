'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { BEHAVIORS, type DroneVariant } from './behaviors'
import { buildDrone, DRONE_COLORS, type DroneParts } from './geometry'

/**
 * DroneStage — raw three.js renderer for the archived drone system.
 *
 * Deliberately NOT react-three-fiber. This repo runs React 18 with
 * @react-three/fiber v9 installed, which is the combination the handoff
 * documents as fatal: R3F's reconciler reads ReactCurrentBatchConfig, Next's
 * vendored React does not expose it, and every <Canvas> throws. drei is not
 * installed either. Raw three.js has none of those problems on React 18.
 *
 * `geometry.ts` and `behaviors.ts` are restored from the drone-system-v1 tag
 * unmodified — both import only `three`, so the procedural drone and all ten
 * of its behaviours run here untouched.
 *
 * One WebGL context per instance. Contexts cap around 16 per page, so the
 * gallery uses a single stage with a switcher rather than a grid of canvases.
 */

export type DroneSource = 'procedural' | string

export interface DroneStageProps {
  /** 'procedural' builds from geometry.ts; anything else is a .glb path. */
  source?: DroneSource
  variant?: DroneVariant
  wireframe?: boolean
  /** Drag to rotate. Disables the behaviour's own camera moves. */
  draggable?: boolean
  tint?: number
  /** Keep the model's own PBR materials instead of flat-tinting it. The
   *  Sketchfab models ship with real texture sets; retinting throws them away
   *  and is what made the low-poly one look like plastic. */
  keepMaterials?: boolean
  className?: string
}

export function DroneStage({
  source = 'procedural',
  variant = 'orbit',
  wireframe = false,
  draggable = false,
  tint = DRONE_COLORS.body,
  keepMaterials = false,
  className,
}: DroneStageProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)
    camera.position.set(0, 1.6, 6)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return // no WebGL — leave the poster/fallback in place
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x0a0c10, 1.1))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(4, 6, 3)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff6a5a, 1.1)
    rim.position.set(-5, 2, -4)
    scene.add(rim)

    // The behaviours mutate named part handles, so a GLB still needs a
    // DroneParts-shaped object. Only `group` is animated for loaded models.
    let parts: DroneParts | null = null
    const flight: DroneParts[] = []
    let disposed = false

    const mount = (built: DroneParts) => {
      if (disposed) {
        built.dispose()
        return
      }
      parts = built
      scene.add(built.group)
    }

    if (source === 'procedural') {
      mount(buildDrone({ wireframe }))
      if (variant === 'swarm') {
        for (let i = 0; i < 4; i += 1) {
          const extra = buildDrone({ lowPoly: true, wireframe })
          flight.push(extra)
          scene.add(extra.group)
        }
      }
    } else {
      const loader = new GLTFLoader()
      // The Sketchfab models are Draco-compressed: 172k faces in 756KB rather
      // than ~6MB. The decoder is served from /public/draco.
      const draco = new DRACOLoader()
      draco.setDecoderPath('/draco/')
      loader.setDRACOLoader(draco)
      loader.load(
        source,
        (gltf) => {
          const group = new THREE.Group()
          group.add(gltf.scene)

          // Poly Pizza models ship as light grey plastic at arbitrary scale.
          // Normalise to roughly the procedural drone's footprint and retint.
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const size = new THREE.Vector3()
          const centre = new THREE.Vector3()
          box.getSize(size)
          box.getCenter(centre)
          const span = Math.max(size.x, size.y, size.z) || 1
          gltf.scene.scale.setScalar(2.6 / span)
          gltf.scene.position.sub(centre.multiplyScalar(2.6 / span))

          if (!keepMaterials || wireframe) {
            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: tint,
                  metalness: 0.35,
                  roughness: 0.55,
                  wireframe,
                })
              }
            })
          }

          mount({
            group,
            rotors: [],
            booms: [],
            navLights: [],
            materials: {},
            dispose: () => {},
          } as unknown as DroneParts)
        },
        undefined,
        () => {}
      )
      // Draco holds a worker pool; release it with the scene.
      queueMicrotask(() => draco.dispose())
    }

    // Drag to rotate
    let dragging = false
    let lastX = 0
    let lastY = 0
    let yaw = 0
    let pitch = 0
    const onDown = (e: PointerEvent) => {
      if (!draggable) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      renderer.domElement.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      yaw += (e.clientX - lastX) * 0.008
      pitch = THREE.MathUtils.clamp(pitch + (e.clientY - lastY) * 0.006, -0.9, 0.9)
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = () => {
      dragging = false
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const behave = BEHAVIORS[variant]
    const clock = new THREE.Clock()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.getElapsedTime()
      if (!parts) {
        renderer.render(scene, camera)
        return
      }

      if (draggable) {
        parts.group.rotation.y = yaw
        parts.group.rotation.x = pitch
        parts.group.position.set(0, 0, 0)
        for (const rotor of parts.rotors) rotor.rotation.y += dt * 26
        camera.position.set(0, 1.4, 6)
        camera.lookAt(0, 0, 0)
      } else {
        // Loop progress, so scroll-driven behaviours still demo standalone.
        const p = (t % 8) / 8
        behave({ t, dt, p, camera, parts, flight, reduced })
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      parts?.dispose()
      for (const extra of flight) extra.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [source, variant, wireframe, draggable, tint, keepMaterials])

  return <div ref={hostRef} className={className} />
}
