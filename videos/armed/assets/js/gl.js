/*
 * ARMED: the persistent three.js layer under every scene.
 * One renderer, six shots chosen by time: the macro arm, the flip and lens
 * dive, the FPV run, the panorama sheet that curls into a sphere, the swarm,
 * and the hero hover. The airframe is "Eachine E58 Pocket Drone" by
 * the_Thorminator (CC BY 4.0). Rendered only from HyperFrames time (hf-seek).
 */
import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const A = window.ARMED
const { clamp, lerp, prog, E, beat, B, BAR, hash, noise } = A

const canvas = document.getElementById('gl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(1920, 1080, false)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.setClearColor(0x000000, 0)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(32, 1920 / 1080, 0.02, 200)
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.add(new THREE.HemisphereLight(0xffe9dc, 0x1a0f0e, 1.1))
const key = new THREE.DirectionalLight(0xfff3e8, 2.4)
key.position.set(3.5, 5, 4)
scene.add(key)
const rim = new THREE.DirectionalLight(0xc9686a, 2.8)
rim.position.set(-4, 1.5, -3.5)
scene.add(rim)

const BURGUNDY = new THREE.Color('#c9686a')

/* ------------------------------------------------ terrain (the site's contour field) */
const terrainMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: { uTime: { value: 0 }, uShift: { value: 0 }, uColor: { value: BURGUNDY }, uOpacity: { value: 0 }, uNear: { value: 1.5 }, uGrid: { value: 0.1 }, uFar: { value: 42 } },
  vertexShader: /* glsl */ `
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
    }`,
  fragmentShader: /* glsl */ `
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
    }`,
})
const terrainGeo = new THREE.PlaneGeometry(90, 70, 300, 240)
terrainGeo.rotateX(-Math.PI / 2)
const terrain = new THREE.Mesh(terrainGeo, terrainMat)
terrain.frustumCulled = false
scene.add(terrain)

/* ------------------------------------------------ speed motes (FPV run) */
const MOTES = 420
const moteGeo = new THREE.BufferGeometry()
const moteBase = new Float32Array(MOTES * 3)
for (let i = 0; i < MOTES; i++) {
  moteBase[i * 3] = (hash(i, 11) - 0.5) * 14
  moteBase[i * 3 + 1] = (hash(i, 12) - 0.35) * 4
  moteBase[i * 3 + 2] = -hash(i, 13) * 40
}
moteGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MOTES * 3), 3))
const moteMat = new THREE.PointsMaterial({ color: 0xfbf5ea, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false })
const motes = new THREE.Points(moteGeo, moteMat)
motes.frustumCulled = false
scene.add(motes)

/* ------------------------------------------------ the panorama sheet → sphere */
const PANO_R = 1
const panoMat = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  toneMapped: false,
  uniforms: { uMap: { value: null }, uMorph: { value: 0 }, uOpacity: { value: 1 }, uR: { value: PANO_R }, uGlow: { value: 0 } },
  vertexShader: /* glsl */ `
    uniform float uMorph; uniform float uR;
    varying vec2 vUv; varying float vK;
    void main() {
      vUv = uv;
      float lon = (uv.x - 0.5) * 6.28318530718;
      float lat = (uv.y - 0.5) * 3.14159265359;
      vec3 flat3 = vec3(lon * uR, lat * uR, uR);
      vec3 sph = uR * vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
      // the sheet curls from its centre outward, like paper wrapping a ball
      float k = clamp(uMorph * 1.75 - abs(lon) / 3.14159265 * 0.75, 0.0, 1.0);
      k = k * k * (3.0 - 2.0 * k);
      vK = k;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(flat3, sph, k), 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D uMap; uniform float uOpacity; uniform float uGlow;
    varying vec2 vUv; varying float vK;
    void main() {
      vec4 c = texture2D(uMap, vUv);
      float shade = gl_FrontFacing ? 1.0 : 0.42;
      vec3 col = c.rgb * shade;
      // a burgundy seam where the sheet is bending
      float bend = vK * (1.0 - vK) * 4.0;
      col = mix(col, vec3(0.79, 0.41, 0.42), bend * 0.35 * uGlow);
      gl_FragColor = vec4(col, uOpacity);
      #include <colorspace_fragment>
    }`,
})
const pano = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 256, 128), panoMat)
pano.frustumCulled = false
scene.add(pano)

/* ------------------------------------------------ the E58 */
const HUBS = [
  [-0.055, 0.0141, -0.0391],
  [0.0546, 0.0138, -0.039],
  [0.0499, -0.0001, 0.0414],
  [-0.0504, -0.0001, 0.0415],
]
const LENS = [-0.0003, -0.0012, -0.0379]
const PROP_R = 0.0262
const diag = Math.max(Math.hypot(HUBS[0][0] - HUBS[2][0], HUBS[0][2] - HUBS[2][2]), Math.hypot(HUBS[1][0] - HUBS[3][0], HUBS[1][2] - HUBS[3][2]))
const K = 2.1 / diag

function blurTexture() {
  const n = 256
  const c = document.createElement('canvas')
  c.width = c.height = n
  const g = c.getContext('2d')
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
const blurGeo = new THREE.CircleGeometry(PROP_R * 0.98, 48)
blurGeo.rotateX(-Math.PI / 2)
const blurTex = blurTexture()

// the body mesh with its four propellers lifted out into their own pivots,
// so the blades can actually turn (split once from the measured hubs)
function splitProps(geo) {
  const pos = geo.attributes.position
  const index = geo.index ? geo.index.array : [...Array(pos.count).keys()]
  const keep = []
  const props = HUBS.map(() => [])
  const c = new THREE.Vector3()
  for (let i = 0; i < index.length; i += 3) {
    c.set(0, 0, 0)
    for (let k = 0; k < 3; k++) c.x += pos.getX(index[i + k]) / 3, c.y += pos.getY(index[i + k]) / 3, c.z += pos.getZ(index[i + k]) / 3
    let owner = -1
    HUBS.forEach(([hx, hy, hz], h) => {
      if (owner < 0 && Math.hypot(c.x - hx, c.z - hz) < PROP_R && c.y > hy - 0.0016) owner = h
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
  return { body, propGeos, counts: props.map((p) => p.length / 3), kept: keep.length / 3 }
}

let template = null // { bodyGeo, bodyMat, lensGeo, lensMat, lensLite, propGeos, centre }

function makeAirframe({ lite = false } = {}) {
  const rig = new THREE.Group()
  rig.rotation.order = 'YZX'
  const turn = new THREE.Group()
  turn.rotation.y = -Math.PI / 2
  turn.scale.setScalar(K)
  turn.position.copy(template.centre)
  rig.add(turn)
  turn.add(new THREE.Mesh(template.bodyGeo, template.bodyMat))
  turn.add(new THREE.Mesh(template.lensGeo, lite ? template.lensLite : template.lensMat))
  const blurMat = new THREE.MeshBasicMaterial({ map: blurTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0 })
  const props = []
  const discs = []
  HUBS.forEach(([x, y, z], h) => {
    const pivot = new THREE.Group()
    pivot.position.set(x, y, z)
    pivot.add(new THREE.Mesh(template.propGeos[h], template.bodyMat))
    turn.add(pivot)
    props.push(pivot)
    const d = new THREE.Mesh(blurGeo, blurMat)
    d.position.set(x, y + 0.0024, z)
    turn.add(d)
    discs.push(d)
  })
  const lens = new THREE.Object3D()
  lens.position.set(...LENS)
  turn.add(lens)
  rig.userData = { turn, props, discs, blurMat, lens }
  return rig
}

// blade angle + blur by spin rate (rad/s)
function spin(af, angle, rate, alpha = 1) {
  const { props, discs, blurMat } = af.userData
  const fast = clamp((rate - 40) / 70)
  props.forEach((p, i) => {
    p.rotation.y = angle * (i % 2 === 0 ? 1 : -1)
    p.children[0].visible = fast < 0.92
  })
  discs.forEach((d, i) => (d.rotation.y = angle * 0.37 * (i % 2 === 0 ? 1 : -1)))
  blurMat.opacity = 0.95 * fast * alpha
}

let hero = null
const SWARM_N = 36
const swarm = []

let ready = false
const load = (async () => {
  const loader = new GLTFLoader()
  const draco = new DRACOLoader()
  draco.setDecoderPath('assets/vendor/draco/')
  loader.setDRACOLoader(draco)
  const gltf = await loader.loadAsync('assets/models/eachine-e58.glb')
  draco.dispose()
  const meshes = []
  gltf.scene.traverse((o) => o.isMesh && meshes.push(o))
  gltf.scene.updateMatrixWorld(true)
  for (const m of meshes) {
    m.quaternion.identity()
    m.updateMatrix()
    m.geometry.applyMatrix4(m.matrix)
  }
  const bodyMesh = meshes.find((m) => /Blackplane/.test(m.name)) || meshes[0]
  const lensMesh = meshes.find((m) => m !== bodyMesh)
  const split = splitProps(bodyMesh.geometry)
  window.__armedPropSplit = { counts: split.counts, kept: split.kept }
  const bodyMat = bodyMesh.material
  bodyMat.envMapIntensity = 1.7
  const lensMat = lensMesh.material
  lensMat.envMapIntensity = 1.7
  const lensLite = lensMat.clone()
  lensLite.transmission = 0
  lensLite.transparent = true
  lensLite.opacity = 0.75
  // centre of the airframe in model space (hub centroid, mid-height)
  const box = new THREE.Box3().setFromBufferAttribute(bodyMesh.geometry.attributes.position)
  const centre = new THREE.Vector3(0, (box.min.y + box.max.y) / 2, 0)
  HUBS.forEach(([x, , z]) => {
    centre.x += x / 4
    centre.z += z / 4
  })
  centre.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).multiplyScalar(-K)
  template = { bodyGeo: split.body, bodyMat, lensGeo: lensMesh.geometry, lensMat, lensLite, propGeos: split.propGeos, centre }

  hero = makeAirframe()
  scene.add(hero)
  for (let i = 0; i < SWARM_N; i++) {
    const af = makeAirframe({ lite: true })
    af.scale.setScalar(0.34)
    scene.add(af)
    swarm.push(af)
  }
  const panoTex = await new THREE.TextureLoader().loadAsync('assets/img/pano-equirect.jpg')
  panoTex.colorSpace = THREE.SRGBColorSpace
  panoTex.anisotropy = 8
  panoMat.uniforms.uMap.value = panoTex
  renderer.compile(scene, camera)
  ready = true
  render(window.__hfThreeTime || 0)
})()

window.__hf = window.__hf || {}
window.__hf.buildReady = window.__hf.buildReady || {}
window.__hf.buildReady['armed-gl'] = load

/* ------------------------------------------------ shots */
const V = (x, y, z) => new THREE.Vector3(x, y, z)

function hideAll() {
  terrain.visible = false
  motes.visible = false
  pano.visible = false
  if (hero) hero.visible = false
  swarm.forEach((s) => (s.visible = false))
}

function lookAt(pos, target, fov, roll = 0) {
  camera.position.copy(pos)
  camera.up.set(0, 1, 0)
  camera.lookAt(target)
  if (roll) camera.rotateZ(roll)
  if (camera.fov !== fov) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
  camera.updateMatrixWorld(true)
}

function poseHero(f) {
  hero.position.set(f.x, f.y, f.z)
  hero.rotation.set(f.roll, f.yaw, f.pitch, 'YZX')
  hero.updateMatrixWorld(true)
}

// frames 1–2: arm on a macro, pull back, lift, punch out; enter, flip, dive at the lens
function droneShot(t) {
  const f = A.flight(t)
  hero.visible = true
  hero.scale.setScalar(1)
  terrain.visible = true
  terrain.position.set(0, -2.5, -10)
  terrainMat.uniforms.uTime.value = t * 0.5
  terrainMat.uniforms.uShift.value = t < BAR ? 0 : (t - BAR) * 2.2
  terrainMat.uniforms.uNear.value = 1.5
  terrainMat.uniforms.uGrid.value = 0.1
  terrainMat.uniforms.uFar.value = 42
  const rate = f.thr > 0 ? 18 + f.thr * 150 : 0
  spin(hero, A.bladeAngle(t), rate)

  if (t < BAR) {
    terrainMat.uniforms.uOpacity.value = 0.25 + 0.6 * E.out(prog(t, beat(2), beat(3)))
    poseHero(f)
    const hub = hero.userData.props[1].getWorldPosition(V(0, 0, 0))
    // macro on the front prop, then a hard pull-back on beat 2
    const macroPos = hub.clone().add(V(0.38, 0.2, 0.55))
    const macroLook = hub.clone().add(V(-0.05, -0.03, 0))
    const wideLook = V(0, Math.min(f.y, 0.62) * 0.8 + 0.05, 0)
    const widePos = V(2.5, 1.0 + Math.min(f.y, 0.62) * 0.6, 3.7)
    const pull = E.out(prog(t, beat(2), beat(2) + 0.42))
    const drift = 0.04 * Math.sin(t * 1.3)
    const pos = macroPos.lerp(widePos, pull)
    pos.x += drift
    const look = macroLook.lerp(wideLook, pull)
    // the punch-out: the camera tips up after it, a beat late
    look.y += 1.4 * E.in(prog(t, 1.72, BAR))
    lookAt(pos, look, lerp(30, 34, pull))
    return
  }

  // frame 2
  terrainMat.uniforms.uOpacity.value = 0.7
  const C = V(0, 0.75, 7.2)
  const baseLook = V(0, 0.35, 0)
  const push = E.out(prog(t, beat(5), 2.9))
  const pos = C.clone().add(V(-0.25 * push, -0.1 * push, -0.9 * push))
  poseHero(f)
  if (f.dive > 0) {
    // slide the airframe so its lens runs down the line into the camera
    const lens0 = hero.userData.lens.getWorldPosition(V(0, 0, 0))
    const dir = pos.clone().sub(lens0)
    const end = pos.clone().sub(dir.clone().normalize().multiplyScalar(0.075))
    const lensT = lens0.clone().lerp(end, f.dive)
    hero.position.add(lensT.sub(lens0))
    hero.updateMatrixWorld(true)
  }
  const lensNow = hero.userData.lens.getWorldPosition(V(0, 0, 0))
  const look = baseLook.clone().lerp(lensNow, E.inOut(prog(t, 2.95, 3.32)))
  lookAt(pos, look, lerp(34, 30, push), 0.06 * Math.sin(f.roll))
}

// frame 3: the FPV feed. Low and fast over the contour field
function fpvShot(t) {
  const l = t - 2 * BAR
  terrain.visible = true
  terrain.position.set(0, -2.1, -24)
  terrainMat.uniforms.uOpacity.value = 1.7
  terrainMat.uniforms.uTime.value = 40 + l * 24
  terrainMat.uniforms.uShift.value = 6 * Math.sin(l * 0.7)
  terrainMat.uniforms.uNear.value = 0.3
  terrainMat.uniforms.uGrid.value = 0.42
  terrainMat.uniforms.uFar.value = 34
  motes.visible = true
  const p = moteGeo.attributes.position
  for (let i = 0; i < MOTES; i++) {
    const z = ((((moteBase[i * 3 + 2] + l * 26) % 40) + 40) % 40) - 40
    p.setXYZ(i, moteBase[i * 3], moteBase[i * 3 + 1], z)
  }
  p.needsUpdate = true
  const bank = 0.09 * Math.sin(l * 2.1) + 0.05 * Math.sin(l * 5.3)
  const kick = Math.exp(-Math.max(0, l) * 9) * 0.25
  lookAt(V(0, 0.1 + kick, 0), V(0.4 * Math.sin(l * 0.9), -1.55, -8), 78, bank)
}

// frame 5: the flat panorama hands over from the DOM, curls into a sphere, spins
const PANO_D = (Math.PI * PANO_R) / (Math.tan((32 / 2) * (Math.PI / 180)) * (1920 / 1080))
function panoShot(t) {
  pano.visible = true
  const m = E.inOut(prog(t, 8.45, 8.98))
  panoMat.uniforms.uMorph.value = m
  panoMat.uniforms.uGlow.value = 1
  panoMat.uniforms.uOpacity.value = prog(t, 8.4, 8.44)
  const spinA = 0.35 * E.out(prog(t, 8.7, 9.0)) + Math.PI * 2.2 * E.in(prog(t, 8.95, 5 * BAR))
  pano.rotation.set(0.32 * m, -spinA, 0.12 * m)
  pano.position.set(0, 0, 0)
  const push = E.inOut(prog(t, 8.9, 5 * BAR))
  const camZ = lerp(PANO_D + PANO_R, 4.2, push)
  lookAt(V(0, 0, camZ), V(0, 0, 0), 32)
}

// frame 8: the swarm. Burst, wall, ring, helix, then out at the lens
function formation(i, t) {
  const n = SWARM_N
  const g = (2.399963 * i) % (Math.PI * 2)
  const fy = 1 - (2 * (i + 0.5)) / n
  const fr = Math.sqrt(1 - fy * fy)
  const burst = V(Math.cos(g) * fr * 3.4, fy * 2.2, Math.sin(g) * fr * 3.4)
  const col = i % 6
  const row = Math.floor(i / 6)
  const wall = V((col - 2.5) * 1.05, (2.5 - row) * 0.62, 0)
  const l = t - 6 * BAR
  const ringA = (i / n) * Math.PI * 2 + l * 1.4
  const ring = V(Math.cos(ringA) * 3.3, 0.25 + 0.35 * Math.sin(ringA * 3), Math.sin(ringA) * 3.3)
  const helA = i * 0.52 + l * 2.2
  const helix = V(Math.cos(helA) * 1.5, -1.9 + i * 0.11, Math.sin(helA) * 1.5)
  const d = (i % 9) * 0.009
  const s1 = E.out(prog(t, beat(25) + d, beat(25) + d + 0.32))
  const s2 = E.out(prog(t, beat(26) + d, beat(26) + d + 0.32))
  const s3 = E.out(prog(t, beat(27) + d, beat(27) + d + 0.32))
  const burstK = E.out(prog(t, beat(24), beat(24) + 0.42))
  const p = V(0, 0, 0).lerp(burst, burstK)
  p.lerp(wall, s1).lerp(ring, s2).lerp(helix, s3)
  // out: everyone breaks for the camera
  const out = E.in(prog(t, 12.92 + (i % 7) * 0.012, 7 * BAR))
  p.add(V(p.x * 2.2 * out, p.y * 1.4 * out, 9 * out))
  return p
}
function swarmShot(t) {
  const l = t - 6 * BAR
  terrain.visible = true
  terrain.position.set(0, -3.6, -8)
  terrainMat.uniforms.uOpacity.value = 0.55
  terrainMat.uniforms.uTime.value = 30 + l * 3
  terrainMat.uniforms.uShift.value = l * 1.5
  terrainMat.uniforms.uNear.value = 1.5
  terrainMat.uniforms.uGrid.value = 0.16
  terrainMat.uniforms.uFar.value = 42
  swarm.forEach((af, i) => {
    af.visible = true
    const p = formation(i, t)
    const q = formation(i, t + 1 / 60)
    const v = q.clone().sub(p).multiplyScalar(60)
    af.position.copy(p)
    // face the camera-ish, bank into the velocity
    const yaw = -Math.PI / 2 + 0.25 * Math.sin(i * 1.7) + clamp(v.x * 0.03, -0.6, 0.6)
    af.rotation.set(clamp(-v.x * 0.025, -0.7, 0.7), yaw, clamp(-v.z * 0.02 + v.y * 0.02, -0.6, 0.6), 'YZX')
    af.position.y += 0.05 * Math.sin(l * 7 + i)
    spin(af, l * 160 + i, 150, 1)
  })
  const orbit = lerp(-0.55, 0.5, E.soft(prog(t, 6 * BAR, 7 * BAR)))
  const R = lerp(8.6, 7.6, prog(t, 6 * BAR, 7 * BAR))
  lookAt(V(Math.sin(orbit) * R, 1.15 + 0.6 * prog(t, beat(27), 7 * BAR), Math.cos(orbit) * R), V(0, -0.1, 0), 40, 0.04 * Math.sin(l * 2.3))
}

// frame 9: the hero hovers over the lockup, then punches out on the last beat
function heroShot(t) {
  const l = t - 7 * BAR
  hero.visible = true
  hero.scale.setScalar(0.5)
  const arrive = E.out(prog(t, 7 * BAR, 7 * BAR + 0.5))
  const leave = E.in(prog(t, beat(31), beat(31) + 0.42))
  hero.position.set(lerp(3.6, 2.02, arrive) + 0.6 * leave, lerp(2.4, 1.22, arrive) + 0.04 * Math.sin(l * 3.1) + 3.2 * leave, 0)
  hero.rotation.set(0.05 * Math.sin(l * 2.3) - 0.25 * (1 - arrive), -0.95 + 0.06 * Math.sin(l * 1.7), 0.12 + 0.3 * leave, 'YZX')
  hero.updateMatrixWorld(true)
  spin(hero, l * 150, 150)
  lookAt(V(0, 0, 7), V(0, 0, 0), 30)
}

let cleared = false
function render(t) {
  if (!ready) return
  hideAll()
  let drew = true
  if (t < 2 * BAR) droneShot(t)
  else if (t < 3 * BAR) fpvShot(t)
  else if (t >= 8.4 && t < 5 * BAR) panoShot(t)
  else if (t >= 6 * BAR && t < 7 * BAR) swarmShot(t)
  else if (t >= 7 * BAR && t < beat(31) + 0.5) heroShot(t)
  else drew = false
  if (!drew) {
    if (!cleared) {
      renderer.clear()
      cleared = true
    }
    return
  }
  cleared = false
  renderer.render(scene, camera)
}

window.__armedGL = { render, ready: () => ready }
window.addEventListener('hf-seek', (e) => render(e.detail.time))
