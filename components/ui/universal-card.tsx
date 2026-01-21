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
      className={`group relative overflow-hidden border border-[#212121]/30 bg-transparent flex-shrink-0 transition-all duration-75 flex flex-col ${
        isCentered 
          ? '-translate-y-4 scale-[1.03] z-10' 
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: '450px',
        height: '600px',
        boxShadow: isCentered 
          ? '0 20px 25px -5px rgba(37, 37, 37, 0.1), 0 10px 10px -5px rgba(37, 37, 37, 0.04)' 
          : '0 1px 2px 0 rgba(37, 37, 37, 0.05)',
      }}
      whileHover={{ y: isCentered ? -20 : -4 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative flex-shrink-0 overflow-hidden bg-[#EAEAEA]" style={{
        height: '297px',
      }}>
        {hasImage ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            style={{ objectPosition: imagePosition }}
            unoptimized
            onError={handleImageError}
          />
        ) : showImagePlaceholder ? (
          <div className="w-full h-full flex items-center justify-center text-[#252525]/30">
            <FiImage size={48} />
          </div>
        ) : null}
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-[#252525] font-medium mb-3 flex-shrink-0" style={{
          fontSize: '30px',
        }}>
          {title}
        </h3>
        <div className="border-t border-[#212121]/30 mb-3 flex-shrink-0" />
        {description && (
          <p className="text-[#252525] font-light flex-1" style={{
            fontSize: '20px',
          }}>
            {description}
          </p>
        )}
        {children}
        {date && (
          <p className="text-xs text-[#252525]/70 mt-2 flex-shrink-0">
            {date}
          </p>
        )}
      </div>
    </motion.div>
  )
}
