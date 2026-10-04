'use client'

import { useEffect, useRef, useState } from 'react'

import { v3Home } from '@/content/v3/home'
import { paletteById } from '@/content/v3/palettes'

import styles from './thermal-drone.module.css'

/*
 * The drone from the intro, seen through a thermal camera. Heat is a model,
 * not a measurement: the four motors run hottest, the battery bay is warm, the
 * shell is cool, and the lenses read cold. Each pixel's heat goes through the
 * page's camera palette (ironbow, green hot, arctic…). The airframe tracks your cursor with the same PD law as the
 * arrows further down (θ'' = Kp·e − Kd·θ'), banks into its turns, and a
 * detector box follows its silhouette. WebGL waits until the intro has
 * handed over, so the two never compete for a frame.
 */


const VERT = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vLocal = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uRamp;
  uniform vec3 uHubs[4];
  uniform vec3 uCore;
  uniform float uBase;
  uniform float uMotor;
  uniform float uTime;
  varying vec3 vLocal;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float h = uBase;
    for (int i = 0; i < 4; i++) {
      float d = distance(vLocal, uHubs[i]);
      h += uMotor * exp(-d * d / (0.0108 * 0.0108));
    }
    float dc = distance(vLocal * vec3(1.0, 1.6, 1.0), uCore * vec3(1.0, 1.6, 1.0));
    h += 0.26 * exp(-dc * dc / (0.03 * 0.03));
    vec3 n = normalize(vN);
    vec3 v = normalize(vView);
    float ndv = clamp(dot(n, v), 0.0, 1.0);
    h *= mix(0.62, 1.0, ndv);
    h += (1.0 - ndv) * 0.05;
    h += 0.018 * sin(uTime * 2.1 + vLocal.x * 260.0 + vLocal.z * 170.0);
    gl_FragColor = vec4(texture2D(uRamp, vec2(clamp(h, 0.0, 1.0), 0.5)).rgb, 1.0);
  }
`

type Phase = 'wait' | 'loading' | 'live' | 'still' | 'failed'

export function ThermalDrone() {
  const copy = v3Home.thermal
  const panel = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const det = useRef<HTMLDivElement>(null)
  const stateRef = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState<Phase>('wait')
  const [clear, setClear] = useState(false)
  const [mode, setMode] = useState<string>(copy.mode)

  // the camera palette follows the page's colour option
  useEffect(() => {
    const root = panel.current?.closest<HTMLElement>('[data-v3]')
    const read = () => setMode(paletteById(root?.dataset.palette).camera)
    read()
    window.addEventListener('v3-palette', read)
    return () => window.removeEventListener('v3-palette', read)
  }, [])

  // wait for the intro to hand over before building anything on the GPU
  useEffect(() => {
    const root = panel.current?.closest<HTMLElement>('[data-v3]')
    if (!root) return
    const busy = () => ['on', 'playing', 'reveal'].includes(root.dataset.intro ?? '')
    if (!busy()) {
      setClear(true)
      return
    }
    const mo = new MutationObserver(() => {
      if (busy()) return
      setClear(true)
      mo.disconnect()
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] })
    return () => mo.disconnect()
  }, [])

  // your heat: a warm bloom on the cold ground, wherever the pointer is over the feed
  useEffect(() => {
    const el = panel.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--hx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      el.style.setProperty('--hy', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!clear) return
    const host = panel.current
    const cv = canvas.current
    const box = det.current
    if (!host || !cv || !box) return
    let disposed = false
    let cleanup = () => {}
    setPhase('loading')

    ;(async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js')
      const { HUBS, splitProps } = await import('@/components/v2/intro/preflight-scene')
      const { E58_URL } = await import('@/components/v2/home/airframes')
      if (disposed) return

      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch {
        setPhase('failed')
        return
      }
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 50)
      camera.position.set(0, 1.15, 7.1)
      camera.lookAt(0, 0, 0)

      // the page's camera palette as a 256-texel lookup, white-hot at the top
      const n = 256
      const data = new Uint8Array(n * 4)
      const ramp = new THREE.DataTexture(data, n, 1, THREE.RGBAFormat)
      ramp.magFilter = THREE.LinearFilter
      ramp.minFilter = THREE.LinearFilter
      const paletteNow = () => paletteById(host.closest<HTMLElement>('[data-v3]')?.dataset.palette)
      const fillRamp = (hexes: string[]) => {
        const stops = [...hexes, '#fffcf4'].map((hex) => new THREE.Color(hex))
        for (let i = 0; i < n; i++) {
          const x = (i / (n - 1)) * (stops.length - 1)
          const a = Math.floor(x)
          const b = Math.min(stops.length - 1, a + 1)
          const c = stops[a].clone().lerp(stops[b], x - a)
          data.set([c.r * 255, c.g * 255, c.b * 255, 255], i * 4)
        }
        ramp.needsUpdate = true
      }
      fillRamp(paletteNow().ramp)

      const thermal = (base: number, motor: number, core: InstanceType<typeof THREE.Vector3>) =>
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms: {
            uRamp: { value: ramp },
            uHubs: { value: HUBS.map(([x, y, z]) => new THREE.Vector3(x, y, z)) },
            uCore: { value: core },
            uBase: { value: base },
            uMotor: { value: motor },
            uTime: { value: 0 },
          },
        })

      // warm air over each rotor: a faint disc with two ghost blades, in the ramp's colours
      const discCanvas = document.createElement('canvas')
      discCanvas.width = discCanvas.height = 256
      const disc = new THREE.CanvasTexture(discCanvas)
      disc.colorSpace = THREE.NoColorSpace
      const drawDisc = (hexes: string[]) => {
        const rgb = (hex: string) => {
          const v = parseInt(hex.slice(1), 16)
          return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`
        }
        const g = discCanvas.getContext('2d')!
        const r = discCanvas.width / 2
        g.setTransform(1, 0, 0, 1, 0, 0)
        g.clearRect(0, 0, r * 2, r * 2)
        g.translate(r, r)
        const grad = g.createRadialGradient(0, 0, r * 0.15, 0, 0, r)
        grad.addColorStop(0, `rgba(${rgb(hexes[4])}, 0)`)
        grad.addColorStop(0.7, `rgba(${rgb(hexes[3])}, 0.16)`)
        grad.addColorStop(1, `rgba(${rgb(hexes[2])}, 0)`)
        g.fillStyle = grad
        g.beginPath()
        g.arc(0, 0, r, 0, Math.PI * 2)
        g.fill()
        for (const a0 of [0, Math.PI]) {
          for (let k = 0; k < 12; k++) {
            const a = a0 - k * 0.08
            g.fillStyle = `rgba(${rgb(hexes[5])}, ${(0.22 * (1 - k / 12)).toFixed(3)})`
            g.beginPath()
            g.moveTo(0, 0)
            g.arc(0, 0, r * 0.94, a - 0.05, a + 0.05)
            g.closePath()
            g.fill()
          }
        }
        disc.needsUpdate = true
      }
      drawDisc(paletteNow().ramp)
      const discMat = new THREE.MeshBasicMaterial({
        map: disc,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
      const discGeo = new THREE.CircleGeometry(0.0262, 48)
      discGeo.rotateX(-Math.PI / 2)

      const loader = new GLTFLoader()
      loader.setMeshoptDecoder(MeshoptDecoder)
      let gltf
      try {
        gltf = await loader.loadAsync(E58_URL)
      } catch {
        if (!disposed) setPhase('failed')
        renderer.dispose()
        return
      }
      if (disposed) {
        renderer.dispose()
        return
      }

      const meshes: InstanceType<typeof THREE.Mesh>[] = []
      gltf.scene.traverse((o) => {
        if ((o as InstanceType<typeof THREE.Mesh>).isMesh) meshes.push(o as InstanceType<typeof THREE.Mesh>)
      })
      gltf.scene.updateMatrixWorld(true)
      for (const m of meshes) {
        m.quaternion.identity()
        m.updateMatrix()
        m.geometry.applyMatrix4(m.matrix)
      }
      const bodyMesh = meshes.find((m) => /Blackplane/.test(m.name)) ?? meshes[0]
      const lensMesh = meshes.find((m) => m !== bodyMesh)
      const split = splitProps(bodyMesh.geometry)
      const bbox = new THREE.Box3().setFromBufferAttribute(split.body.attributes.position as InstanceType<typeof THREE.BufferAttribute>)
      const core = new THREE.Vector3()
      bbox.getCenter(core)
      core.y += (bbox.max.y - bbox.min.y) * 0.12

      const bodyMat = thermal(0.42, 0.62, core)
      const lensMat = thermal(0.12, 0.1, core)
      const mats = [bodyMat, lensMat]

      // nose along -z in the model; turn it to +x, then centre and scale the footprint
      const K = 2.1 / Math.hypot(HUBS[0][0] - HUBS[2][0], HUBS[0][2] - HUBS[2][2])
      const centre = new THREE.Vector3(0, (bbox.min.y + bbox.max.y) / 2, 0)
      HUBS.forEach(([x, , z]) => {
        centre.x += x / 4
        centre.z += z / 4
      })
      centre.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).multiplyScalar(-K)
      const turn = new THREE.Group()
      turn.rotation.y = -Math.PI / 2
      turn.scale.setScalar(K)
      turn.position.copy(centre)
      turn.add(new THREE.Mesh(split.body, bodyMat))
      if (lensMesh) turn.add(new THREE.Mesh(lensMesh.geometry, lensMat))
      const discs = HUBS.map(([x, y, z]) => {
        const d = new THREE.Mesh(discGeo, discMat)
        d.position.set(x, y + 0.0026, z)
        turn.add(d)
        return d
      })

      // yaw ▸ pitch ▸ bank ▸ airframe; the nose (+x) faces the camera at rest
      const roll = new THREE.Group()
      roll.add(turn)
      const pitch = new THREE.Group()
      pitch.add(roll)
      const yaw = new THREE.Group()
      yaw.add(pitch)
      scene.add(yaw)

      // a sample of the airframe's own vertices: projected each frame, their screen
      // bounds are the detector box, tight to the silhouette at any angle
      const src = split.body.attributes.position
      const step = Math.max(1, Math.floor(src.count / 420))
      const sample: number[] = []
      for (let i = 0; i < src.count; i += step) sample.push(src.getX(i), src.getY(i), src.getZ(i))
      HUBS.forEach(([x, y, z]) => {
        // the rotor discs' rims belong to the silhouette too
        for (let a = 0; a < 8; a++) sample.push(x + Math.cos(a) * 0.0262, y + 0.0026, z + Math.sin(a) * 0.0262)
      })
      const v = new THREE.Vector3()

      /*
       * The camera's own lens. The frame renders off screen, then one pass
       * samples the palette's split channel magnified a little more and the
       * other two a little less, about the frame's centre: lateral chromatic
       * aberration, zero on the axis, growing toward the edges, like cheap glass.
       */
      const rt = new THREE.WebGLRenderTarget(1, 1, { samples: 4 })
      const lensPass = new THREE.ShaderMaterial({
        uniforms: {
          tFrame: { value: rt.texture },
          uK: { value: 0 },
          uMask: { value: new THREE.Vector3(0, 1, 0) },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tFrame;
          uniform float uK;
          uniform vec3 uMask;
          varying vec2 vUv;
          void main() {
            vec2 d = vUv - 0.5;
            vec4 a = texture2D(tFrame, 0.5 + d * (1.0 + uK));
            vec4 b = texture2D(tFrame, 0.5 + d * (1.0 - uK));
            gl_FragColor = vec4(a.rgb * uMask + b.rgb * (1.0 - uMask), max(a.a, b.a));
          }
        `,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
      })
      const lensQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensPass)
      lensQuad.frustumCulled = false
      const lensScene = new THREE.Scene()
      lensScene.add(lensQuad)
      const lensCam = new THREE.Camera()
      const STRENGTH: Record<string, number> = { off: 0, subtle: 0.012, strong: 0.022, wild: 0.042 }
      const MASK = { r: [1, 0, 0], g: [0, 1, 0], b: [0, 0, 1] } as const
      const lensNow = () => {
        const root = host.closest<HTMLElement>('[data-v3]')
        lensPass.uniforms.uK.value = STRENGTH[root?.dataset.aberration ?? 'strong'] ?? 0.022
        lensPass.uniforms.uMask.value.set(...MASK[paletteNow().split])
      }
      lensNow()
      const draw = () => {
        renderer.setRenderTarget(rt)
        renderer.clear()
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
        renderer.render(lensScene, lensCam)
      }
      const buf = new THREE.Vector2()

      const size = () => {
        const w = host.clientWidth
        const h = host.clientHeight
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
        renderer.setSize(w, h, false)
        renderer.getDrawingBufferSize(buf)
        rt.setSize(buf.x, buf.y)
        camera.aspect = w / h
        // keep the whole airframe in frame on tall, narrow panels
        const back = Math.max(1, 0.95 / camera.aspect)
        camera.position.set(0, 1.15 * back, 7.1 * back)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
      }
      size()
      const ro = new ResizeObserver(size)
      ro.observe(host)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const fine = window.matchMedia('(pointer: fine)').matches
      const ptr = { x: 0, y: 0, at: -1e9 }
      const onPointer = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        ptr.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
        ptr.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
        ptr.at = performance.now()
      }
      if (fine && !reduced) window.addEventListener('pointermove', onPointer, { passive: true })

      // PD tracker per axis: θ'' = Kp·(θ* − θ) − Kd·θ'
      const KP = 34
      const KD = 7.4
      const ax = { yaw: { th: 0, om: 0 }, pitch: { th: 0, om: 0 } }
      let tracking = false
      let visible = true
      let raf = 0
      let last = 0
      let t = 0

      const place = (dt: number) => {
        yaw.rotation.y = -Math.PI / 2 + 0.38 + ax.yaw.th
        pitch.rotation.z = 0.1 + ax.pitch.th
        roll.rotation.x = -ax.yaw.om * 0.085
        yaw.position.y = reduced ? 0 : Math.sin(t * 1.5) * 0.035
        for (const m of mats) m.uniforms.uTime.value = t
        discs.forEach((d, i) => (d.rotation.y += (i % 2 ? -1 : 1) * dt * 52))
        scene.updateMatrixWorld(true)
        // project the airframe's corners; the detector box is their screen bounds
        let x0 = 1
        let y0 = 1
        let x1 = -1
        let y1 = -1
        for (let i = 0; i < sample.length; i += 3) {
          v.set(sample[i], sample[i + 1], sample[i + 2]).applyMatrix4(turn.matrixWorld).project(camera)
          x0 = Math.min(x0, v.x)
          x1 = Math.max(x1, v.x)
          y0 = Math.min(y0, v.y)
          y1 = Math.max(y1, v.y)
        }
        const w = host.clientWidth
        const h = host.clientHeight
        const pad = 10
        const L = ((x0 + 1) / 2) * w - pad
        const R = ((x1 + 1) / 2) * w + pad
        const T = ((1 - y1) / 2) * h - pad
        const B = ((1 - y0) / 2) * h + pad
        box.style.transform = `translate3d(${L.toFixed(1)}px, ${T.toFixed(1)}px, 0)`
        box.style.width = `${(R - L).toFixed(1)}px`
        box.style.height = `${(B - T).toFixed(1)}px`
      }

      const frame = (now: number) => {
        raf = 0
        if (disposed) return
        const dt = last ? Math.min(0.033, (now - last) / 1000) : 1 / 60
        last = now
        t += dt
        const live = fine && now - ptr.at < 2600
        if (live !== tracking) {
          tracking = live
          if (stateRef.current) stateRef.current.textContent = live ? copy.tracking : copy.idle
          host.dataset.tracking = live ? 'on' : 'off'
        }
        const goal = live
          ? { yaw: ptr.x * 0.85, pitch: -ptr.y * 0.32 }
          : { yaw: Math.sin(t * 0.45) * 0.55, pitch: Math.sin(t * 0.31) * 0.08 }
        for (const k of ['yaw', 'pitch'] as const) {
          const a = ax[k]
          const acc = KP * (goal[k] - a.th) - KD * a.om
          a.om += acc * dt
          a.th += a.om * dt
        }
        place(dt)
        draw()
        if (visible) raf = requestAnimationFrame(frame)
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !reduced && !raf) {
          last = 0
          raf = requestAnimationFrame(frame)
        }
      })

      await renderer.compileAsync(scene, camera)
      if (disposed) return
      if (reduced) {
        place(0)
        draw()
        setPhase('still')
      } else {
        setPhase('live')
        io.observe(host)
      }

      // a new colour option: new colour map, same frame
      const onPalette = () => {
        const hexes = paletteNow().ramp
        fillRamp(hexes)
        drawDisc(hexes)
        lensNow()
        if (reduced) draw()
      }
      const onAberration = () => {
        lensNow()
        if (reduced) draw()
      }
      window.addEventListener('v3-palette', onPalette)
      window.addEventListener('v3-aberration', onAberration)

      cleanup = () => {
        window.removeEventListener('v3-palette', onPalette)
        window.removeEventListener('v3-aberration', onAberration)
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener('pointermove', onPointer)
        split.body.dispose()
        split.propGeos.forEach((g) => g.dispose())
        bodyMesh.geometry.dispose()
        lensMesh?.geometry.dispose()
        mats.forEach((m) => m.dispose())
        ramp.dispose()
        disc.dispose()
        discMat.dispose()
        discGeo.dispose()
        rt.dispose()
        lensPass.dispose()
        lensQuad.geometry.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [clear, copy.idle, copy.tracking])

  const status =
    phase === 'live' ? copy.idle : phase === 'still' ? copy.target : phase === 'failed' ? copy.target : copy.loading

  return (
    <figure className={styles.feed} aria-label={copy.ariaLabel}>
      <div ref={panel} className={styles.panel} data-phase={phase} data-tracking="off">
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />

        <div ref={det} className={styles.det} aria-hidden="true">
          <i data-c="tl" />
          <i data-c="tr" />
          <i data-c="bl" />
          <i data-c="br" />
          <span className={styles.detTag}>{copy.target}</span>
        </div>

        <div className={styles.hud} aria-hidden="true">
          <span className={styles.hudTL}>
            <b>{copy.label}</b> · {mode}
          </span>
          <span className={styles.hudTR}>SIM</span>
          <span className={styles.cross} />
          <span className={styles.hudBL}>
            <span className={styles.dotLive} />
            <span ref={stateRef}>{status}</span>
          </span>
          <span className={styles.scale}>
            <span>{copy.scaleCold}</span>
            <span className={styles.scaleBar} />
            <span>{copy.scaleHot}</span>
          </span>
          <i className={styles.fc} data-c="tl" />
          <i className={styles.fc} data-c="tr" />
          <i className={styles.fc} data-c="bl" />
          <i className={styles.fc} data-c="br" />
        </div>
      </div>
      <figcaption className={styles.caption}>
        {copy.note}{' '}
        <a href={copy.credit.href} target="_blank" rel="noopener noreferrer">
          {copy.credit.title}
        </a>{' '}
        by{' '}
        <a href={copy.credit.authorHref} target="_blank" rel="noopener noreferrer">
          {copy.credit.author}
        </a>
        ,{' '}
        <a href={copy.credit.licenseHref} target="_blank" rel="noopener noreferrer">
          {copy.credit.license}
        </a>
        .
      </figcaption>
    </figure>
  )
}
