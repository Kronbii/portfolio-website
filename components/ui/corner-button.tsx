'use client'

import React, { useState } from 'react'

// Corner decoration component with hover animation
const CornerDecoration = ({ 
  position, 
  isHovered,
  lineColor 
}: { 
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  isHovered: boolean
  lineColor: string
}) => {
  // Position and transform values for each corner
  const cornerConfig = {
    topLeft: {
      basePos: 'top-[-4px] left-[-4px]',
      transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
    },
    topRight: {
      basePos: 'top-[-4px] right-[-4px]',
      transform: isHovered ? 'translate(2px, -2px) rotate(90deg)' : 'translate(0, 0) rotate(90deg)',
    },
    bottomLeft: {
      basePos: 'bottom-[-4px] left-[-4px]',
      transform: isHovered ? 'translate(-2px, 2px) rotate(-90deg)' : 'translate(0, 0) rotate(-90deg)',
    },
    bottomRight: {
      basePos: 'bottom-[-4px] right-[-4px]',
      transform: isHovered ? 'translate(2px, 2px) rotate(180deg)' : 'translate(0, 0) rotate(180deg)',
    },
  }

  const config = cornerConfig[position]

  return (
    <div 
      className={`absolute ${config.basePos} w-2 h-2 transition-all duration-300`}
      style={{ transform: config.transform }}
    >
      <div 
        className="absolute top-0 left-0 w-[1px] transition-all duration-300"
        style={{ 
          height: isHovered ? '12px' : '8px',
          backgroundColor: lineColor,
        }}
      />
      <div 
        className="absolute top-0 left-0 h-[1px] transition-all duration-300"
        style={{ 
          width: isHovered ? '12px' : '8px',
          backgroundColor: lineColor,
        }}
      />
    </div>
  )
}

interface CornerButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'primary'
  disabled?: boolean
  style?: React.CSSProperties
}

export function CornerButton({ 
  href, 
  onClick, 
  children, 
  className = '',
  type = 'button',
  variant = 'default',
  disabled = false,
  style
}: CornerButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Variant styles - only background and text colors differ
  const variantStyles = {
    default: {
      bg: 'var(--color-accent)',
      text: 'var(--color-secondary)',
      lineColor: 'var(--color-secondary)',
    },
    primary: {
      bg: 'var(--color-secondary)',
      text: 'var(--color-accent)',
      lineColor: 'var(--color-secondary)',
    }
  }

  const currentVariant = variantStyles[variant]
  
  const baseClasses = `relative inline-flex items-center justify-center h-8 sm:h-10 px-3 sm:px-6 uppercase font-normal tracking-wide transition-opacity hover:opacity-80 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`
  
  const baseStyles = {
    outline: 'none',
    boxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
    fontSize: 'clamp(12px, 2.5vw, 20px)',
    backgroundColor: currentVariant.bg,
    color: currentVariant.text,
    overflow: 'visible',
    position: 'relative',
    ...style
  } as React.CSSProperties

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.currentTarget.style.outline = 'none'
    e.currentTarget.style.boxShadow = 'none'
  }

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.currentTarget.style.outline = 'none'
    e.currentTarget.style.boxShadow = 'none'
  }

  const content = (
    <>
      <CornerDecoration position="topLeft" isHovered={isHovered} lineColor={currentVariant.lineColor} />
      <CornerDecoration position="topRight" isHovered={isHovered} lineColor={currentVariant.lineColor} />
      <CornerDecoration position="bottomLeft" isHovered={isHovered} lineColor={currentVariant.lineColor} />
      <CornerDecoration position="bottomRight" isHovered={isHovered} lineColor={currentVariant.lineColor} />
      <span style={{ color: currentVariant.text, zIndex: 1, position: 'relative' }} className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        style={baseStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      style={baseStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {content}
    </button>
  )
}
