"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface CursorGlowProps {
  className?: string
  color?: string
  size?: number
}

export function CursorGlow({ 
  className,
  color = "rgba(59, 130, 246, 0.15)",
  size = 600
}: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - size / 2)
      mouseY.set(e.clientY - rect.top - size / 2)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Using position relative and overflow hidden on parent if possible
    parent.style.position = parent.style.position || "relative"
    
    parent.addEventListener("mousemove", handleMouseMove)
    parent.addEventListener("mouseenter", handleMouseEnter)
    parent.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove)
      parent.removeEventListener("mouseenter", handleMouseEnter)
      parent.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY, size])

  return (
    <motion.div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{ overflow: "hidden" }} // Contain the glow
    >
      <motion.div
        style={{
          x,
          y,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
        className="absolute rounded-full mix-blend-screen"
      />
    </motion.div>
  )
}
