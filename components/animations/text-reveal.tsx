"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  blur?: boolean
  as?: React.ElementType
}

export function TextReveal({
  text,
  className,
  delay = 0,
  duration = 0.8,
  blur = false,
  as: Component = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  
  // Split text into words, then split words into characters if needed, but for better performance 
  // and smooth word reveal, splitting by words is usually preferred for headlines.
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: blur ? "blur(0px)" : "none",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
        duration: duration,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: blur ? "blur(10px)" : "none",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const MotionComponent = motion(Component as any)

  return (
    <MotionComponent
      ref={ref}
      style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn("gap-x-2", className)}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: "inline-block" }}
          key={index}
          className="pb-2" // Add padding to avoid cutting off descenders
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  )
}
