"use client"

import { motion, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { easings } from "@/lib/design-tokens"

interface FadeInProps extends MotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  once?: boolean
  blur?: boolean
}

const directionMap = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  blur = false,
  ...props
}: FadeInProps) {
  const { x, y } = directionMap[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: easings.out }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
