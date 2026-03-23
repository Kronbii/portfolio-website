import { type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-surface p-6 shadow-soft transition-shadow duration-300',
        className
      )}
      {...props}
    />
  )
}
