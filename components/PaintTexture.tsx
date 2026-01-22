'use client'

import { useState, useEffect } from 'react'

export default function PaintTexture() {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = '/paint.png'
    img.onload = () => {
      setAspectRatio(img.height / img.width)
    }
  }, [])

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        width: 'var(--paint-texture-width, 100%)',
        mixBlendMode: 'var(--paint-texture-blend-mode, normal)',
        zIndex: 0,
        top: 'var(--paint-texture-top, 100vh)', // Position near Community section (after Hero)
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: aspectRatio ? `${aspectRatio * 100}%` : 'var(--paint-texture-height, 15%)',
          transform: 'scaleY(var(--paint-texture-height-scale, 1))',
          transformOrigin: 'top center',
        }}
      >
        {/* Base texture with gradient color and gradient opacity */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--paint-texture-gradient, linear-gradient(to bottom, var(--paint-texture-color-start, #EDEDED), var(--paint-texture-color-end, #FDFDFD)))',
            opacity: 'var(--paint-texture-opacity, 1)',
            maskImage: 'var(--paint-texture-opacity-gradient, linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1))), url(/paint.png)',
            WebkitMaskImage: 'var(--paint-texture-opacity-gradient, linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1))), url(/paint.png)',
            maskSize: '100% 100%, 100% 100%',
            WebkitMaskSize: '100% 100%, 100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'top center',
            WebkitMaskPosition: 'top center',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />
      </div>
    </div>
  )
}
