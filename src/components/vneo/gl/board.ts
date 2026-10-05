'use client'

import type * as THREE_NS from 'three'

import type { Three } from '@/components/v6/gl/host'

/*
 * The ground the pack walks on: a circuit board, drawn in a shader. Traces
 * route in runs along a 0.5 m pitch, meeting at pads; vias are scattered,
 * and some blocks hold a chip's outline with its pins. Packets of signal run
 * along the traces (uTime), and a scan ring (uScan, its radius) sweeps out
 * from a point and lights what it passes. The board fades with distance into
 * the frame's own ground.
 */

export function makeBoard(THREE: Three, accent: string) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uScan: { value: 0 },
      uScanA: { value: 0 },
      uScanC: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(accent) },
      uHot: { value: new THREE.Color('#a6e68f') },
      uNear: { value: 0.5 },
      uFar: { value: 26 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vP; varying float vDist;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vP = world.xz;
        vec4 view = viewMatrix * world; vDist = -view.z;
        gl_Position = projectionMatrix * view;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uOpacity; uniform float uScan; uniform float uScanA;
      uniform vec2 uScanC; uniform vec3 uColor; uniform vec3 uHot; uniform float uNear; uniform float uFar;
      varying vec2 vP; varying float vDist;
      float h1(float x) { return fract(sin(x * 91.7 + 3.1) * 43758.5453); }
      float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float band(float d, float w) { float aa = fwidth(d) * 0.8; return 1.0 - smoothstep(w - aa, w + aa, abs(d)); }
      void main() {
        vec2 g = vP / 0.5;
        vec2 c = floor(g);
        vec2 f = g - c - 0.5;
        // traces: some rows and columns route, in runs of a few cells
        float rowOn = step(0.6, h1(c.y));
        float runH = step(0.32, h2(vec2(floor((c.x + h1(c.y + 7.0) * 9.0) / 5.0), c.y)));
        float colOn = step(0.68, h1(c.x + 41.0));
        float runV = step(0.36, h2(vec2(c.x, floor((c.y + h1(c.x + 3.0) * 7.0) / 4.0)) + 9.1));
        float th = rowOn * runH * band(f.y, 0.06);
        float tv = colOn * runV * band(f.x, 0.06);
        float trace = max(th, tv);
        float pad = rowOn * runH * colOn * runV * band(length(f), 0.16);
        float via = step(0.92, h2(c * 1.7 + 4.2)) * band(length(f) - 0.14, 0.04);
        // chips: a package outline, pins along its sides, in one block of sixteen in eight
        vec2 bc = floor(g / 4.0);
        vec2 bf = g / 4.0 - bc - 0.5;
        float chipOn = step(0.88, h2(bc + 31.7));
        vec2 ad = abs(bf);
        float inBody = step(max(ad.x, ad.y), 0.3);
        float edge = band(max(ad.x, ad.y) - 0.3, 0.008);
        float pinsX = step(ad.y, 0.24) * step(0.31, ad.x) * step(ad.x, 0.37) * step(0.5, fract(bf.y * 14.0 + 0.25));
        float pinsY = step(ad.x, 0.24) * step(0.31, ad.y) * step(ad.y, 0.37) * step(0.5, fract(bf.x * 14.0 + 0.25));
        float chip = chipOn * (edge + max(pinsX, pinsY) * 0.8);
        trace *= 1.0 - chipOn * inBody;
        // signal: packets running along the traces
        float sh = smoothstep(0.93, 1.0, fract(vP.x * 0.11 - uTime * 0.85 + h1(c.y + 1.0) * 5.0));
        float sv = smoothstep(0.93, 1.0, fract(vP.y * 0.11 - uTime * 0.85 + h1(c.x + 2.0) * 5.0));
        float sig = th * sh + tv * sv;
        // the scan ring
        float d = length(vP - uScanC);
        float ring = exp(-pow((d - uScan) / 0.3, 2.0)) * uScanA;
        float wake = smoothstep(uScan, uScan - 3.0, d) * uScanA * 0.6;
        float lit = 0.1 + ring * 2.4 + wake * 0.45;
        vec3 col = uColor * (trace * lit + pad * lit * 1.2 + via * 0.22 + chip * 0.3) + uHot * (sig * 1.1 + ring * 0.35);
        float a = clamp(trace * lit + pad * lit + via * 0.18 + chip * 0.26 + chipOn * inBody * 0.5 + sig * 0.85 + ring * 0.3, 0.0, 1.0);
        float fade = smoothstep(uFar, uFar * 0.4, vDist) * smoothstep(uNear, uNear + 1.2, vDist);
        float alpha = a * fade * uOpacity;
        if (alpha < 0.003) discard;
        gl_FragColor = vec4(min(col / max(a, 0.001), vec3(1.6)), alpha);
      }`,
  })
  const geo = new THREE.PlaneGeometry(140, 140)
  geo.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.renderOrder = -2
  return { mesh, mat, geo }
}

/** Soft contact shadows, one under each robot. */
export function makeShadows(THREE: Three, n: number) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64)
  grad.addColorStop(0, 'rgba(0,0,0,0.6)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  const geo = new THREE.PlaneGeometry(1, 1)
  geo.rotateX(-Math.PI / 2)
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  })
  const mesh = new THREE.InstancedMesh(geo, mat, n)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  mesh.renderOrder = -1
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const p = new THREE.Vector3()
  const s = new THREE.Vector3()
  const set = (i: number, x: number, z: number, heading: number, lift = 0) => {
    const k = Math.max(0.35, 1 - lift * 1.6)
    q.setFromAxisAngle(up, heading)
    p.set(x, 0.004, z)
    s.set(0.95 * k, 1, 0.5 * k)
    mesh.setMatrixAt(i, m.compose(p, q, s))
  }
  return {
    mesh,
    set,
    commit: () => (mesh.instanceMatrix.needsUpdate = true),
    dispose: () => {
      geo.dispose()
      mat.dispose()
      tex.dispose()
    },
  }
}

/**
 * The letters' wiring: a lit trace between every two robots that stand next
 * to each other in a letter, and a pad under each, flat on the board.
 */
export function makeRoutes(
  THREE: Three,
  cells: [number, number][],
  at: (c: [number, number]) => [number, number]
) {
  const has = new Set(cells.map(([c, r]) => `${c},${r}`))
  const edges: [[number, number], [number, number]][] = []
  cells.forEach(([c, r]) => {
    for (const [dc, dr] of [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ]) {
      if (!has.has(`${c + dc},${r + dr}`)) continue
      // a diagonal only where no square corner already joins the two
      if (dc && dr && (has.has(`${c + dc},${r}`) || has.has(`${c},${r + dr}`)))
        continue
      edges.push([
        [c, r],
        [c + dc, r + dr],
      ])
    }
  })
  const mat = new THREE.MeshBasicMaterial({
    color: '#a6e68f',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const group = new THREE.Group()
  const bar = new THREE.PlaneGeometry(1, 0.075)
  bar.rotateX(-Math.PI / 2)
  const lines = new THREE.InstancedMesh(bar, mat, edges.length)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  edges.forEach(([a, b], i) => {
    const [ax, az] = at(a)
    const [bx, bz] = at(b)
    const len = Math.hypot(bx - ax, bz - az)
    q.setFromAxisAngle(up, Math.atan2(-(bz - az), bx - ax))
    m.compose(
      new THREE.Vector3((ax + bx) / 2, 0.012, (az + bz) / 2),
      q,
      new THREE.Vector3(len, 1, 1)
    )
    lines.setMatrixAt(i, m)
  })
  const ring = new THREE.RingGeometry(0.3, 0.37, 40)
  ring.rotateX(-Math.PI / 2)
  // the pads carry their own colour, so each can flash as its robot leaves the board
  const padMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const pads = new THREE.InstancedMesh(ring, padMat, cells.length)
  const green = new THREE.Color('#a6e68f')
  const hot = new THREE.Color('#f4fff0')
  const tint = new THREE.Color()
  cells.forEach((cell, i) => {
    const [x, z] = at(cell)
    pads.setMatrixAt(i, m.makeTranslation(x, 0.014, z))
    pads.setColorAt(i, green)
  })
  lines.frustumCulled = pads.frustumCulled = false
  group.add(lines, pads)
  return {
    group,
    /** Lines and pads, together. */
    set opacity(v: number) {
      mat.opacity = v
      padMat.opacity = v
    },
    /** Pad i at its rest colour (0) or flashing (1, and brighter). */
    flash: (i: number, k: number) => {
      tint
        .copy(green)
        .lerp(hot, Math.min(1, k))
        .multiplyScalar(1 + k * 1.4)
      pads.setColorAt(i, tint)
    },
    commit: () => {
      if (pads.instanceColor) pads.instanceColor.needsUpdate = true
    },
    dispose: () => {
      bar.dispose()
      ring.dispose()
      mat.dispose()
      padMat.dispose()
    },
  }
}
