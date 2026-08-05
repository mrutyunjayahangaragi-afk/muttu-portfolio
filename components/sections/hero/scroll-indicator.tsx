"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function ScrollIndicator() {
  const handleScroll = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
      onClick={handleScroll}
      className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white/40 transition-colors duration-300 hover:text-white"
      aria-label="Scroll to about section"
    >
      <span className="text-[10px] font-semibold tracking-widest uppercase select-none">Scroll Down</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-10 w-6 items-center justify-center rounded-full border border-white/20 group-hover:border-blue-400/50 backdrop-blur-sm"
      >
        <ChevronDown size={14} className="text-white/60 transition-colors group-hover:text-blue-400 animate-pulse" />
      </motion.div>
    </motion.button>
  )
}
