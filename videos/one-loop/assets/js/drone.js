/*
 * Frame 1's 3D layer: the Eachine E58 ("Eachine E58 Pocket Drone" by
 * the_Thorminator, CC BY 4.0) over the site's burgundy contour terrain.
 * Rendered from HyperFrames time only (hf-seek). The drone's camera lens is
 * pinned to the signal's head on screen, so the roll telemetry the line draws
 * is literally where the lens has been.
 */
import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const O = window.OneLoop
const canvas = document.getElementById('drone-gl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(1920, 1080, false)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.setClearColor(0x000000, 0)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.05, 100)
camera.position.set(0, 1.5, 6.4)
camera.lookAt(0, -0.2, 0)
camera.updateMatrixWorld(true)

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.add(new THREE.HemisphereLight(0xffe9dc, 0x1a0f0e, 1.1))
const key = new THREE.DirectionalLight(0xfff3e8, 2.4)
key.position.set(3.5, 5, 4)
scene.add(key)
const rim = new THREE.DirectionalLight(0xc9686a, 2.6)
rim.position.set(-4, 1.5, -3.5)
scene.add(rim)

/* ---------------- terrain: the site's contour field, scrolled with the camera */
const terrainMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: { uTime: { value: 0 }, uShift: { value: 0 }, uColor: { value: new THREE.Color('#c9686a') }, uOpacity: { value: 0 } },
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
      vec3 pos = position; vec2 q = pos.xz + vec2(uShift, -uTime * 0.6);
      pos.y += terrain(q); vHeight = pos.y; vGrid = q * 0.5;
      vec4 view = viewMatrix * modelMatrix * vec4(pos, 1.0); vDist = -view.z;
      gl_Position = projectionMatrix * view;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor; uniform float uOpacity;
    varying float vHeight; varying float vDist; varying vec2 vGrid;
    void main() {
      float k = vHeight * 4.0;
      float contour = 1.0 - min(abs(fract(k - 0.5) - 0.5) / fwidth(k), 1.0);
      float major = 1.0 - min(abs(fract(k / 5.0 - 0.5) - 0.5) / fwidth(k / 5.0), 1.0);
      vec2 g = abs(fract(vGrid - 0.5) - 0.5) / fwidth(vGrid);
      float grid = 1.0 - min(min(g.x, g.y), 1.0);
      float fade = smoothstep(32.0, 7.0, vDist) * smoothstep(1.5, 5.0, vDist);
      float a = (contour * 0.55 + major * 0.5 + grid * 0.08) * fade * uOpacity;
      if (a < 0.003) discard;
      gl_FragColor = vec4(uColor, a);
    }`,
})
const terrainGeo = new THREE.PlaneGeometry(70, 52, 240, 180)
terrainGeo.rotateX(-Math.PI / 2)
const terrain = new THREE.Mesh(terrainGeo, terrainMat)
terrain.position.set(0, -2.6, -14)
scene.add(terrain)

/* ---------------- the E58 (geometry measured from the mesh, nose along -z) */
const HUBS = [
  [-0.055, 0.0141, -0.0391],
  [0.0546, 0.0138, -0.039],
  [0.0499, -0.0001, 0.0414],
  [-0.0504, -0.0001, 0.0415],
]
const LENS = [-0.0003, -0.0012, -0.0379]
const rig = new THREE.Group()
const turn = new THREE.Group()
turn.rotation.y = -Math.PI / 2
rig.add(turn)
scene.add(rig)
const lensAnchor = new THREE.Object3D()
lensAnchor.position.set(...LENS)
turn.add(lensAnchor)

function blurTexture() {
  const n = 256
  const c = document.createElement('canvas')
  c.width = c.height = n
  const g = c.getContext('2d')
  const r = n / 2
  g.translate(r, r)
  const disc = g.createRadialGradient(0, 0, r * 0.12, 0, 0, r)
  disc.addColorStop(0, 'rgba(251,245,234,0.02)')
  disc.addColorStop(0.85, 'rgba(251,245,234,0.1)')
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
const blurGeo = new THREE.CircleGeometry(0.025, 48)
blurGeo.rotateX(-Math.PI / 2)
const blurMat = new THREE.MeshBasicMaterial({ map: blurTexture(), transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0.9 })
const discs = HUBS.map(([x, y, z]) => {
  const d = new THREE.Mesh(blurGeo, blurMat)
  d.position.set(x, y + 0.0022, z)
  turn.add(d)
  return d
})

// normalise: prop-to-prop diagonal of 2.1 units, centred on the hubs
const diag = Math.max(Math.hypot(HUBS[0][0] - HUBS[2][0], HUBS[0][2] - HUBS[2][2]), Math.hypot(HUBS[1][0] - HUBS[3][0], HUBS[1][2] - HUBS[3][2]))
const K = 2.1 / diag
turn.scale.setScalar(K)

let ready = false
const load = (async () => {
  const loader = new GLTFLoader()
  const draco = new DRACOLoader()
  draco.setDecoderPath('assets/vendor/draco/')
  loader.setDRACOLoader(draco)
  const gltf = await loader.loadAsync('assets/models/eachine-e58.glb')
  draco.dispose()
  const model = gltf.scene
  model.traverse((o) => {
    if (o.isMesh) {
      o.quaternion.identity()
      o.material.envMapIntensity = 1.7
    }
  })
  turn.add(model)
  model.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(model)
  const centre = new THREE.Vector3(0, (box.min.y + box.max.y) / 2 / K, 0)
  HUBS.forEach(([x, , z]) => {
    centre.x += x / 4
    centre.z += z / 4
  })
  turn.position.copy(centre.applyAxisAngle(new THREE.Vector3(0, 1, 0), turn.rotation.y).multiplyScalar(-K))
  // shaders compile now, so the first sought frame is already drawable
  renderer.compile(scene, camera)
  ready = true
  render(window.__hfThreeTime || 0)
})()

window.__hf = window.__hf || {}
window.__hf.buildReady = window.__hf.buildReady || {}
window.__hf.buildReady['one-loop-drone'] = load

/* ---------------- time → frame */
const clamp = O.clamp
const ease = O.E
const ray = new THREE.Raycaster()
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const tmp = new THREE.Vector3()

function render(t) {
  if (t > 2.9) {
    if (canvas.dataset.cleared !== '1') {
      renderer.clear()
      canvas.dataset.cleared = '1'
    }
    return
  }
  canvas.dataset.cleared = '0'
  const cam = O.camera(t)
  terrainMat.uniforms.uTime.value = t
  terrainMat.uniforms.uShift.value = (cam.x + 220) * 0.0045
  terrainMat.uniforms.uOpacity.value = ease.out(clamp(t / 0.6, 0, 1)) * (1 - ease.inOut(clamp((t - 2.2) / 0.6, 0, 1)))

  // the airframe: drops in tilted, is caught by the loop, then climbs away at 2.0
  const r = O.roll(t)
  const yaw = -0.55 + 0.18 * Math.sin(t * 0.9)
  rig.rotation.set(r, yaw, 0, 'YZX')
  for (let i = 0; i < 4; i++) discs[i].rotation.y = t * 52 * (i % 2 === 0 ? 1 : -1)

  // pin the lens to the signal's head on screen while the drone is "in" the line
  // after 2.0 the line is freed: the drone keeps its world position and the camera leaves it
  const [hx, hy] = O.head(clamp(t, 0.4, 2.0))
  const sx = (hx - cam.x) * cam.s + 960
  const sy = (hy - cam.y) * cam.s + 540
  const ndc = new THREE.Vector2((sx / 1920) * 2 - 1, -(sy / 1080) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  ray.ray.intersectPlane(plane, tmp)
  rig.position.set(0, 0, 0)
  rig.updateMatrixWorld(true)
  const lens = lensAnchor.getWorldPosition(new THREE.Vector3())
  rig.position.copy(tmp).sub(lens)
  // arrival from above, and a punched climb out once the line is freed: front-loaded
  // so the airframe is clear of the name's cap height before the letters rise under it
  const arrive = 1 - ease.out(clamp((t - 0.05) / 0.5, 0, 1))
  const u = clamp((t - 2.0) / 0.6, 0, 1)
  const climb = 1 - (1 - u) * (1 - u)
  rig.position.y += arrive * 2.4 + climb * 3.6
  rig.position.x -= climb * 0.4
  rig.rotation.y += climb * 0.9

  renderer.render(scene, camera)
}

window.addEventListener('hf-seek', (e) => ready && render(e.detail.time))
window.__oneLoopDrone = { render: (t) => ready && render(t) }
