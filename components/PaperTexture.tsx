'use client'

import { useState, useEffect } from 'react'

export default function PaperTexture() {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = '/paper.png'
    img.onload = () => {
      setAspectRatio(img.height / img.width)
    }
  }, [])

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        width: 'var(--paper-texture-width, 100%)',
        mixBlendMode: 'var(--paper-texture-blend-mode, normal)' as React.CSSProperties['mixBlendMode'],
        zIndex: 0,
      } as React.CSSProperties}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: aspectRatio ? `${aspectRatio * 100}%` : 'var(--paper-texture-height, 15%)',
          transform: 'scaleY(var(--paper-texture-height-scale, 1))',
          transformOrigin: 'top center',
        }}
      >
        {/* Base texture with gradient color and gradient opacity */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--paper-texture-gradient, linear-gradient(to bottom, var(--paper-texture-color-start, #EDEDED), var(--paper-texture-color-end, #FDFDFD)))',
            opacity: 'var(--paper-texture-opacity, 1)',
            maskImage: 'var(--paper-texture-opacity-gradient, linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1))), url(/paper.png)',
            WebkitMaskImage: 'var(--paper-texture-opacity-gradient, linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1))), url(/paper.png)',
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
