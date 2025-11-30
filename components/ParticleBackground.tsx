'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const { theme } = useTheme()
  const { viewport, mouse } = useThree()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // Generate particles
  const particleCount = 2000
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Spread particles across a larger volume
      pos[i3] = (Math.random() - 0.5) * 20
      pos[i3 + 1] = (Math.random() - 0.5) * 20
      pos[i3 + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  // Mouse tracking for subtle interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    
    // Slow continuous rotation
    ref.current.rotation.x = state.clock.elapsedTime * 0.02
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
    
    // Subtle mouse following
    ref.current.rotation.x += mousePos.y * 0.02
    ref.current.rotation.y += mousePos.x * 0.02
  })

  // Color based on theme
  const particleColor = theme === 'dark' ? '#4285f4' : '#4285f4'

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={particleColor}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={theme === 'dark' ? 0.6 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function GradientOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)
  const { theme } = useTheme()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.2) * 3
      orb1Ref.current.position.y = Math.cos(t * 0.15) * 2
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.18) * 4
      orb2Ref.current.position.y = Math.sin(t * 0.22) * 3
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(t * 0.12) * 2.5
      orb3Ref.current.position.y = Math.cos(t * 0.2) * 2
    }
  })

  const opacity = theme === 'dark' ? 0.15 : 0.08

  return (
    <>
      {/* Primary blue orb */}
      <mesh ref={orb1Ref} position={[-3, 2, -5]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#4285f4" transparent opacity={opacity} />
      </mesh>
      
      {/* Purple orb */}
      <mesh ref={orb2Ref} position={[4, -1, -6]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={opacity * 0.8} />
      </mesh>
      
      {/* Cyan orb */}
      <mesh ref={orb3Ref} position={[0, 3, -4]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={opacity * 0.6} />
      </mesh>
    </>
  )
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <GradientOrbs />
      </Canvas>
      
      {/* Additional gradient overlays */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? `
                radial-gradient(ellipse 80% 50% at 20% 20%, rgba(66, 133, 244, 0.12), transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 10%, rgba(6, 182, 212, 0.1), transparent 50%),
                radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139, 92, 246, 0.08), transparent 50%)
              `
            : `
                radial-gradient(ellipse 80% 50% at 20% 20%, rgba(66, 133, 244, 0.06), transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 10%, rgba(6, 182, 212, 0.04), transparent 50%),
                radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139, 92, 246, 0.04), transparent 50%)
              `
        }}
      />
    </div>
  )
}

