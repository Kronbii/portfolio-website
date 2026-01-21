'use client'

import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

interface ExploreNavigationProps {
  onPrevious: () => void
  onNext: () => void
  previousLabel?: string
  nextLabel?: string
  label?: string
}

export function ExploreNavigation({
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  label = 'EXPLORE',
}: ExploreNavigationProps) {
  return (
    <div className="flex justify-center items-center gap-12 mt-8">
      {/* Left Arrow Button */}
      <button
        onClick={onPrevious}
        className="relative flex items-center justify-center w-10 h-10 group"
        aria-label={previousLabel}
        style={{ color: 'var(--color-secondary)' }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute top-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute top-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute top-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
          <div className="absolute bottom-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute bottom-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
          <div className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute bottom-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        {/* Arrow icon */}
        <FiArrowLeft size={18} className="relative z-10" />
      </button>

      {/* Label Text */}
      <span 
        className="text-xl uppercase tracking-wider font-light"
        style={{ color: 'var(--color-secondary)' }}
      >
        {label}
      </span>

      {/* Right Arrow Button */}
      <button
        onClick={onNext}
        className="relative flex items-center justify-center w-10 h-10 group"
        aria-label={nextLabel}
        style={{ color: 'var(--color-secondary)' }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute top-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute top-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute top-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
          <div className="absolute bottom-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute bottom-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
          <div className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
          <div className="absolute bottom-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
        {/* Arrow icon */}
        <FiArrowRight size={18} className="relative z-10" />
      </button>
    </div>
  )
}
