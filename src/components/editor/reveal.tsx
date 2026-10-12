"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  /**
   * Slide in without fading from 0. Use it above the fold (hero): server-rendered HTML then shows the text
   * immediately instead of waiting for hydration (LCP), and crawlers / link previews see it.
   */
  noFade?: boolean
}

/**
 * Fades a section in (and slides it up slightly) the first time it scrolls into view.
 * Respects prefers-reduced-motion: then it renders a plain <section>.
 */
export function Reveal({ children, className, id, delay = 0, noFade = false }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={noFade ? { opacity: 1, y: 16 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.section>
  )
}

type RevealItemProps = {
  children: ReactNode
  className?: string
  index?: number
  /** Render as a list item (inside <ul>/<ol>) so the list stays valid HTML. */
  as?: "div" | "li"
  noFade?: boolean
}

/** Staggered child for hero elements, card lists and step lists. */
export function RevealItem({ children, className, index = 0, as = "div", noFade = false }: RevealItemProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>
  }

  const props = {
    className,
    initial: noFade ? { opacity: 1, y: 12 } : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px 0px" },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.08 * index },
  }

  return as === "li" ? <motion.li {...props}>{children}</motion.li> : <motion.div {...props}>{children}</motion.div>
}
