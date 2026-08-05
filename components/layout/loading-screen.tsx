"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "@/store"
import { easings } from "@/lib/design-tokens"

export function LoadingScreen() {
  const { isLoading, setLoading } = useUIStore()
  const [progress, setProgress] = useState(0)
  const [textIndex, setTextIndex] = useState(0)

  const loadingTexts = [
    "Initializing neural pathways...",
    "Compiling 3D assets...",
    "Injecting coffee...",
    "Aligning pixels...",
    "Ready for launch."
  ]

  useEffect(() => {
    // Simulate loading with rapid progress
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 800)
          return 100
        }
        
        // Update text based on progress
        const index = Math.floor((p / 100) * loadingTexts.length)
        if (index !== textIndex && index < loadingTexts.length) {
          setTextIndex(index)
        }
        
        return p + Math.random() * 12 + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [setLoading, textIndex, loadingTexts.length])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: "-100%",
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: easings.inOut }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Aurora background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" 
            />
            <motion.div 
              animate={{ rotate: -360, scale: [1, 1.5, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] delay-500" 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Animated morphing logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: easings.out }}
              className="relative flex h-24 w-24 items-center justify-center"
            >
              <div className="absolute inset-0 animate-morph border border-white/20 bg-white/5 backdrop-blur-md" />
              <div className="absolute inset-2 animate-morph border border-blue-500/40 bg-blue-500/10" style={{ animationDelay: "-2s" }} />
              <div className="absolute inset-4 animate-morph border border-purple-500/40 bg-purple-500/10" style={{ animationDelay: "-4s" }} />
              
              <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                MR
              </span>
            </motion.div>

            {/* Progress bar container */}
            <div className="flex flex-col items-center gap-4">
              <div className="h-1 w-64 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>

              {/* Status text with typewriter effect per line */}
              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={textIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-medium tracking-widest text-white/50 uppercase"
                  >
                    {loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]}
                  </motion.p>
                </AnimatePresence>
              </div>
              
              {/* Percentage counter */}
              <div className="absolute -right-12 top-[125px] text-xs font-mono text-white/30">
                {Math.floor(progress)}%
              </div>
            </div>
          </div>
          
          {/* Animated grid overlay */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
