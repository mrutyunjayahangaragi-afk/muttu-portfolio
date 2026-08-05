"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingProps {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
  delay?: number
}

export function Floating({
  children,
  className,
  y = 15,
  duration = 4,
  delay = 0,
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
