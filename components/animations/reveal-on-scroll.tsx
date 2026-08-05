"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { easings, durations } from "@/lib/design-tokens"

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: "fade" | "slide-up" | "scale" | "blur"
  once?: boolean
}

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  animation = "slide-up",
  once = true,
}: RevealOnScrollProps) {
  return (
    <motion.div
      variants={variants[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: durations.slower, delay, ease: easings.out }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
