import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ContainerProps {
  className?: string
  children: ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12',
        className
      )}
    >
      {children}
    </div>
  )
}
