'use client'

import type * as THREE_NS from 'three'

import { hash } from '../armed'
import type { Three } from './host'

/*
 * The reel's ground: a simplex-noise terrain drawn only as burgundy contour
 * lines and a faint grid, fading with distance, with speed motes over it.
 * Uniforms move it (uTime scrolls the ground toward the camera).
 */

export function makeTerrain(THREE: Three) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uShift: { value: 0 },
      uColor: { value: new THREE.Color('#c9686a') },
      uOpacity: { value: 0 },
      uNear: { value: 1.5 },
      uGrid: { value: 0.1 },
      uFar: { value: 42 },
    },
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
  const geo = new THREE.PlaneGeometry(90, 70, 300, 240)
  geo.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  return { mesh, mat, geo }
}

export function makeMotes(THREE: Three, n = 420) {
  const base = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    base[i * 3] = (hash(i, 11) - 0.5) * 14
    base[i * 3 + 1] = (hash(i, 12) - 0.35) * 4
    base[i * 3 + 2] = -hash(i, 13) * 40
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(n * 3), 3)
  )
  const mat = new THREE.PointsMaterial({
    color: 0xfbf5ea,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  /** Move the motes toward the camera by `travel`, scaled. */
  const move = (travel: number, sx = 1, sy = 1, dy = 0) => {
    const p = geo.attributes.position as THREE_NS.BufferAttribute
    for (let i = 0; i < n; i++) {
      const z = ((((base[i * 3 + 2] + travel) % 40) + 40) % 40) - 40
      p.setXYZ(i, base[i * 3] * sx, base[i * 3 + 1] * sy + dy, z)
    }
    p.needsUpdate = true
  }
  return { points, geo, mat, move }
}
