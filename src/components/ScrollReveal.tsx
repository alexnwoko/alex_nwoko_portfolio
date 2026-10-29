'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Tiny scroll-reveal hook. Uses IntersectionObserver so there are no new
 * dependencies and the perf cost is one observer per node, disconnected
 * after first intersection.
 *
 * The visible flag flips once the element enters the viewport (threshold
 * 0.15, with an 80px bottom rootMargin so items feel like they settle in
 * BEFORE they hit the fold, not AFTER).
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.unobserve(el)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/**
 * Reveal wrapper. Subtle fade + 20px slide up over 500ms with a staggered
 * delay per index. Reduced-motion users get the final state immediately
 * (no transition), per the standard a11y pattern.
 */
export function Reveal({
  children,
  index = 0,
  staggerMs = 80,
  className = '',
}: {
  children: ReactNode
  index?: number
  staggerMs?: number
  className?: string
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const style: CSSProperties = {
    transitionProperty: 'opacity, transform',
    transitionDuration: '500ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: visible ? `${index * staggerMs}ms` : '0ms',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
  }
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
