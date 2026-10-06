import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import { E58_URL } from '../home/airframes'
import { PREFLIGHT } from './timing'

/*
 * The preflight's 3D layer: the Eachine E58 (the_Thorminator, CC BY 4.0)
 * arms on a macro of its own propeller, pulls back, lifts, rolls a full
 * turn, faces the lens and dives into it; then the camera drops low and fast
 * over the contour field while the name lands. One continuous move, eased
 * end to end. Everything is a function of t (seconds since the arm switch),
 * so a skipped or delayed frame lands in the right place.
 */

export interface FlightReadout {
  roll: number
  alt: number
  throttle: number
  mode: 'angle' | 'flip' | 'fpv'
}

export interface PreflightSize {
  width: number
  height: number
  dpr: number
}

export interface PreflightScene {
  /** Resolves when the model is in and the first frame is drawable. */
  ready: Promise<void>
  /** Draw t seconds after the arm switch (t < 0 holds the macro before arming). */
  frame(t: number): FlightReadout
  resize(size: PreflightSize): void
  dispose(): void
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const inOut3 = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const out3 = (k: number) => 1 - Math.pow(1 - k, 3)
const in3 = (k: number) => k * k * k

// Measured once from the E58 with the tilt undone; model units, nose along -z.
export const HUBS: [number, number, number][] = [
  [-0.055, 0.0141, -0.0391],
  [0.0546, 0.0138, -0.039],
  [0.0499, -0.0001, 0.0414],
  [-0.0504, -0.0001, 0.0415],
]
const LENS: [number, number, number] = [-0.0003, -0.0012, -0.0379]
export const PROP_R = 0.0262

const TERRAIN_VERT = /* glsl */ `
  uniform float uTime; uniform float uShift;
  varying float vHeight; varying float vDist; varying vec2 vGrid;
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float terrain(vec2 p) { return snoise(p * 0.11) * 1.1 + snoise(p * 0.27 + 7.3) * 0.38 + snoise(p * 0.62 - 3.1) * 0.12; }
  void main() {
    vec3 pos = position; vec2 q = pos.xz + vec2(uShift, -uTime);
    pos.y += terrain(q); vHeight = pos.y; vGrid = q * 0.5;
    vec4 view = viewMatrix * modelMatrix * vec4(pos, 1.0); vDist = -view.z;
    gl_Position = projectionMatrix * view;
  }`

const TERRAIN_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uNear; uniform float uGrid; uniform float uFar;
  varying float vHeight; varying float vDist; varying vec2 vGrid;
  void main() {
    float k = vHeight * 4.0;
    float contour = 1.0 - min(abs(fract(k - 0.5) - 0.5) / fwidth(k), 1.0);
    float major = 1.0 - min(abs(fract(k / 5.0 - 0.5) - 0.5) / fwidth(k / 5.0), 1.0);
    vec2 g = abs(fract(vGrid - 0.5) - 0.5) / fwidth(vGrid);
    float grid = 1.0 - min(min(g.x, g.y), 1.0);
    float fade = smoothstep(uFar, 6.0, vDist) * smoothstep(uNear, uNear + 1.6, vDist);
    float a = (contour * 0.55 + major * 0.55 + grid * uGrid) * fade * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
  }`

function blurTexture(): THREE.CanvasTexture<OffscreenCanvas | HTMLCanvasElement> {
  const n = 256
  // OffscreenCanvas works on the page and in a worker alike; older Safari (page path) gets a <canvas>
  const c: OffscreenCanvas | HTMLCanvasElement =
    typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(n, n) : Object.assign(document.createElement('canvas'), { width: n, height: n })
  const g = c.getContext('2d') as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
  const r = n / 2
  g.translate(r, r)
  const disc = g.createRadialGradient(0, 0, r * 0.12, 0, 0, r)
  disc.addColorStop(0, 'rgba(251,245,234,0.02)')
  disc.addColorStop(0.85, 'rgba(251,245,234,0.12)')
  disc.addColorStop(1, 'rgba(251,245,234,0)')
  g.fillStyle = disc
  g.beginPath()
  g.arc(0, 0, r, 0, Math.PI * 2)
  g.fill()
  for (const a0 of [0, Math.PI]) {
    for (let k = 0; k < 14; k++) {
      const a = a0 - k * 0.07
      g.fillStyle = `rgba(26,20,20,${(0.42 * (1 - k / 14)).toFixed(3)})`
      g.beginPath()
      g.moveTo(0, 0)
      g.arc(0, 0, r * 0.96, a - 0.05, a + 0.05)
      g.closePath()
      g.fill()
    }
  }
  g.strokeStyle = 'rgba(251,245,234,0.24)'
  g.lineWidth = 2
  g.beginPath()
  g.arc(0, 0, r * 0.95, 0, Math.PI * 2)
  g.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Lift the four propellers out of the merged body mesh, each re-centred on its hub. */
export function splitProps(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position
  const index = geo.index ? Array.from(geo.index.array) : Array.from({ length: pos.count }, (_, i) => i)
  const keep: number[] = []
  const props: number[][] = HUBS.map(() => [])
  for (let i = 0; i < index.length; i += 3) {
    let cx = 0
    let cy = 0
    let cz = 0
    for (let k = 0; k < 3; k++) {
      cx += pos.getX(index[i + k]) / 3
      cy += pos.getY(index[i + k]) / 3
      cz += pos.getZ(index[i + k]) / 3
    }
    const owner = HUBS.findIndex(([hx, hy, hz]) => Math.hypot(cx - hx, cz - hz) < PROP_R && cy > hy - 0.0016)
    ;(owner < 0 ? keep : props[owner]).push(index[i], index[i + 1], index[i + 2])
  }
  const body = geo.clone()
  body.setIndex(keep)
  const propGeos = props.map((tri, h) => {
    const g = geo.clone()
    g.setIndex(tri)
    const out = g.toNonIndexed()
    out.translate(-HUBS[h][0], -HUBS[h][1], -HUBS[h][2])
    g.dispose()
    return out
  })
  return { body, propGeos }
}

/**
 * Build the scene on a page canvas or (in the worker) an OffscreenCanvas. `model`
 * is the E58 as bytes, when the caller already has it (the page fetched it from
 * the first paint); otherwise the scene fetches it itself.
 */
export function createPreflight(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  size: PreflightSize,
  model?: Promise<ArrayBuffer | null>,
  /** The host's brand colour: the rim light and the terrain lines. */
  tint = '#c9686a',
): PreflightScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(size.dpr || 1, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, 0.02, 200)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.add(new THREE.HemisphereLight(0xffe9dc, 0x1a0f0e, 1.1))
  const key = new THREE.DirectionalLight(0xfff3e8, 2.4)
  key.position.set(3.5, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(new THREE.Color(tint), 2.8)
  rim.position.set(-4, 1.5, -3.5)
  scene.add(rim)

  const terrainMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uShift: { value: 0 },
      uColor: { value: new THREE.Color(tint) },
      uOpacity: { value: 0 },
      uNear: { value: 1.5 },
      uGrid: { value: 0.1 },
      uFar: { value: 42 },
    },
    vertexShader: TERRAIN_VERT,
    fragmentShader: TERRAIN_FRAG,
  })
  const terrainGeo = new THREE.PlaneGeometry(90, 70, 260, 200)
  terrainGeo.rotateX(-Math.PI / 2)
  const terrain = new THREE.Mesh(terrainGeo, terrainMat)
  terrain.frustumCulled = false
  scene.add(terrain)

  const blurTex = blurTexture()
  const blurGeo = new THREE.CircleGeometry(PROP_R * 0.98, 48)
  blurGeo.rotateX(-Math.PI / 2)
  const blurMat = new THREE.MeshBasicMaterial({ map: blurTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0 })

  const rig = new THREE.Group()
  rig.rotation.order = 'YZX'
  rig.visible = false
  scene.add(rig)
  const pivots: THREE.Group[] = []
  const discs: THREE.Mesh[] = []
  const lens = new THREE.Object3D()
  const disposables: { dispose(): void }[] = [terrainGeo, terrainMat, blurTex, blurGeo, blurMat, envTex, pmrem]

  const diag = Math.max(Math.hypot(HUBS[0][0] - HUBS[2][0], HUBS[0][2] - HUBS[2][2]), Math.hypot(HUBS[1][0] - HUBS[3][0], HUBS[1][2] - HUBS[3][2]))
  const K = 2.1 / diag

  const ready = (async () => {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    const bytes = model ? await model : null
    const gltf: GLTF = bytes ? await loader.parseAsync(bytes, '') : await loader.loadAsync(E58_URL)
    const meshes: THREE.Mesh[] = []
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh)
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
    const bodyMat = bodyMesh.material as THREE.MeshStandardMaterial
    bodyMat.envMapIntensity = 1.7
    disposables.push(split.body, ...split.propGeos, bodyMat, bodyMesh.geometry)
    if (lensMesh) {
      ;(lensMesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.7
      disposables.push(lensMesh.geometry, lensMesh.material as THREE.Material)
    }

    const box = new THREE.Box3().setFromBufferAttribute(bodyMesh.geometry.attributes.position as THREE.BufferAttribute)
    const centre = new THREE.Vector3(0, (box.min.y + box.max.y) / 2, 0)
    HUBS.forEach(([x, , z]) => {
      centre.x += x / 4
      centre.z += z / 4
    })
    centre.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).multiplyScalar(-K)

    const turn = new THREE.Group()
    turn.rotation.y = -Math.PI / 2
    turn.scale.setScalar(K)
    turn.position.copy(centre)
    rig.add(turn)
    turn.add(new THREE.Mesh(split.body, bodyMat))
    if (lensMesh) turn.add(new THREE.Mesh(lensMesh.geometry, lensMesh.material))
    HUBS.forEach(([x, y, z], h) => {
      const pivot = new THREE.Group()
      pivot.position.set(x, y, z)
      pivot.add(new THREE.Mesh(split.propGeos[h], bodyMat))
      turn.add(pivot)
      pivots.push(pivot)
      const d = new THREE.Mesh(blurGeo, blurMat)
      d.position.set(x, y + 0.0024, z)
      turn.add(d)
      discs.push(d)
    })
    lens.position.set(...LENS)
    turn.add(lens)
    rig.visible = true
    // compile without blocking, where the driver supports parallel shader compiles,
    // then draw one hidden frame of the opening shot: the textures go up to the
    // GPU now, not on the first frame anyone sees
    await renderer.compileAsync(scene, camera)
    frame(-1)
  })()

  function resize({ width: w, height: h, dpr }: PreflightSize) {
    renderer.setPixelRatio(Math.min(dpr || 1, 1.75))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  // a portrait screen keeps the airframe's span: widen the vertical field instead of cropping
  const fovFor = (base: number) => {
    const a = camera.aspect
    if (a >= 1.2) return base
    const h = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(base / 2)) * (1.2 / a))
    return Math.min(78, THREE.MathUtils.radToDeg(h))
  }

  function look(pos: THREE.Vector3, target: THREE.Vector3, fov: number, roll = 0) {
    camera.position.copy(pos)
    camera.up.set(0, 1, 0)
    camera.lookAt(target)
    if (roll) camera.rotateZ(roll)
    const f = fovFor(fov)
    if (Math.abs(camera.fov - f) > 1e-3) {
      camera.fov = f
      camera.updateProjectionMatrix()
    }
  }

  const throttle = (t: number) => {
    if (t < 0) return 0
    if (t < PREFLIGHT.lift[0]) return lerp(0.14, 0.6, out3(prog(t, 0.08, PREFLIGHT.lift[0])))
    if (t < PREFLIGHT.roll[0]) return lerp(0.6, 0.72, prog(t, PREFLIGHT.lift[0], PREFLIGHT.roll[0]))
    if (t < PREFLIGHT.turn[1]) return 0.92
    return lerp(0.8, 1, prog(t, PREFLIGHT.dive[0], PREFLIGHT.dive[1]))
  }

  let lastT = -1
  let angle = 0
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

  function frame(t: number): FlightReadout {
    // blade angle integrates the rate; a jump (a skip) just lands wherever it lands
    const dt = clamp(t - lastT, 0, 0.1)
    lastT = t
    const thr = throttle(t)
    const rate = thr > 0 ? 18 + thr * 150 : 0
    angle += rate * dt
    const fast = clamp((rate - 40) / 70)
    pivots.forEach((p, i) => {
      p.rotation.y = angle * (i % 2 === 0 ? 1 : -1)
      p.children[0].visible = fast < 0.92
    })
    discs.forEach((d, i) => (d.rotation.y = angle * 0.37 * (i % 2 === 0 ? 1 : -1)))
    blurMat.opacity = 0.95 * fast

    if (t >= PREFLIGHT.name) return fpv(t - PREFLIGHT.name)

    // the airframe
    const lift = out3(prog(t, ...PREFLIGHT.lift)) * 0.55
    const flip = inOut3(prog(t, ...PREFLIGHT.roll))
    const turnK = inOut3(prog(t, ...PREFLIGHT.turn))
    const dive = in3(prog(t, PREFLIGHT.dive[0], 3.0)) + 0.14 * prog(t, 3.0, PREFLIGHT.dive[1])
    const roll = flip * Math.PI * 2 + 0.04 * Math.sin(t * 7) * prog(t, 0.6, 1.2) * (1 - flip)
    rig.position.set(0, lift + Math.sin(flip * Math.PI) * 0.35, 0)
    rig.rotation.set(roll, lerp(0.55, -Math.PI / 2, turnK), -0.06 * lift + 0.2 * turnK - 0.28 * dive, 'YZX')
    rig.updateMatrixWorld(true)

    // the camera: macro on the front prop, an eased pull back to three-quarters,
    // then round to face the airframe as it turns to the lens
    const hub = pivots[1]?.getWorldPosition(V(0, 0, 0)) ?? V(0, 0, 0)
    const pull = inOut3(prog(t, ...PREFLIGHT.pull))
    const front = inOut3(prog(t, 1.92, 2.56))
    const macroPos = hub.clone().add(V(0.38, 0.2, 0.55))
    const macroLook = hub.clone().add(V(-0.05, -0.03, 0))
    const widePos = V(2.5, 0.95 + lift * 0.6, 3.7)
    const wideLook = V(0, lift * 0.75 + 0.05, 0)
    const frontPos = V(0.05, 0.62 + lift * 0.5, 4.5)
    const pos = macroPos.lerp(widePos, pull).lerp(frontPos, front)
    if (dive > 0) {
      // slide the airframe so its lens runs down the line into the camera
      const l0 = lens.getWorldPosition(V(0, 0, 0))
      const end = pos.clone().sub(pos.clone().sub(l0).normalize().multiplyScalar(0.075))
      rig.position.add(l0.clone().lerp(end, dive).sub(l0))
      rig.updateMatrixWorld(true)
    }
    const lensNow = lens.getWorldPosition(V(0, 0, 0))
    const target = macroLook.lerp(wideLook, pull).lerp(lensNow, inOut3(prog(t, 2.18, 2.7)))
    look(pos, target, lerp(30, 34, pull) - 4 * front)

    terrain.position.set(0, -2.5, -10)
    const tm = terrainMat.uniforms
    tm.uOpacity.value = 0.25 + 0.6 * out3(prog(t, 0.2, 1.2))
    tm.uTime.value = Math.max(0, t) * 0.5
    tm.uShift.value = 0
    tm.uNear.value = 1.5
    tm.uGrid.value = 0.1
    tm.uFar.value = 42
    rig.visible = true
    renderer.render(scene, camera)
    return {
      roll,
      alt: Math.max(0, rig.position.y) * 1.8,
      throttle: thr,
      mode: t > PREFLIGHT.roll[0] && t < PREFLIGHT.turn[0] ? 'flip' : 'angle',
    }
  }

  // after the lens: low and fast over the contour field, under the name
  function fpv(l: number): FlightReadout {
    rig.visible = false
    terrain.position.set(0, -2.1, -24)
    const tm = terrainMat.uniforms
    tm.uOpacity.value = 1.6 * out3(prog(l, 0, 0.35))
    tm.uTime.value = 40 + l * 18
    tm.uShift.value = 6 * Math.sin(l * 0.7)
    tm.uNear.value = 0.3
    tm.uGrid.value = 0.42
    tm.uFar.value = 34
    const bank = 0.09 * Math.sin(l * 2.1) + 0.05 * Math.sin(l * 5.3)
    look(V(0, 0.1, 0), V(0.4 * Math.sin(l * 0.9), -1.55, -8), 76, bank)
    renderer.render(scene, camera)
    return { roll: bank, alt: 2.4, throttle: 0.62, mode: 'fpv' }
  }

  resize(size)

  return {
    ready,
    frame,
    resize,
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh && m.geometry && !disposables.includes(m.geometry)) m.geometry.dispose()
      })
      for (const d of disposables) d.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

