import * as THREE from 'three'

/**
 * The quadrotor, as pure geometry.
 *
 * Proportions here are the ones from the hero build — do not retune them
 * casually. This module knows nothing about scenes, cameras or scroll: it
 * returns a group plus named handles on every part so behaviors can drive them.
 */

export const DRONE_COLORS = {
  body: 0x1a1e24,
  dark: 0x0f1216,
  metal: 0x2c333b,
  shell: 0x323a44,
  arm: 0x232931,
  blade: 0x39424c,
  lens: 0x05070a,
  live: 0xc8291f,
} as const

export interface DroneParts {
  /** the whole machine */
  group: THREE.Group
  /** spinning rotor assemblies, each with userData.dir = +1 | -1 */
  rotors: THREE.Group[]
  /** one group per arm, already yawed into place */
  booms: THREE.Group[]
  hull: THREE.Mesh
  shell: THREE.Mesh
  nose: THREE.Mesh
  bay: THREE.Mesh
  gimbal: THREE.Group
  skids: THREE.Group
  mast: THREE.Mesh
  /** red nav lamps — behaviors may pulse these */
  navLights: THREE.Mesh[]
  /** every material, so a variant can retint the whole machine at once */
  materials: Record<string, THREE.Material>
  dispose: () => void
}

export interface BuildDroneOptions {
  /** line-art rendering instead of solid shading */
  wireframe?: boolean
  /** fewer segments for swarm instances */
  lowPoly?: boolean
  /** park the rotors instead of leaving them axis-aligned */
  parked?: boolean
}

export function buildDrone(options: BuildDroneOptions = {}): DroneParts {
  const { wireframe = false, lowPoly = false, parked = false } = options

  const group = new THREE.Group()
  const rotors: THREE.Group[] = []
  const booms: THREE.Group[] = []
  const navLights: THREE.Mesh[] = []
  const disposables: Array<THREE.BufferGeometry | THREE.Material> = []

  const track = <T extends THREE.BufferGeometry | THREE.Material>(x: T) => {
    disposables.push(x)
    return x
  }

  const seg = (full: number, low: number) => (lowPoly ? low : full)

  const std = (color: number, roughness: number, metalness: number) =>
    track(
      wireframe
        ? new THREE.MeshBasicMaterial({ color: 0x8a99a3, wireframe: true })
        : new THREE.MeshStandardMaterial({ color, roughness, metalness })
    )

  const bodyMat = std(DRONE_COLORS.body, 0.62, 0.34)
  const darkMat = std(DRONE_COLORS.dark, 0.78, 0.2)
  const metalMat = std(DRONE_COLORS.metal, 0.34, 0.86)
  const shellMat = std(DRONE_COLORS.shell, 0.44, 0.52)
  const armMat = std(DRONE_COLORS.arm, 0.6, 0.42)
  const bladeMat = std(DRONE_COLORS.blade, 0.5, 0.4)
  const lensMat = std(DRONE_COLORS.lens, 0.08, 0.95)
  const liveMat = track(new THREE.MeshBasicMaterial({ color: DRONE_COLORS.live }))

  const materials: Record<string, THREE.Material> = {
    body: bodyMat,
    dark: darkMat,
    metal: metalMat,
    shell: shellMat,
    arm: armMat,
    blade: bladeMat,
    lens: lensMat,
    live: liveMat,
  }

  // --- fuselage -----------------------------------------------------------
  const hull = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(0.2, 0.66, 6, seg(20, 10))),
    bodyMat
  )
  hull.rotation.z = Math.PI / 2
  hull.scale.set(1, 0.74, 0.92)
  group.add(hull)

  const shell = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(0.17, 0.5, 5, seg(18, 9))),
    shellMat
  )
  shell.rotation.z = Math.PI / 2
  shell.scale.set(1, 0.5, 0.86)
  shell.position.y = 0.1
  group.add(shell)

  const nose = new THREE.Mesh(track(new THREE.ConeGeometry(0.16, 0.3, seg(18, 9))), bodyMat)
  nose.rotation.z = -Math.PI / 2
  nose.position.set(0.58, 0, 0)
  nose.scale.set(1, 1, 0.86)
  group.add(nose)

  const bay = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 0.05, 0.26)), darkMat)
  bay.position.y = 0.2
  group.add(bay)

  // --- booms --------------------------------------------------------------
  const armGeo = track(new THREE.CylinderGeometry(0.032, 0.042, 0.98, seg(12, 6)))
  const nacelleGeo = track(new THREE.CylinderGeometry(0.075, 0.095, 0.17, seg(18, 8)))
  const hubGeo = track(new THREE.CylinderGeometry(0.032, 0.038, 0.055, seg(12, 6)))
  const bladeGeo = track(new THREE.BoxGeometry(0.84, 0.007, 0.048))
  const guardGeo = track(new THREE.TorusGeometry(0.46, 0.0055, 6, seg(44, 20)))
  const strutGeo = track(new THREE.BoxGeometry(0.46, 0.008, 0.008))
  const navGeo = track(new THREE.SphereGeometry(0.019, 8, 8))

  for (let i = 0; i < 4; i += 1) {
    const boom = new THREE.Group()
    boom.rotation.y = Math.PI / 4 + (i * Math.PI) / 2
    boom.userData.index = i
    // unit vector the exploded view pushes this boom along
    boom.userData.axis = new THREE.Vector3(1, 0, 0)

    const arm = new THREE.Mesh(armGeo, armMat)
    arm.rotation.z = Math.PI / 2
    arm.position.set(0.52, 0.01, 0)
    boom.add(arm)

    const nacelle = new THREE.Mesh(nacelleGeo, metalMat)
    nacelle.position.set(0.97, 0.07, 0)
    boom.add(nacelle)

    const rotor = new THREE.Group()
    rotor.position.set(0.97, 0.17, 0)
    rotor.add(new THREE.Mesh(hubGeo, metalMat))
    for (let b = 0; b < 2; b += 1) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat)
      blade.rotation.y = (b * Math.PI) / 2
      blade.rotation.z = 0.16
      blade.scale.z = 1 - b * 0.04
      rotor.add(blade)
    }
    rotor.userData.dir = i % 2 === 0 ? 1 : -1
    rotors.push(rotor)
    boom.add(rotor)

    const guard = new THREE.Mesh(guardGeo, armMat)
    guard.position.set(0.97, 0.17, 0)
    guard.rotation.x = Math.PI / 2
    boom.add(guard)

    for (let s = 0; s < 2; s += 1) {
      const strut = new THREE.Mesh(strutGeo, armMat)
      strut.position.set(0.8, 0.17, 0)
      strut.rotation.y = s === 0 ? 0.42 : -0.42
      boom.add(strut)
    }

    if (i === 0 || i === 3) {
      const nav = new THREE.Mesh(navGeo, liveMat)
      nav.position.set(0.97, 0.01, 0)
      navLights.push(nav)
      boom.add(nav)
    }

    booms.push(boom)
    group.add(boom)
  }

  // --- sensor gimbal ------------------------------------------------------
  const gimbal = new THREE.Group()
  const yoke = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.12, 0.014, 8, seg(20, 10))),
    metalMat
  )
  yoke.position.set(0, 0.04, 0)
  yoke.rotation.y = Math.PI / 2
  gimbal.add(yoke)

  const pod = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, seg(20, 10), seg(16, 8))), bodyMat)
  gimbal.add(pod)

  const lens = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.055, 0.062, 0.07, seg(20, 10))),
    lensMat
  )
  lens.position.set(0.08, -0.02, 0)
  lens.rotation.z = Math.PI / 2 - 0.28
  gimbal.add(lens)

  gimbal.position.set(0.22, -0.21, 0)
  group.add(gimbal)

  // --- skids --------------------------------------------------------------
  const skids = new THREE.Group()
  const skidGeo = track(new THREE.BoxGeometry(0.86, 0.022, 0.022))
  const legGeo = track(new THREE.BoxGeometry(0.022, 0.2, 0.022))
  for (let s = 0; s < 2; s += 1) {
    const z = s === 0 ? 0.26 : -0.26
    const skid = new THREE.Mesh(skidGeo, darkMat)
    skid.position.set(0, -0.34, z)
    skids.add(skid)
    for (let l = 0; l < 2; l += 1) {
      const leg = new THREE.Mesh(legGeo, darkMat)
      leg.position.set(l === 0 ? 0.28 : -0.28, -0.25, z)
      skids.add(leg)
    }
  }
  group.add(skids)

  // --- antenna ------------------------------------------------------------
  const mast = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6)),
    metalMat
  )
  mast.position.set(-0.46, 0.3, 0)
  mast.rotation.z = -0.2
  group.add(mast)

  if (parked) {
    rotors.forEach((r, i) => {
      r.rotation.y = 0.4 + i * 0.3
    })
  }

  // rest pose, so behaviors can offset from a known origin
  group.traverse((o) => {
    o.userData.restPosition = o.position.clone()
  })

  return {
    group,
    rotors,
    booms,
    hull,
    shell,
    nose,
    bay,
    gimbal,
    skids,
    mast,
    navLights,
    materials,
    dispose: () => disposables.forEach((d) => d.dispose()),
  }
}
