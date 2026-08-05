"use client"

import { motion } from "framer-motion"
import { Monitor, Cpu, Sparkles } from "lucide-react"

export function WebGlFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020408] px-4 text-center">
      {/* Aurora blob overlay matching 3D theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[500px] rounded-full bg-blue-600/20 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[500px] rounded-full bg-purple-600/20 blur-[80px] animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass relative max-w-md rounded-2xl p-8 z-10 flex flex-col items-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Monitor size={32} />
        </div>

        <h3 className="text-xl font-bold text-white">Visuals Simplified</h3>
        <p className="text-sm leading-relaxed text-white/50">
          WebGL is either disabled or unsupported in your browser. We've loaded a optimized, lightweight experience so everything stays fast and readable.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-white/40">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <Cpu size={12} /> Responsive Layout
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <Sparkles size={12} /> CSS Animations
          </span>
        </div>
      </motion.div>
    </div>
  )
}
