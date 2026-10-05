'use client'

import type * as THREE_NS from 'three'

import { clamp } from '../armed'
import type { Three } from './host'

/*
 * The E58, as the reel builds it (videos/armed-30/assets/js/gl.js): the body
 * mesh with its four propellers lifted out into their own pivots so the
 * blades really turn, a motion-blur disc per rotor that fades in with spin
 * rate, and a lighter lens for the swarm. "Eachine E58 Pocket Drone" by
 * the_Thorminator, CC BY 4.0. Loaded once per page and shared.
 */

const MODEL = '/models/eachine-e58.glb'
const HUBS: [number, number, number][] = [
  [-0.055, 0.0141, -0.0391],
  [0.0546, 0.0138, -0.039],
  [0.0499, -0.0001, 0.0414],
  [-0.0504, -0.0001, 0.0415],
]
const PROP_R = 0.0262
const diag = Math.max(
  Math.hypot(HUBS[0][0] - HUBS[2][0], HUBS[0][2] - HUBS[2][2]),
  Math.hypot(HUBS[1][0] - HUBS[3][0], HUBS[1][2] - HUBS[3][2])
)
/** Model units to world units: rotor diagonal 2.1. */
const K = 2.1 / diag

export interface Template {
  bodyGeo: THREE_NS.BufferGeometry
  bodyMat: THREE_NS.Material
  lensGeo: THREE_NS.BufferGeometry
  lensMat: THREE_NS.Material
  lensLite: THREE_NS.Material
  propGeos: THREE_NS.BufferGeometry[]
  centre: THREE_NS.Vector3
  blurTex: THREE_NS.Texture
  blurGeo: THREE_NS.BufferGeometry
}

function blurTexture(THREE: Three) {
  const n = 256
  const c = document.createElement('canvas')
  c.width = c.height = n
  const g = c.getContext('2d')!
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
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function splitProps(THREE: Three, geo: THREE_NS.BufferGeometry) {
  const pos = geo.attributes.position
  const index = geo.index
    ? Array.from(geo.index.array)
    : [...Array(pos.count).keys()]
  const keep: number[] = []
  const props: number[][] = HUBS.map(() => [])
  const c = new THREE.Vector3()
  for (let i = 0; i < index.length; i += 3) {
    c.set(0, 0, 0)
    for (let k = 0; k < 3; k++) {
      c.x += pos.getX(index[i + k]) / 3
      c.y += pos.getY(index[i + k]) / 3
      c.z += pos.getZ(index[i + k]) / 3
    }
    let owner = -1
    HUBS.forEach(([hx, hy, hz], h) => {
      if (
        owner < 0 &&
        Math.hypot(c.x - hx, c.z - hz) < PROP_R &&
        c.y > hy - 0.0016
      )
        owner = h
    })
    if (owner < 0) keep.push(index[i], index[i + 1], index[i + 2])
    else props[owner].push(index[i], index[i + 1], index[i + 2])
  }
  const body = geo.clone()
  body.setIndex(keep)
  const propGeos = props.map((tri, h) => {
    const g = geo.clone()
    g.setIndex(tri)
    const out = g.toNonIndexed()
    out.translate(-HUBS[h][0], -HUBS[h][1], -HUBS[h][2])
    return out
  })
  return { body, propGeos }
}

let cached: Promise<Template> | null = null

export function loadAirframe(THREE: Three): Promise<Template> {
  if (cached) return cached
  cached = (async () => {
    const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
    ])
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    loader.setDRACOLoader(draco)
    const gltf = await loader.loadAsync(MODEL)
    draco.dispose()
    const meshes: THREE_NS.Mesh[] = []
    gltf.scene.traverse((o) => {
      if ((o as THREE_NS.Mesh).isMesh) meshes.push(o as THREE_NS.Mesh)
    })
    gltf.scene.updateMatrixWorld(true)
    for (const m of meshes) {
      m.quaternion.identity()
      m.updateMatrix()
      m.geometry.applyMatrix4(m.matrix)
    }
    const bodyMesh = meshes.find((m) => /Blackplane/.test(m.name)) ?? meshes[0]
    const lensMesh = meshes.find((m) => m !== bodyMesh) ?? bodyMesh
    const split = splitProps(THREE, bodyMesh.geometry)
    const bodyMat = bodyMesh.material as THREE_NS.MeshStandardMaterial
    bodyMat.envMapIntensity = 1.7
    const lensMat = lensMesh.material as THREE_NS.MeshPhysicalMaterial
    lensMat.envMapIntensity = 1.7
    const lensLite = lensMat.clone()
    lensLite.transmission = 0
    lensLite.transparent = true
    lensLite.opacity = 0.75
    // centre of the airframe in model space (hub centroid, mid-height)
    const box = new THREE.Box3().setFromBufferAttribute(
      bodyMesh.geometry.attributes.position as THREE_NS.BufferAttribute
    )
    const centre = new THREE.Vector3(0, (box.min.y + box.max.y) / 2, 0)
    HUBS.forEach(([x, , z]) => {
      centre.x += x / 4
      centre.z += z / 4
    })
    centre
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
      .multiplyScalar(-K)
    const blurGeo = new THREE.CircleGeometry(PROP_R * 0.98, 48)
    blurGeo.rotateX(-Math.PI / 2)
    return {
      bodyGeo: split.body,
      bodyMat,
      lensGeo: lensMesh.geometry,
      lensMat,
      lensLite,
      propGeos: split.propGeos,
      centre,
      blurTex: blurTexture(THREE),
      blurGeo,
    }
  })()
  cached.catch(() => (cached = null))
  return cached
}

export interface Airframe extends THREE_NS.Group {
  userData: {
    props: THREE_NS.Group[]
    discs: THREE_NS.Mesh[]
    blurMat: THREE_NS.MeshBasicMaterial
  }
}

export function makeAirframe(
  THREE: Three,
  t: Template,
  { lite = false } = {}
): Airframe {
  const rig = new THREE.Group() as unknown as Airframe
  rig.rotation.order = 'YZX'
  const turn = new THREE.Group()
  turn.rotation.y = -Math.PI / 2
  turn.scale.setScalar(K)
  turn.position.copy(t.centre)
  rig.add(turn)
  turn.add(new THREE.Mesh(t.bodyGeo, t.bodyMat))
  turn.add(new THREE.Mesh(t.lensGeo, lite ? t.lensLite : t.lensMat))
  const blurMat = new THREE.MeshBasicMaterial({
    map: t.blurTex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    opacity: 0,
  })
  const props: THREE_NS.Group[] = []
  const discs: THREE_NS.Mesh[] = []
  HUBS.forEach(([x, y, z], h) => {
    const pivot = new THREE.Group()
    pivot.position.set(x, y, z)
    pivot.add(new THREE.Mesh(t.propGeos[h], t.bodyMat))
    turn.add(pivot)
    props.push(pivot)
    const d = new THREE.Mesh(t.blurGeo, blurMat)
    d.position.set(x, y + 0.0024, z)
    turn.add(d)
    discs.push(d)
  })
  rig.userData = { props, discs, blurMat }
  return rig
}

/** Blade angle and rotor blur by spin rate (rad/s). */
export function spin(af: Airframe, angle: number, rate: number, alpha = 1) {
  const { props, discs, blurMat } = af.userData
  const fast = clamp((rate - 40) / 70)
  props.forEach((p, i) => {
    p.rotation.y = angle * (i % 2 === 0 ? 1 : -1)
    p.children[0].visible = fast < 0.92
  })
  discs.forEach(
    (d, i) => (d.rotation.y = angle * 0.37 * (i % 2 === 0 ? 1 : -1))
  )
  blurMat.opacity = 0.95 * fast * alpha
}

/** A room environment for the airframe's reflections, per renderer. */
export async function environment(
  THREE: Three,
  renderer: THREE_NS.WebGLRenderer
) {
  const { RoomEnvironment } =
    await import('three/examples/jsm/environments/RoomEnvironment.js')
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  return env
}
