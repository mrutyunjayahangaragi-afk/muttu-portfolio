"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  offset?: number
  direction?: "up" | "down" | "left" | "right"
}

export function Parallax({
  children,
  className,
  offset = 50,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Set up transforms based on direction
  const y = useTransform(scrollYProgress, [0, 1], direction === "up" ? [offset, -offset] : direction === "down" ? [-offset, offset] : [0, 0])
  const x = useTransform(scrollYProgress, [0, 1], direction === "left" ? [offset, -offset] : direction === "right" ? [-offset, offset] : [0, 0])

  return (
    <motion.div ref={ref} style={{ x, y }} className={cn(className)}>
      {children}
    </motion.div>
  )
}
