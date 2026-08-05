"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useUIStore } from "@/store"

export function CustomCursor() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { cursorVariant, setCursorVariant } = useUIStore()
  const [clicked, setClicked] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 35, stiffness: 300, mass: 0.5 }
  const dotSpringConfig = { damping: 60, stiffness: 600, mass: 0.2 }

  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  const dotX = useSpring(mouseX, dotSpringConfig)
  const dotY = useSpring(mouseY, dotSpringConfig)

  useEffect(() => {
    if (isMobile) return

    function onMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    function onMouseDown() {
      setClicked(true)
    }

    function onMouseUp() {
      setClicked(false)
    }

    // Interactive elements detection
    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      
      // Check if it's a link or button
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
        
      const isText = 
        target.tagName === 'P' || 
        target.tagName === 'H1' || 
        target.tagName === 'H2' || 
        target.tagName === 'H3' || 
        target.tagName === 'H4' || 
        target.tagName === 'H5' || 
        target.tagName === 'H6'
        
      if (isInteractive) {
        setCursorVariant("hover")
      } else if (isText) {
        setCursorVariant("text")
      } else {
        setCursorVariant("default")
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mouseover", handleMouseOver)
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [isMobile, mouseX, mouseY, setCursorVariant])

  if (isMobile) return null

  // Define variants for the outer ring
  const variants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "1px solid rgba(96, 165, 250, 0.6)",
      mixBlendMode: "difference" as const,
      scale: clicked ? 0.8 : 1,
    },
    hover: {
      height: 48,
      width: 48,
      backgroundColor: "rgba(96, 165, 250, 0.1)",
      border: "1px solid rgba(96, 165, 250, 0.2)",
      mixBlendMode: "difference" as const,
      scale: clicked ? 0.9 : 1.2,
    },
    text: {
      height: 48,
      width: 48,
      backgroundColor: "transparent",
      border: "1px solid rgba(96, 165, 250, 0.3)",
      mixBlendMode: "difference" as const,
      scale: clicked ? 0.9 : 1,
      borderRadius: "0%", // Morph to square-ish
    },
    hidden: {
      opacity: 0,
      scale: 0,
    }
  }

  // Define variants for the inner dot
  const dotVariants = {
    default: { opacity: 1, scale: 1 },
    hover: { opacity: 0, scale: 0 },
    text: { opacity: 1, scale: 0.5 },
    hidden: { opacity: 0, scale: 0 }
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Inner dot */}
      <motion.div
        style={{
          translateX: dotX,
          translateY: dotY,
          x: "-50%",
          y: "-50%",
        }}
        variants={dotVariants}
        animate={cursorVariant}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 rounded-full bg-blue-400 mix-blend-difference"
        aria-hidden="true"
      />
      
      {/* Click ripple effect */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{ opacity: 0.5, scale: 1, translateX: "-50%", translateY: "-50%" }}
            animate={{ opacity: 0, scale: 3, translateX: "-50%", translateY: "-50%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ x: dotX, y: dotY }}
            className="pointer-events-none fixed top-0 left-0 z-[9997] h-8 w-8 rounded-full border border-blue-400"
          />
        )}
      </AnimatePresence>
    </>
  )
}
