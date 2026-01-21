'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import { FiImage } from 'react-icons/fi'

interface UniversalCardProps {
  image?: string | null
  imageAlt: string
  title: string
  description?: string
  date?: string
  isCentered?: boolean
  isInView?: boolean
  onClick?: () => void
  onImageError?: () => void
  imagePosition?: string
  children?: ReactNode
  className?: string
  showImagePlaceholder?: boolean
  cardWidth?: number
  cardHeight?: number
}

export function UniversalCard({
  image,
  imageAlt,
  title,
  description,
  date,
  isCentered = false,
  isInView = true,
  onClick,
  onImageError,
  imagePosition = 'center top',
  children,
  className = '',
  showImagePlaceholder = true,
  cardWidth = 450,
  cardHeight = 600,
}: UniversalCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasImage = image && !imageError

  const handleImageError = () => {
    setImageError(true)
    onImageError?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
      transition={{ duration: 0.15 }}
      className={`group relative overflow-hidden border bg-transparent flex-shrink-0 transition-all duration-75 flex flex-col ${
        isCentered 
          ? '-translate-y-4 scale-[1.03] z-10' 
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        borderColor: 'rgba(33, 33, 33, 0.3)', // var(--color-border) with 30% opacity
        boxShadow: isCentered 
          ? '0 20px 25px -5px rgba(37, 37, 37, 0.1), 0 10px 10px -5px rgba(37, 37, 37, 0.04)' 
          : '0 1px 2px 0 rgba(37, 37, 37, 0.05)',
      }}
      whileHover={{ y: isCentered ? -20 : -4 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{
        backgroundColor: 'var(--color-primary)',
        height: `${(cardHeight * 297) / 600}px`, // Maintain proportional height
        padding: `${(cardWidth * 12) / 450}px`, // Add padding around image (inset)
      }}>
        {hasImage ? (
          <div className="relative w-full h-full overflow-hidden rounded-sm" style={{ border: 'none', outline: 'none' }}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              style={{ 
                objectPosition: imagePosition,
                border: 'none',
                outline: 'none',
              }}
              unoptimized
              onError={handleImageError}
            />
            {/* Bottom fade gradient */}
            <div 
              className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
              style={{
                height: '50%',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(234, 234, 234, 0.3) 50%, var(--color-primary) 100%)',
              }}
            />
          </div>
        ) : showImagePlaceholder ? (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(37, 37, 37, 0.3)' }}>
            <FiImage size={48} />
          </div>
        ) : null}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col" style={{ padding: `${(cardWidth * 24) / 450}px` }}>
        <h3 className="font-medium mb-3 flex-shrink-0" style={{
          color: 'var(--color-secondary)',
          fontSize: `${(cardWidth * 30) / 450}px`, // Scale font size proportionally
        }}>
          {title}
        </h3>
        <div className="border-t mb-3 flex-shrink-0" style={{ borderColor: 'rgba(33, 33, 33, 0.3)' }} />
        {description && (
          <p className="font-light flex-1" style={{
            color: 'var(--color-secondary)',
            fontSize: `${(cardWidth * 20) / 450}px`, // Scale font size proportionally
          }}>
            {description}
          </p>
        )}
        {children}
        {date && (
          <p className="text-xs mt-2 flex-shrink-0" style={{ color: 'rgba(37, 37, 37, 0.7)' }}>
            {date}
          </p>
        )}
      </div>
    </motion.div>
  )
}
