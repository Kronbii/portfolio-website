'use client'

import type * as THREE_NS from 'three'

import type { Three } from '@/components/v6/gl/host'

/*
 * The Unitree Go2, from MuJoCo Menagerie (unitree_go2; © Unitree Robotics,
 * BSD-3-Clause, see public/models/CREDITS.md), simplified to about 30k
 * triangles a robot. Every part is one instanced mesh for the whole pack, so
 * 36 robots cost 13 draw calls. A pose is where the base stands, its heading
 * and attitude, and the twelve joint angles, set through the robot's own
 * kinematic tree, in MuJoCo's frame (x forward, y left, z up, metres).
 */

const MODEL = '/models/unitree-go2.glb'

const PARTS = [
  'base_black',
  'base_white',
  'base_gray',
  'hip_metal',
  'hip_gray',
  'thigh_metal',
  'thigh_gray',
  'thighm_metal',
  'thighm_gray',
  'calf_gray',
  'calf_black',
  'calfm_gray',
  'calfm_black',
] as const
type Part = (typeof PARTS)[number]
export type Go2 = Record<Part, THREE_NS.BufferGeometry>

/** The legs as the MJCF has them: hip place, side (+1 left), and the half-turn the right-hand hip shells take. */
const LEGS: {
  hip: [number, number, number]
  side: 1 | -1
  flip: [number, number, number] | null
}[] = [
  { hip: [0.1934, 0.0465, 0], side: 1, flip: null }, // FL
  { hip: [0.1934, -0.0465, 0], side: -1, flip: [1, 0, 0] }, // FR
  { hip: [-0.1934, 0.0465, 0], side: 1, flip: [0, 1, 0] }, // RL
  { hip: [-0.1934, -0.0465, 0], side: -1, flip: [0, 0, 1] }, // RR
]
/** Base height standing at thigh 0.9, calf -1.8 (the MJCF's home pose), feet on the ground. */
export const STAND = 0.285

let cached: Promise<Go2> | null = null

export function loadGo2(THREE: Three): Promise<Go2> {
  if (cached) return cached
  cached = (async () => {
    const [{ GLTFLoader }, { MeshoptDecoder }, { toCreasedNormals }] =
      await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
        import('three/examples/jsm/utils/BufferGeometryUtils.js'),
      ])
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    const gltf = await loader.loadAsync(MODEL)
    gltf.scene.updateMatrixWorld(true)
    const out = {} as Go2
    const v = new THREE.Vector3()
    gltf.scene.traverse((o) => {
      const m = o as THREE_NS.Mesh
      if (!m.isMesh) return
      // quantised positions carry their scale on the node: bake it into plain floats
      const src = m.geometry.attributes.position
      const pos = new Float32Array(src.count * 3)
      for (let i = 0; i < src.count; i++) {
        v.fromBufferAttribute(src, i).applyMatrix4(m.matrixWorld)
        pos[i * 3] = v.x
        pos[i * 3 + 1] = v.y
        pos[i * 3 + 2] = v.z
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setIndex(m.geometry.index)
      out[m.name as Part] = toCreasedNormals(geo, Math.PI / 6)
      m.geometry.dispose()
    })
    return out
  })()
  cached.catch(() => (cached = null))
  return cached
}

export interface Pose {
  x: number
  y: number
  z: number
  /** About the world's up axis; 0 faces +x, -π/2 faces the camera (+z). */
  heading: number
  pitch: number
  roll: number
  /** Per leg (FL, FR, RL, RR): abduction, thigh, calf. */
  legs: [number, number, number][]
}

export interface Pack {
  group: THREE_NS.Group
  set: (i: number, p: Pose) => void
  commit: () => void
  dispose: () => void
}

export function makePack(THREE: Three, go2: Go2, n: number): Pack {
  const mat = {
    gray: new THREE.MeshStandardMaterial({
      color: '#c3c8c3',
      roughness: 0.4,
      metalness: 0.12,
      envMapIntensity: 1.3,
    }),
    white: new THREE.MeshStandardMaterial({
      color: '#eef1ec',
      roughness: 0.35,
      envMapIntensity: 1.3,
    }),
    black: new THREE.MeshStandardMaterial({
      color: '#141715',
      roughness: 0.5,
      metalness: 0.15,
      envMapIntensity: 1.3,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: '#b4bab6',
      roughness: 0.32,
      metalness: 0.75,
      envMapIntensity: 1.5,
    }),
  }
  const group = new THREE.Group()
  const count = (p: Part) =>
    p.startsWith('base') ? n : p.startsWith('hip') ? 4 * n : 2 * n
  const meshes = {} as Record<Part, THREE_NS.InstancedMesh>
  for (const p of PARTS) {
    const m = new THREE.InstancedMesh(
      go2[p],
      mat[p.split('_')[1] as keyof typeof mat],
      count(p)
    )
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    m.frustumCulled = false
    group.add(m)
    meshes[p] = m
  }

  // one bare kinematic tree per robot: the parts' matrices are read off it
  const flips = LEGS.map((l) =>
    l.flip
      ? new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(...l.flip),
          Math.PI
        )
      : new THREE.Quaternion()
  )
  const rigs = Array.from({ length: n }, () => {
    const root = new THREE.Object3D()
    const zUp = new THREE.Object3D()
    zUp.rotation.x = -Math.PI / 2
    root.add(zUp)
    const base = new THREE.Object3D()
    base.rotation.order = 'ZYX'
    zUp.add(base)
    const legs = LEGS.map((l, k) => {
      const hip = new THREE.Object3D()
      hip.position.set(...l.hip)
      base.add(hip)
      const shell = new THREE.Object3D()
      shell.quaternion.copy(flips[k])
      hip.add(shell)
      const thigh = new THREE.Object3D()
      thigh.position.set(0, 0.0955 * l.side, 0)
      hip.add(thigh)
      const calf = new THREE.Object3D()
      calf.position.set(0, 0, -0.213)
      thigh.add(calf)
      return { hip, shell, thigh, calf }
    })
    return { root, base, legs }
  })

  const set = (i: number, p: Pose) => {
    const r = rigs[i]
    r.root.position.set(p.x, 0, p.z)
    r.root.rotation.y = p.heading
    r.base.position.set(0, 0, p.y)
    r.base.rotation.set(p.roll, p.pitch, 0)
    r.legs.forEach((l, k) => {
      l.hip.rotation.x = p.legs[k][0]
      l.thigh.rotation.y = p.legs[k][1]
      l.calf.rotation.y = p.legs[k][2]
    })
  }

  const commit = () => {
    rigs.forEach((r, i) => {
      r.root.updateMatrixWorld(true)
      for (const p of ['base_black', 'base_white', 'base_gray'] as const)
        meshes[p].setMatrixAt(i, r.base.matrixWorld)
      r.legs.forEach((l, k) => {
        meshes.hip_metal.setMatrixAt(i * 4 + k, l.shell.matrixWorld)
        meshes.hip_gray.setMatrixAt(i * 4 + k, l.shell.matrixWorld)
        const left = LEGS[k].side > 0
        const slot = i * 2 + (k < 2 ? 0 : 1)
        const m = left ? '' : 'm'
        meshes[`thigh${m}_metal`].setMatrixAt(slot, l.thigh.matrixWorld)
        meshes[`thigh${m}_gray`].setMatrixAt(slot, l.thigh.matrixWorld)
        meshes[`calf${m}_gray`].setMatrixAt(slot, l.calf.matrixWorld)
        meshes[`calf${m}_black`].setMatrixAt(slot, l.calf.matrixWorld)
      })
    })
    for (const p of PARTS) meshes[p].instanceMatrix.needsUpdate = true
  }

  return {
    group,
    set,
    commit,
    dispose: () => {
      for (const p of PARTS) meshes[p].dispose()
      Object.values(mat).forEach((m) => m.dispose())
    },
  }
}
