'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLayoutEffect, type ComponentProps, type MouseEvent } from 'react'

/*
 * Navigation as sheets of paper. A SheetLink wraps the route change in a view
 * transition; the promise it hands the browser resolves once the new route has
 * committed, which <SheetWatcher /> reports from the layout.
 */

let settle: (() => void) | null = null

function finish() {
  const done = settle
  settle = null
  done?.()
}

interface SheetLinkProps extends ComponentProps<typeof Link> {
  href: string
  /** forward slides a new sheet over the current one; back lifts it away. */
  direction?: 'forward' | 'back'
}

export function SheetLink({ href, direction = 'forward', onClick, ...rest }: SheetLinkProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = new URL(href, window.location.href)
    if (target.origin !== window.location.origin) return
    if (target.pathname === pathname) return
    const doc = document as Document & {
      startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> }
    }
    if (!doc.startViewTransition) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    document.documentElement.dataset.v2Vt = direction
    const transition = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve
          router.push(target.pathname + target.search + target.hash)
          // Never hold the page hostage if the route takes too long.
          window.setTimeout(finish, 1600)
        }),
    )
    transition.finished.finally(() => {
      delete document.documentElement.dataset.v2Vt
    })
  }

  return <Link href={href} onClick={handle} {...rest} />
}

/**
 * Mounted once in the layout: resolves the pending sheet when the route
 * commits. A layout effect, not requestAnimationFrame: the browser suppresses
 * rendering (and with it rAF) while a view transition waits on its update, so
 * a frame callback would only fire after the safety timeout.
 */
export function SheetWatcher() {
  const pathname = usePathname()
  useLayoutEffect(() => {
    if (settle) finish()
  }, [pathname])
  return null
}
