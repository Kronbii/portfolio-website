"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BaseHoverButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "outline"
}

interface ButtonProps extends BaseHoverButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never
}

interface LinkProps extends BaseHoverButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string
}

type HoverButtonProps = ButtonProps | LinkProps

const HoverButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, HoverButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement | null>(null) as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>
    const isLink = 'href' in props
    const [isListening, setIsListening] = React.useState(false)
    
    // Callback ref to set both forwarded ref and internal ref
    const setButtonRef = React.useCallback((node: HTMLButtonElement | HTMLAnchorElement | null) => {
      buttonRef.current = node
      if (typeof ref === 'function') {
        ref(node as HTMLButtonElement & HTMLAnchorElement)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>).current = node
      }
    }, [ref])
    const [circles, setCircles] = React.useState<Array<{
      id: number
      x: number
      y: number
      color: string
      fadeState: "in" | "out" | null
    }>>([])
    const lastAddedRef = React.useRef(0)

    const createCircle = React.useCallback((x: number, y: number) => {
      const buttonWidth = buttonRef.current?.offsetWidth || 0
      const xPos = x / buttonWidth
      const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${
        xPos * 100
      }%)`

      setCircles((prev) => [
        ...prev,
        { id: Date.now(), x, y, color, fadeState: null },
      ])
    }, [])

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (!isListening) return
        
        const currentTime = Date.now()
        if (currentTime - lastAddedRef.current > 100) {
          lastAddedRef.current = currentTime
          const rect = event.currentTarget.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          createCircle(x, y)
        }
      },
      [isListening, createCircle]
    )

    const handlePointerEnter = React.useCallback(() => {
      setIsListening(true)
    }, [])

    const handlePointerLeave = React.useCallback(() => {
      setIsListening(false)
    }, [])

    React.useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "in" } : c
              )
            )
          }, 0)

          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "out" } : c
              )
            )
          }, 1000)

          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id))
          }, 2200)
        }
      })
    }, [circles])

    const baseClasses = cn(
      "relative isolate px-8 py-3 rounded-3xl",
      "text-foreground font-medium text-base leading-6",
      "cursor-pointer overflow-hidden inline-flex items-center justify-center",
      "before:content-[''] before:absolute before:inset-0",
      "before:rounded-[inherit] before:pointer-events-none",
      "before:z-[1]",
      "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
      "before:mix-blend-multiply before:transition-transform before:duration-300",
      "active:before:scale-[0.975]",
    )

    const variantClasses = {
      default: "backdrop-blur-lg bg-light-surface2/50 dark:bg-[rgba(43,55,80,0.1)] text-[#252525]",
      gradient: "bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white",
      outline: "border border-light-border/50 dark:border-white/15 bg-light-surface2/30 dark:bg-white/5 backdrop-blur-lg text-[#252525]",
    }

    const commonProps = {
      ref: setButtonRef,
      className: cn(baseClasses, variantClasses[variant], className),
      onPointerMove: handlePointerMove,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      style: {
        "--circle-start": "var(--tw-gradient-from, #a0d9f8)",
        "--circle-end": "var(--tw-gradient-to, #3a5bbf)",
      } as React.CSSProperties,
    }

    const { href, ...restProps } = props as any

    if (isLink && href) {
      const isExternal = href.startsWith('http://') || href.startsWith('https://')
      const isHashLink = href.startsWith('#')
      const isMailto = href.startsWith('mailto:')
      
      const circleElements = circles.map(({ id, x, y, color, fadeState }) => (
        <div
          key={id}
          className={cn(
            "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
            "blur-lg pointer-events-none z-[-1] transition-opacity duration-300",
            fadeState === "in" && "opacity-75",
            fadeState === "out" && "opacity-0 duration-[1.2s]",
            !fadeState && "opacity-0"
          )}
          style={{
            left: x,
            top: y,
            background: color,
          }}
        />
      ))

      // External links (http/https) - open in new tab
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...commonProps}
            {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {circleElements}
            {children}
          </a>
        )
      }

      // Hash links and mailto links - use regular anchor tag (same page navigation)
      if (isHashLink || isMailto) {
        return (
          <a
            href={href}
            {...commonProps}
            {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {circleElements}
            {children}
          </a>
        )
      }

      // Internal Next.js routes - use Next.js Link
      return (
        <Link
          href={href}
          {...(restProps as any)}
          className={commonProps.className}
          style={commonProps.style}
          onPointerMove={commonProps.onPointerMove}
          onPointerEnter={commonProps.onPointerEnter}
          onPointerLeave={commonProps.onPointerLeave}
          ref={setButtonRef as any}
        >
          {circleElements}
          {children}
        </Link>
      )
    }

    return (
      <button
        {...commonProps}
        {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {circles.map(({ id, x, y, color, fadeState }) => (
          <div
            key={id}
            className={cn(
              "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "blur-lg pointer-events-none z-[-1] transition-opacity duration-300",
              fadeState === "in" && "opacity-75",
              fadeState === "out" && "opacity-0 duration-[1.2s]",
              !fadeState && "opacity-0"
            )}
            style={{
              left: x,
              top: y,
              background: color,
            }}
          />
        ))}
        {children}
      </button>
    )
  }
)

HoverButton.displayName = "HoverButton"

export { HoverButton }

