"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-[100] h-0.5 origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      aria-hidden="true"
    />
  )
}
