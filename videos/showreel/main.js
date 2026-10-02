/*
 * Rami Kronbi — 15s showreel.
 * A deterministic composition: renderFrame(t) is a pure function of time, so
 * the renderer can shoot any frame in any order and every frame is identical
 * however it is scheduled. Visual world: the /v2 Engineering Notebook.
 */
import * as THREE from 'three'

import { buildDrone } from './lib/geometry.js'

const TL = await (await fetch('timeline.json')).json()
const W = TL.width
const H = TL.height
const FPS = TL.fps
const stage = document.getElementById('stage')

/* ------------------------------------------------------------------ math */

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const prog = (t, a, b) => clamp((t - a) / (b - a))
const lerp = (a, b, k) => a + (b - a) * k

function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sx = (u) => ((ax * u + bx) * u + cx) * u
  const sy = (u) => ((ay * u + by) * u + cy) * u
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let u = x
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - x
      const d = dx(u)
      if (Math.abs(e) < 1e-7 || Math.abs(d) < 1e-7) break
      u -= e / d
    }
    if (Math.abs(sx(u) - x) > 1e-5) {
      let lo = 0, hi = 1
      u = x
      for (let i = 0; i < 40; i++) {
        if (sx(u) < x) lo = u
        else hi = u
        u = (lo + hi) / 2
      }
    }
    return sy(u)
  }
}
// The animate skill's sanctioned curves: strong ease-out to enter, strong ease-in-out to move.
const eo = cubicBezier(0.23, 1, 0.32, 1)
const eio = cubicBezier(0.77, 0, 0.175, 1)
const ease = (t, a, b, f = eo) => f(prog(t, a, b))

/** Under-damped step response 0 -> 1 (a sheet landing, a dot settling). */
function spring(tau, zeta = 0.84, omega = 15) {
  if (tau <= 0) return 0
  const wd = omega * Math.sqrt(1 - zeta * zeta)
  return 1 - Math.exp(-zeta * omega * tau) * (Math.cos(wd * tau) + ((zeta * omega) / wd) * Math.sin(wd * tau))
}
/** Free response of a PD loop released from `amp` at rest. */
function damped(tau, amp, zeta, omega) {
  if (tau <= 0) return amp
  const wd = omega * Math.sqrt(1 - zeta * zeta)
  return amp * Math.exp(-zeta * omega * tau) * (Math.cos(wd * tau) + ((zeta * omega) / wd) * Math.sin(wd * tau))
}
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------------------------------------------- dom */

function el(tag, o = {}, parent = stage) {
  const n = document.createElement(tag)
  if (o.cls) n.className = o.cls
  if (o.text != null) n.textContent = o.text
  if (o.html != null) n.innerHTML = o.html
  if (o.style) Object.assign(n.style, o.style)
  if (o.attrs) for (const [k, v] of Object.entries(o.attrs)) n.setAttribute(k, v)
  parent.appendChild(n)
  return n
}
const SVGNS = 'http://www.w3.org/2000/svg'
function sv(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v)
  parent.appendChild(n)
  return n
}
const vis = (node, on) => {
  node.style.display = on ? '' : 'none'
  return on
}
const rich = (s) => s.replace(/\*([^*]+)\*/g, '<span class="em">$1</span>')
const typed = (node, full, k) => {
  node.textContent = full.slice(0, Math.round(clamp(k) * full.length))
}

/** Masked lines that rise into place: returns the inner nodes, one per line. */
function maskLines(parent, lines, style, lineStyle = {}) {
  return lines.map((line) => {
    // The mask carries the text's size so em padding is measured in the text's
    // em: room below for descenders, cancelled by a negative margin.
    const m = el('div', {
      cls: 'mask',
      style: { fontSize: style.fontSize, lineHeight: style.lineHeight, paddingBottom: '0.24em', marginBottom: '-0.24em', paddingRight: '0.12em', ...lineStyle },
    }, parent)
    return el('div', { html: rich(line), style: { ...style, willChange: 'transform' } }, m)
  })
}

/** A polyline drawn to fraction k of its length. */
function partial(points, k) {
  const segs = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    segs.push(l)
    total += l
  }
  let left = total * clamp(k)
  const out = [points[0]]
  for (let i = 1; i < points.length; i++) {
    if (left <= 0) break
    const l = segs[i - 1]
    if (left >= l) {
      out.push(points[i])
      left -= l
    } else {
      const f = left / l
      out.push([lerp(points[i - 1][0], points[i][0], f), lerp(points[i - 1][1], points[i][1], f)])
      left = 0
    }
  }
  return out.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}

/* ====================================================================== */
/* GL: contour terrain + the procedural quadrotor                          */
/* ====================================================================== */

const canvas = el('canvas', { attrs: { id: 'gl', width: W, height: H }, style: { zIndex: 1 } })
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(W, H, false)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setClearColor(0x000000, 0)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100)

const terrainMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#c9686a') }, uOpacity: { value: 0 } },
  vertexShader: /* glsl */ `
    uniform float uTime;
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
      vec3 pos = position; vec2 q = pos.xz + vec2(0.0, -uTime * 0.8);
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
      float a = (contour * 0.55 + major * 0.5 + grid * 0.1) * fade * uOpacity;
      if (a < 0.003) discard;
      gl_FragColor = vec4(uColor, a);
    }`,
})
const terrainGeo = new THREE.PlaneGeometry(70, 52, 240, 180)
terrainGeo.rotateX(-Math.PI / 2)
const terrain = new THREE.Mesh(terrainGeo, terrainMat)
terrain.position.set(0, -2.7, -14)
scene.add(terrain)

const parts = buildDrone()
const TINT = { body: 0x5b4946, dark: 0x2e2423, metal: 0x8a7570, shell: 0x6d5853, arm: 0x524240, blade: 0x9a8580 }
for (const [name, color] of Object.entries(TINT)) parts.materials[name]?.color?.setHex(color)
parts.materials.live.color.set('#e08a8b')
const rig = new THREE.Group()
rig.add(parts.group)
scene.add(rig)
scene.add(new THREE.HemisphereLight(0xffe9dc, 0x1a0f0e, 1.15))
const key = new THREE.DirectionalLight(0xfff3e8, 2.5)
key.position.set(3.5, 5, 4)
scene.add(key)
const rimLight = new THREE.DirectionalLight(0xc9686a, 2.4)
rimLight.position.set(-4, 1.5, -3.5)
scene.add(rimLight)
const fill = new THREE.DirectionalLight(0xfff1e6, 0.9)
fill.position.set(-2, 2.5, 6)
scene.add(fill)

const T_CATCH = 0.95
function attitude(t) {
  const pre = prog(t, 0.15, T_CATCH)
  if (t < T_CATCH) return { roll: 0.54 * pre, pitch: -0.3 * pre }
  return { roll: damped(t - T_CATCH, 0.54, 0.3, 8.2), pitch: damped(t - T_CATCH, -0.3, 0.34, 9.4) }
}

function renderGL(t) {
  if (!vis(canvas, t < 4.06)) return null
  terrainMat.uniforms.uTime.value = t * 0.9
  terrainMat.uniforms.uOpacity.value = ease(t, 0.05, 0.9) * (1 - ease(t, 3.7, 4.05))
  const arrive = ease(t, 0.15, 1.05)
  const att = attitude(t)
  const yaw = -0.62 + 0.42 * t
  rig.position.y = lerp(3.6, 0, arrive) + (t > 1.2 ? 0.035 * Math.sin(2.6 * (t - 1.2)) : 0)
  rig.rotation.set(att.roll, yaw, -att.pitch, 'YZX')
  parts.rotors.forEach((r) => {
    r.rotation.y = (r.userData.dir ?? 1) * t * 21
  })
  const push = eio(prog(t, 0, 2))
  const away = eio(prog(t, 1.9, 2.8))
  camera.position.set(0.15 - 2.7 * away, 1.75 + 0.3 * away, 6.9 - 0.7 * push + 2.4 * away)
  camera.lookAt(-2.1 * away, -0.2 + 0.1 * away, 0)
  canvas.style.opacity = String((1 - 0.5 * ease(t, 1.95, 2.6)) * (1 - ease(t, 3.75, 4.05)))
  renderer.render(scene, camera)
  return att
}

/* ====================================================================== */
/* Scene 1 overlay: callouts, attitude HUD, motor bars                     */
/* ====================================================================== */

const droneOv = el('div', { cls: 'layer', style: { zIndex: 5 } })
const ovSvg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;inset:0' }, droneOv)
const CALLOUTS = [
  { text: 'Rotor 1 · CW', side: 'left', slot: 0.27, get: () => parts.rotors[1] },
  { text: 'Nav lamp', side: 'right', slot: 0.3, get: () => parts.navLights[0] },
  { text: 'Airframe', side: 'left', slot: 0.69, get: () => parts.bay },
  { text: 'Gimbal · camera', side: 'right', slot: 0.66, get: () => parts.gimbal },
].map((c) => ({
  ...c,
  line: sv('polyline', { fill: 'none', stroke: 'rgba(251,245,234,0.52)', 'stroke-width': 1.2 }, ovSvg),
  dot: sv('circle', { r: 0, fill: '#0e0b0b', stroke: '#c9686a', 'stroke-width': 2 }, ovSvg),
  label: el('div', {
    cls: 'abs mono nowrap',
    style: { fontSize: '15px', color: 'var(--ink2)', [c.side]: '120px', top: '0px' },
  }, droneOv),
}))
const readout = el('div', { cls: 'abs', style: { left: '120px', top: '800px', display: 'flex', gap: '52px', alignItems: 'flex-end' } }, droneOv)
const RO = ['Roll', 'Pitch', 'Yaw'].map((label) => {
  const b = el('div', { style: { display: 'grid', gap: '10px' } }, readout)
  const v = el('div', { cls: 'mono', text: '+00.0°', style: { fontSize: '40px', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)', textTransform: 'none' } }, b)
  el('div', { cls: 'mono', text: label, style: { fontSize: '12px', color: 'var(--ink3)', order: 2 } }, b)
  return v
})
const modePill = el('div', {
  cls: 'mono',
  text: 'Manual',
  style: { fontSize: '13px', padding: '8px 14px', borderRadius: '999px', border: '1px solid var(--hair2)', color: 'var(--ink2)', marginLeft: '12px', marginBottom: '6px' },
}, readout)
const motorWrap = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'flex-end', marginLeft: '8px', marginBottom: '4px' } }, readout)
const MOTORS = [0, 1, 2, 3].map((i) => {
  const w = el('div', { style: { display: 'grid', justifyItems: 'center', gap: '6px' } }, motorWrap)
  const well = el('div', { style: { position: 'relative', width: '8px', height: '46px', borderRadius: '4px', background: 'var(--hair)' } }, w)
  const bar = el('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '46px', borderRadius: '4px', background: 'var(--brand)', transformOrigin: '50% 100%' } }, well)
  el('div', { cls: 'mono', text: `M${i + 1}`, style: { fontSize: '10px', color: 'var(--ink3)', letterSpacing: '0.06em' } }, w)
  return bar
})
const droneCap = el('div', { cls: 'abs', style: { left: '120px', top: '936px', display: 'flex', gap: '16px', alignItems: 'baseline', fontSize: '17px', color: 'var(--ink3)' } }, droneOv)
el('span', { cls: 'mono', text: 'Fig. 0', style: { fontSize: '13px', color: 'var(--ink2)' } }, droneCap)
el('span', { text: 'Procedural quadrotor model, caught by a simulated self-level loop.' }, droneCap)

const rotorAxis = parts.booms.map((b) => ({ x: Math.cos(b.rotation.y), z: -Math.sin(b.rotation.y) }))
const fmtDeg = (rad) => {
  const d = THREE.MathUtils.radToDeg(rad)
  return `${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(1).padStart(4, '0')}°`
}

function renderDroneOverlay(t, att) {
  if (!vis(droneOv, t < 2.1 && att)) return
  const retract = 1 - ease(t, 1.8, 2.0, eio)
  CALLOUTS.forEach((c, i) => {
    const wp = c.get().getWorldPosition(new THREE.Vector3()).project(camera)
    const px = (wp.x * 0.5 + 0.5) * W
    const py = (-wp.y * 0.5 + 0.5) * H
    const ly = lerp(c.slot * H, py, 0.3)
    const edge = c.side === 'left' ? 120 : W - 120
    const elbow = c.side === 'left' ? Math.min(px - 70, W * 0.33) : Math.max(px + 70, W * 0.67)
    const k = ease(t, 1.0 + 0.07 * i, 1.4 + 0.07 * i) * retract
    c.line.setAttribute('points', k > 0 ? partial([[edge, ly], [elbow, ly], [px, py]], k) : '')
    c.dot.setAttribute('cx', px.toFixed(1))
    c.dot.setAttribute('cy', py.toFixed(1))
    c.dot.setAttribute('r', (4.5 * clamp((k - 0.85) / 0.15)).toFixed(2))
    typed(c.label, c.text, ease(t, 1.08 + 0.07 * i, 1.45 + 0.07 * i, (x) => x) * retract)
    c.label.style.transform = `translate3d(0, ${(ly - 30).toFixed(1)}px, 0)`
  })
  const on = ease(t, 0.5, 0.9) * (1 - ease(t, 1.82, 2.02))
  readout.style.opacity = String(on)
  readout.style.transform = `translateY(${(1 - ease(t, 0.5, 0.95)) * 16}px)`
  droneCap.style.opacity = String(on)
  const yaw = -0.62 + 0.42 * t
  RO[0].textContent = fmtDeg(att.roll)
  RO[1].textContent = fmtDeg(att.pitch)
  RO[2].textContent = `${((((THREE.MathUtils.radToDeg(yaw) % 360) + 360) % 360).toFixed(1)).padStart(5, '0')}°`
  const mode = t < T_CATCH ? 'Manual' : t < 1.75 ? 'Self-level' : 'Level'
  modePill.textContent = mode
  Object.assign(modePill.style, mode === 'Manual'
    ? { background: 'var(--brand)', color: '#0e0b0b', borderColor: 'var(--brand)' }
    : mode === 'Self-level'
      ? { background: 'transparent', color: 'var(--brand)', borderColor: 'var(--brand)' }
      : { background: 'transparent', color: 'var(--ink2)', borderColor: 'var(--hair2)' })
  const dt = 1 / 240
  const a0 = attitude(t - dt), a1 = attitude(t + dt)
  const rr = (a1.roll - a0.roll) / (2 * dt), pr = (a1.pitch - a0.pitch) / (2 * dt)
  const uR = -30 * att.roll - 6 * rr, uP = -30 * att.pitch - 6 * pr
  MOTORS.forEach((bar, i) => {
    const m = clamp(0.55 + 0.012 * (uR * rotorAxis[i].z - uP * rotorAxis[i].x), 0.06, 1)
    bar.style.transform = `scaleY(${m.toFixed(3)})`
  })
}

/* ====================================================================== */
/* Scene 2: the name                                                       */
/* ====================================================================== */

const nameL = el('div', { cls: 'layer', style: { zIndex: 6 } })
const NAME_FS = 250
const nameBox = el('div', { cls: 'abs', style: { left: '112px', top: '196px' } }, nameL)
const nameChars = ['Rami', 'Kronbi'].map((word, li) => {
  const m = el('div', { cls: 'mask', style: { height: `${NAME_FS * 1.02}px`, marginTop: li ? `-${NAME_FS * 0.1}px` : '0' } }, nameBox)
  const row = el('div', { style: { display: 'flex', fontWeight: 800, fontSize: `${NAME_FS}px`, lineHeight: 1.02, letterSpacing: '-0.045em' } }, m)
  return word.split('').map((ch) => el('span', { text: ch, style: { display: 'inline-block', willChange: 'transform' } }, row))
})
const nameDot = el('div', { cls: 'abs', text: '.', style: { fontWeight: 800, fontSize: `${NAME_FS}px`, lineHeight: 1.02, color: 'var(--brand)', transformOrigin: '50% 85%' } }, nameL)
const nameRole = el('div', { cls: 'abs', text: 'Robotics & embedded-systems engineer', style: { left: '120px', top: '718px', fontSize: '50px', fontWeight: 700, letterSpacing: '-0.03em' } }, nameL)
const nameMeta = el('div', { cls: 'abs mono', style: { left: '120px', top: '800px', fontSize: '17px', color: 'var(--ink3)' } }, nameL)
const NAME_META = 'Beirut, Lebanon · 33.89°N 35.50°E'
const wipe = el('div', { cls: 'abs', style: { top: 0, bottom: 0, width: '720px', background: 'var(--brand)', zIndex: 8 } }, nameL)
el('div', { cls: 'abs mono', text: 'No. 00 — Rami Kronbi', style: { left: '36px', bottom: '120px', fontSize: '15px', color: '#0e0b0b' } }, wipe)

function dotDrop(tau) {
  // a dropped full stop: falls under gravity, lands, bounces twice
  if (tau < 0) return { y: -900, sy: 1, sx: 1, o: 0 }
  const T = 0.4
  if (tau < T) return { y: -900 * (1 - (tau / T) ** 2), sy: 1.12, sx: 0.9, o: 1 }
  const u = tau - T
  const squash = Math.exp(-14 * u) * Math.cos(18 * u)
  return { y: -56 * Math.exp(-6.5 * u) * Math.abs(Math.sin(12 * u)), sy: 1 - 0.22 * squash, sx: 1 + 0.16 * squash, o: 1 }
}

function renderName(t) {
  if (!vis(nameL, t >= 1.84 && t < 4.12)) return
  wipe.style.transform = `translate3d(${lerp(-760, W + 40, ease(t, 1.85, 2.32, eio)).toFixed(1)}px,0,0)`
  let n = 0
  nameChars.forEach((chars, li) => {
    chars.forEach((c, i) => {
      const s = 1.98 + li * 0.07 + i * 0.032
      const enter = ease(t, s, s + 0.62)
      const exit = ease(t, 3.68 + n * 0.018, 4.0 + n * 0.018, eio)
      c.style.transform = `translate3d(0, ${((1 - enter) * 112 - exit * 112).toFixed(2)}%, 0)`
      n++
    })
  })
  const d = dotDrop(t - 2.6)
  const exitDot = ease(t, 3.8, 4.06, eio)
  nameDot.style.opacity = String(d.o * (1 - exitDot))
  nameDot.style.transform = `translate3d(0, ${(d.y - exitDot * 120).toFixed(1)}px, 0) scale(${d.sx.toFixed(3)}, ${d.sy.toFixed(3)})`
  const role = ease(t, 2.42, 3.0)
  nameRole.style.clipPath = `inset(0 ${((1 - role) * 100).toFixed(2)}% 0 0)`
  const outSub = ease(t, 3.6, 3.9, eio)
  nameRole.style.transform = `translateY(${(-outSub * 40).toFixed(1)}px)`
  nameRole.style.opacity = String(1 - outSub)
  typed(nameMeta, NAME_META, ease(t, 2.6, 3.1, (x) => x))
  nameMeta.style.opacity = String(1 - outSub)
}

/* ====================================================================== */
/* Scene 3: the loop                                                       */
/* ====================================================================== */

const loopL = el('div', { cls: 'layer', style: { zIndex: 7 } })
const loopLabel = el('div', { cls: 'abs mono', style: { left: '120px', top: '300px', fontSize: '17px', color: 'var(--ink3)' } }, loopL)
const LOOP_LABEL = 'The loop every entry closes'
const loopRow = el('div', { cls: 'abs', style: { left: '120px', right: '120px', top: '372px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, loopL)
const LOOP = ['sense', 'perceive', 'act'].map((w, i) => {
  const m = el('div', { cls: 'mask', style: { height: '300px', padding: '0 70px 0 24px', margin: '0 -42px 0 -14px' } }, loopRow)
  const word = el('div', { cls: 'serif', text: w, style: { fontSize: '250px', lineHeight: 1.05, color: 'var(--ink)', willChange: 'transform' } }, m)
  let arrow = null
  if (i < 2) {
    const svg = sv('svg', { width: 200, height: 40, viewBox: '0 0 200 40' }, loopRow)
    const path = sv('path', { d: 'M8 20 H180 M166 8 L182 20 L166 32', fill: 'none', stroke: '#c9686a', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1 }, svg)
    arrow = path
  }
  return { word, arrow, at: TL.audio.loopWords[i] }
})

function renderLoop(t) {
  if (!vis(loopL, t >= 3.95 && t < 5.75)) return
  typed(loopLabel, LOOP_LABEL, ease(t, 4.0, 4.45, (x) => x))
  LOOP.forEach((w, i) => {
    const k = ease(t, w.at, w.at + 0.45)
    w.word.style.transform = `translate3d(0, ${((1 - k) * 105).toFixed(2)}%, 0)`
    const active = t >= w.at && (i === 2 || t < LOOP[i + 1].at)
    w.word.style.color = active ? 'var(--brand)' : 'rgba(251,245,234,0.9)'
    if (w.arrow) w.arrow.setAttribute('stroke-dashoffset', (1 - ease(t, w.at + 0.2, w.at + 0.48, eio)).toFixed(3))
  })
  const out = ease(t, 5.28, 5.62, eio)
  loopL.style.transform = `translate3d(0, ${(-out * 90).toFixed(1)}px, 0)`
  loopL.style.opacity = String(1 - out)
}

/* ====================================================================== */
/* Scene 4: entries, as sheets                                             */
/* ====================================================================== */

const ENTRIES = [
  {
    no: 'No. 01', topic: 'Computer vision', title: ['360° *Spherical*', 'Panorama Stitching'], kind: 'pano',
    fig: { value: 333, dec: 0, unit: '°', label: 'Recovered sweep' },
    rows: ['309 frames · one handheld sweep', '921 median RANSAC inliers', '4096 × 2048 equirectangular'],
    fig_no: 'Fig. 01.1', caption: 'Equirectangular panorama recovered from a phone sweep. Sole developer.',
  },
  {
    no: 'No. 04', topic: 'Edge AI', title: ['*Thermal*', 'Super-Resolution'], kind: 'thermal',
    fig: { value: 31.0, dec: 1, unit: 'dB', label: '×3 upscale · PSNR' },
    rows: ['SSIM 0.757 at ×3', 'IMDN-derived, single channel', 'Optimized for NVIDIA Jetson'],
    fig_no: 'Fig. 04.1', caption: 'A low-resolution thermal street scene beside the same frame upscaled ×3.',
  },
  {
    no: 'No. 03', topic: 'Embedded systems', title: ['Brainiacs', '*Autonomous* Race Car'], kind: 'car',
    fig: { value: 20, dec: 0, unit: 'days', label: 'Built from scratch' },
    rows: ['Third place · WRO Future Engineers 2023', 'Jetson Nano perception · Arduino Mega control', 'With Wassim Ghaddar'],
    fig_no: 'Fig. 03.1', caption: 'Front view: camera mounted above the drivetrain.',
  },
  {
    no: 'No. 02', topic: 'Control systems', title: ['easyPID'], kind: 'pid',
    fig: { text: 'v1.1.0', label: 'Arduino Library Manager' },
    rows: ['Anti-windup · filtering · autotuning', 'Hardware-agnostic · MIT license', 'Author'],
    fig_no: 'Fig. 02.1', caption: 'A loop settling on a step. Simulated, ζ 0.35.',
  },
  {
    no: 'No. 08', topic: 'Civic technology', title: ['Daleel'], kind: 'daleel',
    fig: { arabic: 'دليل', label: 'Election information · Lebanon' },
    rows: ['Source archiving', 'Append-only history', 'Lead developer · with Layth Ayache'],
    fig_no: 'Fig. 08.1', caption: 'The platform’s hero, as published in the project repository.',
  },
]
const IMG = '/public/images'
const entriesL = el('div', { cls: 'layer', style: { zIndex: 10 } })
const PLATE = { x: 120, y: 150, w: 1000, h: 690 }
const COL = { x: 1200, w: 620 }

const SHEETS = ENTRIES.map((e, idx) => {
  const sheet = el('div', {
    cls: 'layer',
    style: {
      background: 'var(--bg)', borderTop: '1px solid var(--hair2)', borderRadius: '30px 30px 0 0',
      boxShadow: '0 -40px 90px rgba(0,0,0,0.6)', transformOrigin: '50% 0%', willChange: 'transform',
    },
  }, entriesL)
  el('div', { cls: 'layer grid', style: { opacity: 0.6 } }, sheet)
  const plate = el('div', {
    cls: 'abs',
    style: { left: `${PLATE.x}px`, top: `${PLATE.y}px`, width: `${PLATE.w}px`, height: `${PLATE.h}px`, borderRadius: '20px', border: '1px solid var(--hair)', overflow: 'hidden', background: 'var(--sunk)' },
  }, sheet)
  const inner = el('div', { cls: 'layer', style: { willChange: 'transform, filter, clip-path' } }, plate)
  const s = { sheet, plate, inner, e, idx }

  if (e.kind === 'pano') {
    s.img = el('img', { attrs: { src: `${IMG}/authority/spherical-panorama/panorama.jpg` }, style: { position: 'absolute', top: 0, left: 0, height: `${PLATE.h}px`, width: `${PLATE.h * 2}px` } }, inner)
    s.scan = el('div', { cls: 'abs', style: { top: 0, bottom: 0, width: '2px', background: 'var(--ink)', boxShadow: '0 0 0 1px rgba(14,11,11,0.35)' } }, inner)
    s.scanLabel = el('div', { cls: 'abs mono nowrap', style: { top: '18px', fontSize: '14px', padding: '6px 10px', borderRadius: '999px', background: 'rgba(14,11,11,0.82)', color: 'var(--ink)' } }, inner)
  } else if (e.kind === 'thermal') {
    const cw = Math.round((687 / 523) * PLATE.h)
    const box = el('div', { cls: 'abs', style: { left: `${(PLATE.w - cw) / 2}px`, top: 0, width: `${cw}px`, height: `${PLATE.h}px`, overflow: 'hidden' } }, inner)
    const iw = (1424 / 687) * cw, ih = (536 / 523) * PLATE.h
    const mk = (x) => ({ position: 'absolute', top: 0, width: `${iw}px`, height: `${ih}px`, left: `${(-x / 687) * cw}px`, maxWidth: 'none' })
    el('img', { attrs: { src: `${IMG}/authority/thermal-super-resolution/thermal-plate.webp` }, style: mk(15) }, box)
    s.after = el('div', { cls: 'layer' }, box)
    el('img', { attrs: { src: `${IMG}/authority/thermal-super-resolution/thermal-plate.webp` }, style: mk(723) }, s.after)
    s.divider = el('div', { cls: 'abs', style: { top: 0, bottom: 0, width: '2px', background: '#fbf5ea' } }, box)
    s.knob = el('div', { cls: 'abs', style: { top: `${PLATE.h / 2 - 22}px`, width: '44px', height: '44px', borderRadius: '50%', background: '#fbf5ea', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.7)' } }, box)
    const tag = (txt, side) => el('div', { cls: 'abs mono', text: txt, style: { top: '16px', [side]: '16px', fontSize: '13px', padding: '7px 11px', borderRadius: '999px', background: 'rgba(14,11,11,0.8)', color: '#fbf5ea' } }, box)
    tag('Input', 'left')
    tag('Upscaled ×3', 'right')
    s.box = box
    s.cw = cw
  } else if (e.kind === 'car') {
    s.img = el('img', { attrs: { src: `${IMG}/authority/race-car/front.jpeg` }, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 46%' } }, inner)
  } else if (e.kind === 'daleel') {
    s.img = el('img', { attrs: { src: `${IMG}/authority/daleel/hero.jpeg` }, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 28%' } }, inner)
  } else if (e.kind === 'pid') {
    el('div', { cls: 'layer grid' }, inner)
    const svg = sv('svg', { width: PLATE.w, height: PLATE.h, viewBox: `0 0 ${PLATE.w} ${PLATE.h}`, style: 'position:absolute;inset:0' }, inner)
    const X0 = 90, X1 = PLATE.w - 70, Y0 = PLATE.h - 120, Y1 = 230 // y for 0 and for setpoint
    sv('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: 'rgba(251,245,234,0.24)', 'stroke-width': 1 }, svg)
    sv('line', { x1: X0, y1: 90, x2: X0, y2: Y0, stroke: 'rgba(251,245,234,0.24)', 'stroke-width': 1 }, svg)
    s.setpoint = sv('path', { d: `M${X0} ${Y0} H${X0 + 60} V${Y1} H${X1}`, fill: 'none', stroke: 'rgba(251,245,234,0.55)', 'stroke-width': 2, 'stroke-dasharray': '8 8' }, svg)
    const zeta = 0.35, omega = 0.055, pts = []
    for (let x = 0; x <= X1 - (X0 + 60); x += 3) {
      const wd = omega * Math.sqrt(1 - zeta * zeta)
      const yv = 1 - Math.exp(-zeta * omega * x) * (Math.cos(wd * x) + ((zeta * omega) / wd) * Math.sin(wd * x))
      pts.push([X0 + 60 + x, lerp(Y0, Y1, yv)])
    }
    s.curvePts = [[X0, Y0], [X0 + 60, Y0], ...pts]
    s.curve = sv('polyline', { fill: 'none', stroke: '#c9686a', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg)
    let peak = pts[0]
    for (const p of pts) if (p[1] < peak[1]) peak = p
    s.peakDot = sv('circle', { cx: peak[0], cy: peak[1], r: 0, fill: '#0e0b0b', stroke: '#c9686a', 'stroke-width': 3 }, svg)
    s.peakLabel = el('div', { cls: 'abs mono', text: 'Overshoot 31%', style: { left: `${peak[0] + 18}px`, top: `${peak[1] - 44}px`, fontSize: '14px', color: 'var(--ink2)' } }, inner)
    el('div', { cls: 'abs mono', text: 'Setpoint', style: { right: '72px', top: `${Y1 - 34}px`, fontSize: '13px', color: 'var(--ink3)' } }, inner)
    el('div', { cls: 'abs mono', text: 'Simulated step response · ζ 0.35', style: { left: '32px', top: '28px', fontSize: '14px', color: 'var(--ink3)' } }, inner)
  }

  // right column
  const col = el('div', { cls: 'abs', style: { left: `${COL.x}px`, top: '150px', width: `${COL.w}px` } }, sheet)
  const head = el('div', { style: { display: 'flex', gap: '22px', alignItems: 'baseline' } }, col)
  s.no = el('div', { cls: 'mono', text: e.no, style: { fontSize: '24px', color: 'var(--brand)', letterSpacing: '0' } }, head)
  s.topic = el('div', { cls: 'mono', text: e.topic, style: { fontSize: '14px', color: 'var(--ink3)' } }, head)
  const titleBox = el('div', { style: { marginTop: '26px' } }, col)
  s.title = maskLines(titleBox, e.title, { fontWeight: 700, fontSize: '74px', lineHeight: 1.04, letterSpacing: '-0.04em', whiteSpace: 'nowrap' })
  const figBox = el('div', { cls: 'mask', style: { marginTop: '44px', height: '170px' } }, col)
  if (e.fig.arabic) {
    s.fig = el('div', { text: e.fig.arabic, attrs: { dir: 'rtl', lang: 'ar' }, style: { fontFamily: "'Noto Naskh Arabic', serif", fontWeight: 700, fontSize: '128px', lineHeight: 1.3, color: 'var(--brand)', textAlign: 'left' } }, figBox)
  } else {
    s.fig = el('div', { cls: 'mono', style: { fontSize: '150px', fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 1, color: 'var(--ink)', textTransform: 'none' } }, figBox)
    s.figNum = el('span', {}, s.fig)
    if (e.fig.unit) s.figUnit = el('span', { text: e.fig.unit, style: { fontSize: '0.36em', color: 'var(--ink3)', letterSpacing: '0', marginLeft: e.fig.unit === '°' ? '0' : '0.25em' } }, s.fig)
  }
  s.figLabel = el('div', { cls: 'mono', text: e.fig.label, style: { fontSize: '15px', color: 'var(--ink3)', marginTop: '14px' } }, col)
  const rows = el('div', { style: { marginTop: '40px', borderTop: '1px solid var(--hair)' } }, col)
  s.rows = e.rows.map((r) => el('div', { text: r, style: { padding: '14px 0', borderBottom: '1px solid var(--hair)', fontSize: '24px', fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' } }, rows))
  // caption
  s.cap = el('div', { cls: 'abs', style: { left: `${PLATE.x}px`, top: `${PLATE.y + PLATE.h + 22}px`, display: 'flex', gap: '16px', alignItems: 'baseline', fontSize: '17px', color: 'var(--ink3)' } }, sheet)
  el('span', { cls: 'mono', text: e.fig_no, style: { fontSize: '13px', color: 'var(--ink2)' } }, s.cap)
  el('span', { text: e.caption }, s.cap)
  return s
})

function renderEntries(t) {
  const starts = TL.entryStarts
  if (!vis(entriesL, t >= starts[0] - 0.06 && t < 10.95)) return
  SHEETS.forEach((s, i) => {
    const s0 = starts[i]
    const next = starts[i + 1]
    const end = next != null ? next + 0.55 : 10.95
    if (!vis(s.sheet, t >= s0 - 0.06 && t < end)) return
    const tau = t - s0
    const enter = spring(tau + 0.04, 0.84, 15)
    const under = next != null ? ease(t, next - 0.02, next + 0.45) : 0
    s.sheet.style.transform = `translate3d(0, ${((1 - enter) * H - 18 * under).toFixed(2)}px, 0) scale(${(1 - 0.045 * under).toFixed(4)})`
    s.sheet.style.filter = under > 0.001 ? `brightness(${(1 - 0.55 * under).toFixed(3)})` : 'none'

    // plate develops: a clip and a focus pull (the site's one scroll motion)
    const dev = ease(t, s0 + 0.04, s0 + 0.55)
    s.inner.style.clipPath = `inset(0 0 ${((1 - dev) * 26).toFixed(2)}% 0)`
    s.inner.style.filter = dev < 0.999 ? `blur(${((1 - dev) * 7).toFixed(2)}px) saturate(${(0.55 + 0.45 * dev).toFixed(3)})` : 'none'
    const life = prog(t, s0, s0 + 1.05)
    let scale = 1.035 - 0.035 * dev

    if (s.e.kind === 'pano') {
      const k = eio(life)
      s.img.style.transform = `translate3d(${(-k * (PLATE.h * 2 - PLATE.w)).toFixed(1)}px,0,0)`
      const sx = lerp(70, PLATE.w - 90, ease(t, s0 + 0.12, s0 + 0.95, eio))
      s.scan.style.left = `${sx}px`
      // the readout rides the scan line and flips to its left near the edge
      const flip = sx > PLATE.w - 170
      s.scanLabel.style.left = flip ? 'auto' : `${sx + 12}px`
      s.scanLabel.style.right = flip ? `${PLATE.w - sx + 12}px` : 'auto'
      s.scanLabel.textContent = `θ ${String(Math.round(333 * ease(t, s0 + 0.12, s0 + 0.95, eio))).padStart(3, '0')}°`
    } else if (s.e.kind === 'thermal') {
      const d = lerp(0.1, 0.9, ease(t, s0 + 0.18, s0 + 0.92, eio))
      s.after.style.clipPath = `inset(0 0 0 ${(d * 100).toFixed(2)}%)`
      s.divider.style.left = `${d * s.cw - 1}px`
      s.knob.style.left = `${d * s.cw - 22}px`
    } else if (s.e.kind === 'car' || s.e.kind === 'daleel') {
      const z = s.e.kind === 'car' ? 1 + 0.1 * life : 1.07 - 0.07 * life
      s.img.style.transform = `scale(${z.toFixed(4)})`
    } else if (s.e.kind === 'pid') {
      const k = ease(t, s0 + 0.12, s0 + 0.85, (x) => x)
      s.curve.setAttribute('points', partial(s.curvePts, eo(k)))
      const pk = clamp((eo(k) - 0.3) / 0.12)
      s.peakDot.setAttribute('r', (6 * pk).toFixed(2))
      s.peakLabel.style.opacity = String(pk)
    }
    s.inner.style.transform = `scale(${scale.toFixed(4)})`

    // right column
    const headK = ease(t, s0 + 0.1, s0 + 0.45)
    s.no.style.opacity = s.topic.style.opacity = String(headK)
    s.no.style.transform = `translateX(${((1 - headK) * -20).toFixed(1)}px)`
    s.title.forEach((line, li) => {
      const k = ease(t, s0 + 0.13 + li * 0.06, s0 + 0.62 + li * 0.06)
      line.style.transform = `translate3d(0, ${((1 - k) * 135).toFixed(2)}%, 0)`
    })
    const figK = ease(t, s0 + 0.2, s0 + 0.62)
    s.fig.style.transform = `translate3d(0, ${((1 - figK) * 100).toFixed(2)}%, 0)`
    if (s.figNum) {
      const c = ease(t, s0 + 0.2, s0 + 0.8)
      if (s.e.fig.text) typed(s.figNum, s.e.fig.text, ease(t, s0 + 0.22, s0 + 0.6, (x) => x))
      else s.figNum.textContent = (s.e.fig.value * c).toFixed(s.e.fig.dec)
    }
    s.figLabel.style.opacity = String(ease(t, s0 + 0.32, s0 + 0.6))
    s.rows.forEach((r, ri) => {
      const k = ease(t, s0 + 0.34 + ri * 0.07, s0 + 0.7 + ri * 0.07)
      r.style.opacity = String(k)
      r.style.transform = `translateX(${((1 - k) * 28).toFixed(1)}px)`
    })
    s.cap.style.opacity = String(ease(t, s0 + 0.35, s0 + 0.65))
  })
}

/* ====================================================================== */
/* Scene 5: the record — a PD arrow field chasing a light                  */
/* ====================================================================== */

const fieldL = el('div', { cls: 'layer', style: { zIndex: 20, background: 'var(--bg)' } })
const fieldCv = el('canvas', { attrs: { width: W, height: H }, style: { position: 'absolute', inset: 0 } }, fieldL)
const fctx = fieldCv.getContext('2d')
const GAP = 60
const ARROWS = []
{
  const r = rng(7)
  const cols = Math.floor(W / GAP), rows = Math.floor(H / GAP)
  const ox = (W - (cols - 1) * GAP) / 2, oy = (H - (rows - 1) * GAP) / 2
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) ARROWS.push({ x: ox + x * GAP, y: oy + y * GAP, th0: -Math.PI / 2 + (r() - 0.5) * 0.4 })
}
const F0 = 10.45
const lightAt = (t) => {
  const k = prog(t, F0, 12.4)
  return { x: W * (0.46 + 0.42 * eio(k)), y: H * (0.6 - 0.24 * Math.sin(k * Math.PI * 1.3)) }
}
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a))
const recordPanel = el('div', {
  cls: 'abs',
  style: { left: '120px', top: '190px', width: '560px', padding: '40px 44px', borderRadius: '28px', border: '1px solid var(--hair)', background: 'rgba(14,11,11,0.92)' },
}, fieldL)
el('div', { style: { width: '24px', height: '2px', background: 'var(--brand)', marginBottom: '16px' } }, recordPanel)
el('div', { cls: 'mono', text: 'The record', style: { fontSize: '15px', color: 'var(--ink3)' } }, recordPanel)
const COUNTS = [
  [20, 'Entries'],
  [23, 'Field notes'],
  [9, 'Methods'],
].map(([n, label], i) => {
  const row = el('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '18px 0 14px', borderBottom: i < 2 ? '1px solid var(--hair)' : 'none' } }, recordPanel)
  const v = el('div', { cls: 'mono', style: { fontSize: '120px', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.05em', textTransform: 'none' } }, row)
  el('div', { cls: 'mono', text: label, style: { fontSize: '16px', color: 'var(--ink2)' } }, row)
  return { v, n }
})

function renderField(t) {
  if (!vis(fieldL, t >= F0 && t < 12.66)) return
  // simulate the PD trackers from F0 with a fixed step: pure function of t
  const dt = 1 / 240
  const steps = Math.floor((t - F0) / dt)
  const th = ARROWS.map((a) => a.th0)
  const om = ARROWS.map(() => 0)
  const KP = 70, KD = 3
  for (let s = 0; s < steps; s++) {
    const L = lightAt(F0 + s * dt)
    for (let i = 0; i < ARROWS.length; i++) {
      const a = ARROWS[i]
      const e = wrapA(Math.atan2(L.y - a.y, L.x - a.x) - th[i])
      om[i] += (KP * e - KD * om[i]) * dt
      th[i] += om[i] * dt
    }
  }
  const L = lightAt(t)
  fctx.clearRect(0, 0, W, H)
  fctx.lineCap = 'round'
  fctx.lineJoin = 'round'
  for (let i = 0; i < ARROWS.length; i++) {
    const a = ARROWS[i]
    const p = Math.max(0, 1 - Math.hypot(L.x - a.x, L.y - a.y) / 420)
    const c = [251 + (201 - 251) * p, 245 + (104 - 245) * p, 234 + (106 - 234) * p].map(Math.round)
    fctx.strokeStyle = `rgba(${c.join(',')},${(0.24 + p * 0.76).toFixed(3)})`
    fctx.lineWidth = 2 + p * 1.2
    const cs = Math.cos(th[i]), sn = Math.sin(th[i]), len = 13
    const hx = a.x + cs * len, hy = a.y + sn * len
    fctx.beginPath()
    fctx.moveTo(a.x - cs * len, a.y - sn * len)
    fctx.lineTo(hx, hy)
    fctx.moveTo(hx - Math.cos(th[i] - 0.6) * 9, hy - Math.sin(th[i] - 0.6) * 9)
    fctx.lineTo(hx, hy)
    fctx.lineTo(hx - Math.cos(th[i] + 0.6) * 9, hy - Math.sin(th[i] + 0.6) * 9)
    fctx.stroke()
  }
  fctx.fillStyle = '#c9686a'
  fctx.strokeStyle = '#c9686a'
  fctx.lineWidth = 2.5
  fctx.beginPath()
  fctx.arc(L.x, L.y, 8, 0, Math.PI * 2)
  fctx.fill()
  for (let i = 0; i < 8; i++) {
    const an = (i / 8) * Math.PI * 2 + t * 0.8
    fctx.beginPath()
    fctx.moveTo(L.x + Math.cos(an) * 16, L.y + Math.sin(an) * 16)
    fctx.lineTo(L.x + Math.cos(an) * 25, L.y + Math.sin(an) * 25)
    fctx.stroke()
  }
  const iris = ease(t, F0, F0 + 0.42) * 2400
  fieldL.style.clipPath = iris < 2399 ? `circle(${iris.toFixed(1)}px at ${L.x.toFixed(1)}px ${L.y.toFixed(1)}px)` : 'none'
  const pk = ease(t, 10.62, 11.0) * (1 - ease(t, 11.42, 11.58))
  recordPanel.style.opacity = String(pk)
  recordPanel.style.transform = `translate3d(${((1 - pk) * -40).toFixed(1)}px,0,0)`
  COUNTS.forEach((c, i) => {
    c.v.textContent = String(Math.round(c.n * ease(t, 10.66 + i * 0.09, 11.14 + i * 0.09))).padStart(2, '0')
  })
  fieldL.style.opacity = String(1 - ease(t, 12.42, 12.66))
}

/* ====================================================================== */
/* Scene 6: rooms and roles                                                */
/* ====================================================================== */

const rolesL = el('div', { cls: 'layer', style: { zIndex: 22 } })
const rolesShade = el('div', { cls: 'layer', style: { background: 'rgba(14,11,11,0.9)' } }, rolesL)
const rolesHead = el('div', { cls: 'abs', style: { left: '120px', top: '138px' } }, rolesL)
const rolesTitle = maskLines(rolesHead, ['Rooms and *roles*'], { fontWeight: 800, fontSize: '104px', lineHeight: 1.05, letterSpacing: '-0.045em' })
const ROLES = [
  ['2024 — now', 'Embedded Systems Engineer', 'Oreyeon'],
  ['2026', 'Lead developer', 'Daleel, with Layth Ayache'],
  ['2025', 'Speaker', 'GDG DevFest Tripoli'],
  ['2025', 'Graduate Studies Award', 'Rafik Hariri University'],
  ['2024 — 2025', 'Co-founder', 'NASNA'],
  ['2023', 'Third place, Future Engineers', 'World Robot Olympiad'],
  ['2026', 'Betaflight #15706', 'Merged upstream'],
].map((r, i) => {
  const row = el('div', { cls: 'abs', style: { left: '120px', right: '120px', top: `${322 + i * 82}px`, height: '82px' } }, rolesL)
  const inner = el('div', { style: { display: 'grid', gridTemplateColumns: '300px 760px 1fr', alignItems: 'baseline', height: '100%', paddingTop: '22px' } }, row)
  el('div', { cls: 'mono', text: r[0], style: { fontSize: '17px', color: 'var(--ink3)' } }, inner)
  el('div', { text: r[1], style: { fontSize: '38px', fontWeight: 700, letterSpacing: '-0.03em' } }, inner)
  el('div', { text: r[2], style: { fontSize: '28px', color: 'var(--ink2)' } }, inner)
  const rule = el('div', { cls: 'abs', style: { left: 0, right: 0, bottom: 0, height: '1px', background: 'var(--hair2)', transformOrigin: '0 50%' } }, row)
  return { inner, rule }
})

function renderRoles(t) {
  if (!vis(rolesL, t >= 11.45 && t < 12.7)) return
  const out = ease(t, 12.44, 12.68, eio)
  rolesShade.style.opacity = String(ease(t, 11.45, 11.62) * (1 - out))
  rolesTitle[0].style.transform = `translate3d(0, ${((1 - ease(t, 11.5, 11.95)) * 135 - out * 135).toFixed(2)}%, 0)`
  ROLES.forEach((r, i) => {
    const k = ease(t, 11.58 + i * 0.055, 12.0 + i * 0.055)
    const o = ease(t, 12.4 + i * 0.012, 12.62 + i * 0.012, eio)
    r.inner.style.opacity = String(k * (1 - o))
    r.inner.style.transform = `translate3d(${((1 - k) * -60).toFixed(1)}px, ${(-o * 30).toFixed(1)}px, 0)`
    r.rule.style.transform = `scaleX(${ease(t, 11.6 + i * 0.055, 12.1 + i * 0.055).toFixed(4)})`
    r.rule.style.opacity = String(1 - o)
  })
}

/* ====================================================================== */
/* Scene 7: the index of methods — tags fall and lock to the module       */
/* ====================================================================== */

const tagsL = el('div', { cls: 'layer', style: { zIndex: 24 } })
const tagsGrid = el('div', { cls: 'layer grid' }, tagsL)
const tagsHead = el('div', { cls: 'abs', style: { left: '120px', top: '138px', zIndex: 2 } }, tagsL)
const tagsTitle = maskLines(tagsHead, ['Index of *methods*'], { fontWeight: 800, fontSize: '104px', lineHeight: 1.05, letterSpacing: '-0.045em' })
const FLOOR = 960
const floorRule = el('div', { cls: 'abs', style: { left: '120px', right: '120px', top: `${FLOOR}px`, height: '1px', background: 'var(--hair2)', transformOrigin: '0 50%' } }, tagsL)
const TAGS = [
  ['Computer vision', 16], ['Robotics and perception', 8], ['Embedded systems', 14], ['Control systems', 8], ['Edge AI', 4],
  ['Open-source engineering', 8], ['Applied AI', 12], ['Civic technology', 4], ['Local-first software', 4],
].map(([label, n]) => {
  const pill = el('div', {
    cls: 'abs',
    style: { left: 0, top: 0, height: '60px', display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '0 26px', borderRadius: '999px', border: '1px solid var(--hair2)', background: 'var(--bg)', fontSize: '27px', fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap', willChange: 'transform' },
  }, tagsL)
  pill.append(document.createTextNode(label))
  el('span', { cls: 'mono', text: String(n).padStart(2, '0'), style: { fontSize: '17px', color: 'var(--brand)', letterSpacing: '0' } }, pill)
  return { pill, w: 0, h: 60, slot: null, drop: null }
})
function layoutTags() {
  const MOD = 80, left = 120, cols = Math.floor((W - 240) / MOD)
  const rows = [[]]
  let used = 0
  TAGS.forEach((tg) => {
    tg.w = tg.pill.getBoundingClientRect().width
    const span = Math.ceil((tg.w + 14) / MOD)
    if (used + span > cols) {
      rows.push([])
      used = 0
    }
    rows[rows.length - 1].push({ tg, span })
    used += span
  })
  const r = rng(42)
  rows.forEach((row, ri) => {
    const span = row.reduce((s, it) => s + it.span, 0)
    let c = Math.floor((cols - span) / 2)
    row.forEach(({ tg, span: sp }) => {
      tg.slot = { x: left + c * MOD, y: FLOOR - (ri + 0.5) * MOD - tg.h / 2 }
      c += sp
    })
  })
  TAGS.forEach((tg, i) => {
    tg.drop = {
      start: 12.5 + i * 0.038,
      x: clamp(tg.slot.x + (r() - 0.5) * 360, 120, W - 120 - tg.w),
      y0: 330 + r() * 160,
      rot: (r() - 0.5) * 1.3,
      land: FLOOR - tg.h - r() * 70,
    }
  })
}

function renderTags(t) {
  if (!vis(tagsL, t >= 12.45 && t < 13.31)) return
  const out = ease(t, 13.1, 13.3, eio)
  tagsL.style.opacity = String(1 - out)
  tagsL.style.transform = `translate3d(0, ${(-out * 40).toFixed(1)}px, 0)`
  tagsGrid.style.opacity = String(ease(t, 12.45, 12.7))
  floorRule.style.transform = `scaleX(${ease(t, 12.48, 12.9).toFixed(4)})`
  tagsTitle[0].style.transform = `translate3d(0, ${((1 - ease(t, 12.5, 12.92)) * 135).toFixed(2)}%, 0)`
  TAGS.forEach((tg, i) => {
    const d = tg.drop
    const T = 0.34
    const tau = t - d.start
    let x = d.x, y, rot
    if (tau < T) {
      y = lerp(d.y0, d.land, (Math.max(0, tau) / T) ** 2)
      rot = d.rot * (1 + Math.max(0, tau) * 0.8)
    } else {
      const u = tau - T
      y = d.land - 34 * Math.exp(-7 * u) * Math.abs(Math.sin(13 * u))
      rot = d.rot * 1.27 * Math.exp(-5 * u) * Math.cos(9 * u)
    }
    const g = ease(t, 12.96 + i * 0.016, 13.24 + i * 0.016, eio)
    x = lerp(x, tg.slot.x, g)
    y = lerp(y, tg.slot.y, g)
    rot = lerp(rot, 0, g)
    tg.pill.style.opacity = String(clamp(tau / 0.06))
    tg.pill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(4)}rad)`
  })
}

/* ====================================================================== */
/* Scene 8: sign-off                                                       */
/* ====================================================================== */

const signL = el('div', { cls: 'layer', style: { zIndex: 26 } })
const portraitPlate = el('div', { cls: 'abs', style: { left: '120px', top: '150px', width: '580px', height: '780px', borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--hair)', background: 'var(--sunk)' } }, signL)
const portraitInner = el('div', { cls: 'layer' }, portraitPlate)
const portrait = el('img', { attrs: { src: `${IMG}/home/portrait.jpeg` }, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%' } }, portraitInner)
const portraitCap = el('div', { cls: 'abs', style: { left: '120px', top: '952px', display: 'flex', gap: '16px', alignItems: 'baseline', fontSize: '17px', color: 'var(--ink3)' } }, signL)
el('span', { cls: 'mono', text: 'Fig. ∞', style: { fontSize: '13px', color: 'var(--ink2)' } }, portraitCap)
el('span', { text: 'The engineer.' }, portraitCap)
const signHead = el('div', { cls: 'abs', style: { left: '800px', top: '150px' } }, signL)
const signLines = maskLines(signHead, ['Let’s build', 'something that', 'has to *work.*'], { fontWeight: 800, fontSize: '112px', lineHeight: 1.0, letterSpacing: '-0.045em', whiteSpace: 'nowrap' })
const sigBox = el('div', { cls: 'abs', style: { left: '800px', top: '612px', width: '470px' } }, signL)
el('div', { cls: 'mono', text: 'Signed', style: { fontSize: '13px', color: 'var(--ink3)', marginBottom: '12px' } }, sigBox)
const sig = el('div', {
  style: { width: '440px', aspectRatio: '2360 / 519', background: 'var(--ink)', WebkitMask: `url(${IMG}/home/sig.png) center / contain no-repeat`, mask: `url(${IMG}/home/sig.png) center / contain no-repeat` },
}, sigBox)
const sigRule = el('div', { style: { height: '1px', background: 'var(--hair2)', marginTop: '10px', transformOrigin: '0 50%' } }, sigBox)
const sigName = el('div', { text: 'Rami Kronbi, Beirut', style: { fontSize: '18px', color: 'var(--ink3)', marginTop: '10px' } }, sigBox)
const LINKS = ['ramikronbi.com', 'github.com/Kronbii', 'linkedin.com/in/rami-kronbi']
const linkBox = el('div', { cls: 'abs', style: { left: '1350px', top: '640px', display: 'grid', gap: '14px' } }, signL)
const linkEls = LINKS.map((l) => el('div', { cls: 'mono', style: { fontSize: '19px', color: 'var(--ink)', textTransform: 'none', letterSpacing: '0.02em' } }, linkBox))
const lockup = el('div', { cls: 'abs', style: { left: '800px', top: '806px', fontWeight: 800, fontSize: '96px', letterSpacing: '-0.045em', lineHeight: 1 } }, signL)
const lockMask = el('div', { cls: 'mask', style: { display: 'inline-block', verticalAlign: 'top', paddingBottom: '0.05em' } }, lockup)
const lockText = el('div', { text: 'Rami Kronbi', style: { willChange: 'transform' } }, lockMask)
const lockDot = el('span', { text: '.', style: { display: 'inline-block', color: 'var(--brand)', transformOrigin: '50% 85%', verticalAlign: 'top' } }, lockup)

function renderSign(t) {
  if (!vis(signL, t >= 13.2)) return
  const dev = ease(t, 13.22, 13.8)
  portraitPlate.style.clipPath = `inset(0 0 ${((1 - dev) * 30).toFixed(2)}% 0 round 22px)`
  portraitPlate.style.opacity = String(ease(t, 13.2, 13.36))
  portraitInner.style.filter = dev < 0.999 ? `blur(${((1 - dev) * 9).toFixed(2)}px)` : 'none'
  portrait.style.transform = `scale(${(1.08 - 0.06 * dev - 0.02 * prog(t, 13.8, 15)).toFixed(4)})`
  portraitCap.style.opacity = String(ease(t, 13.5, 13.8))
  signLines.forEach((l, i) => {
    l.style.transform = `translate3d(0, ${((1 - ease(t, 13.32 + i * 0.08, 13.85 + i * 0.08)) * 135).toFixed(2)}%, 0)`
  })
  const sk = ease(t, TL.audio.signature[0], TL.audio.signature[1], eio)
  sig.style.clipPath = `inset(0 ${((1 - sk) * 100).toFixed(2)}% 0 0)`
  sigBox.style.opacity = String(ease(t, 13.82, 13.95))
  sigRule.style.transform = `scaleX(${ease(t, 14.2, 14.5).toFixed(4)})`
  sigName.style.opacity = String(ease(t, 14.3, 14.5))
  LINKS.forEach((l, i) => typed(linkEls[i], l, ease(t, 14.2 + i * 0.1, 14.45 + i * 0.1, (x) => x)))
  lockText.style.transform = `translate3d(0, ${((1 - ease(t, 14.18, 14.6)) * 135).toFixed(2)}%, 0)`
  const d = dotDrop(t - (TL.audio.finalHit - 0.4))
  lockDot.style.opacity = String(d.o)
  lockDot.style.transform = `translate3d(0, ${d.y.toFixed(1)}px, 0) scale(${d.sx.toFixed(3)}, ${d.sy.toFixed(3)})`
}

/* ====================================================================== */
/* Instrument frame (HUD), grain, vignette                                 */
/* ====================================================================== */

const hud = el('div', { cls: 'layer', style: { zIndex: 55 } })
const hudBrand = el('div', { cls: 'abs', style: { left: '64px', top: '44px' } }, hud)
el('div', { html: 'Rami Kronbi<span style="color:var(--brand)">.</span>', style: { fontWeight: 800, fontSize: '26px', letterSpacing: '-0.035em' } }, hudBrand)
el('div', { cls: 'mono', text: 'Engineering record — showreel 2026', style: { fontSize: '12px', color: 'var(--ink3)', marginTop: '8px' } }, hudBrand)
const hudTc = el('div', { cls: 'abs mono', style: { right: '64px', top: '50px', display: 'flex', gap: '14px', alignItems: 'center', fontSize: '14px', color: 'var(--ink2)' } }, hud)
const recDot = el('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' } }, hudTc)
el('span', { text: 'Rec' }, hudTc)
const tc = el('span', { text: '00:00:00:00', style: { color: 'var(--ink)' } }, hudTc)
const secWrap = el('div', { cls: 'abs mono', style: { left: '64px', bottom: '46px', display: 'flex', gap: '32px', fontSize: '13px' } }, hud)
const secItems = TL.sections.map((s, i) => el('span', { text: `0${i + 1} ${s.label}`, style: { color: 'var(--ink3)' } }, secWrap))
const secBar = el('div', { cls: 'abs', style: { left: '0px', bottom: '34px', height: '2px', width: '100px', background: 'var(--brand)', transformOrigin: '0 50%' } }, hud)
el('div', { cls: 'abs mono', text: 'ramikronbi.com', style: { right: '64px', bottom: '46px', fontSize: '13px', color: 'var(--ink2)', textTransform: 'none', letterSpacing: '0.04em' } }, hud)
const progress = el('div', { cls: 'abs', style: { left: 0, right: 0, bottom: 0, height: '3px', background: 'var(--brand)', transformOrigin: '0 50%' } }, hud)
const corners = [
  { left: '24px', top: '24px', borderLeft: '1px solid', borderTop: '1px solid' },
  { right: '24px', top: '24px', borderRight: '1px solid', borderTop: '1px solid' },
  { left: '24px', bottom: '24px', borderLeft: '1px solid', borderBottom: '1px solid' },
  { right: '24px', bottom: '24px', borderRight: '1px solid', borderBottom: '1px solid' },
].map((s) => el('div', { cls: 'abs', style: { width: '22px', height: '22px', borderColor: 'var(--hair2)', ...s } }, hud))
let secGeo = []

function renderHud(t) {
  const f = Math.floor(t * FPS + 1e-6)
  const k = ease(t, 0.12, 0.7)
  hud.style.opacity = String(k)
  corners.forEach((c) => (c.style.transform = `scale(${(0.4 + 0.6 * k).toFixed(3)})`))
  tc.textContent = `00:00:${String(Math.floor(f / FPS)).padStart(2, '0')}:${String(f % FPS).padStart(2, '0')}`
  const beatPhase = (t * (TL.bpm / 60)) % 1
  recDot.style.opacity = t >= TL.audio.finalHit ? '1' : beatPhase < 0.4 ? '1' : '0.28'
  let idx = 0
  TL.sections.forEach((s, i) => {
    if (t >= s.at) idx = i
  })
  secItems.forEach((s, i) => (s.style.color = i === idx ? 'var(--ink)' : 'var(--ink3)'))
  if (secGeo.length) {
    const from = secGeo[Math.max(0, idx - 1)], to = secGeo[idx]
    const m = idx === 0 ? 1 : ease(t, TL.sections[idx].at, TL.sections[idx].at + 0.4, eio)
    secBar.style.transform = `translate3d(${lerp(from.x, to.x, m).toFixed(1)}px,0,0) scaleX(${(lerp(from.w, to.w, m) / 100).toFixed(4)})`
  }
  progress.style.transform = `scaleX(${(t / TL.duration).toFixed(5)})`
}

const vignette = el('div', { cls: 'layer', style: { zIndex: 58, pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, rgba(0,0,0,0.42) 100%)' } })
const GRAIN = Array.from({ length: 8 }, (_, i) => {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const img = g.createImageData(256, 256)
  const r = rng(100 + i)
  for (let p = 0; p < img.data.length; p += 4) {
    const v = 128 + (r() - 0.5) * 255
    img.data[p] = img.data[p + 1] = img.data[p + 2] = v
    img.data[p + 3] = 255
  }
  g.putImageData(img, 0, 0)
  return c.toDataURL()
})
const grain = el('div', { cls: 'layer', style: { zIndex: 60, pointerEvents: 'none', opacity: 0.1, mixBlendMode: 'overlay', backgroundSize: '256px 256px' } })
function renderGrain(t) {
  const f = Math.floor(t * FPS + 1e-6)
  const r = rng(f + 1)
  grain.style.backgroundImage = `url(${GRAIN[f % GRAIN.length]})`
  grain.style.backgroundPosition = `${Math.floor(r() * 256)}px ${Math.floor(r() * 256)}px`
}

/* ====================================================================== */
/* boot                                                                    */
/* ====================================================================== */

function renderFrame(t) {
  const att = renderGL(t)
  renderDroneOverlay(t, att)
  renderName(t)
  renderLoop(t)
  renderEntries(t)
  renderField(t)
  renderRoles(t)
  renderTags(t)
  renderSign(t)
  renderHud(t)
  renderGrain(t)
}

await document.fonts.ready
await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
// geometry that depends on real glyph metrics
{
  const r = nameChars[1][nameChars[1].length - 1].getBoundingClientRect()
  const s = stage.getBoundingClientRect()
  nameDot.style.left = `${r.right - s.left + 4}px`
  nameDot.style.top = `${r.top - s.top}px`
  secGeo = secItems.map((n) => {
    const b = n.getBoundingClientRect()
    return { x: b.left - s.left, w: b.width }
  })
  layoutTags()
  // fit every entry title to its column using real glyph widths
  for (const sh of SHEETS) {
    const widest = Math.max(...sh.title.map((l) => l.scrollWidth))
    if (widest > COL.w) {
      const fs = Math.floor(74 * (COL.w / widest))
      sh.title.forEach((l) => (l.style.fontSize = `${fs}px`))
    }
  }
}
window.renderFrame = renderFrame
window.__timeline = TL
window.__ready = true
renderFrame(0)

if (new URLSearchParams(location.search).has('play')) {
  const t0 = performance.now()
  const loop = () => {
    const t = ((performance.now() - t0) / 1000) % TL.duration
    renderFrame(t)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
