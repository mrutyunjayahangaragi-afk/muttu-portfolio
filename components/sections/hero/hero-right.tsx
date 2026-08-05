"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Hero3DConfig, Hero3DContent } from "@/types/hero"

// Lazy-load the heavy 3D canvas — only on desktop, loaded after hydration
const HeroScene = dynamic(
  () => import("@/components/3d/hero-scene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <HeroSceneFallback /> }
)

function HeroSceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-48 w-48">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-blue-500/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
            style={{ margin: `${i * 16}px` }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🚀</span>
        </div>
      </div>
    </div>
  )
}

interface HeroRightProps {
  config?: Hero3DConfig
  content?: Hero3DContent
}

export function HeroRight({ config, content }: HeroRightProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)")

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      className="relative h-[400px] min-h-[400px] w-full lg:h-full"
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, #3b82f6 0%, #a855f7 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Glass frame */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 h-6 w-6 rounded-tl-lg border-t-2 border-l-2 border-blue-500/50" />
        <div className="absolute top-4 right-4 h-6 w-6 rounded-tr-lg border-t-2 border-r-2 border-purple-500/50" />
        <div className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-purple-500/50" />
        <div className="absolute right-4 bottom-4 h-6 w-6 rounded-br-lg border-r-2 border-b-2 border-blue-500/50" />

        {/* 3D Scene or mobile fallback */}
        {isMobile ? <MobileVisual /> : <HeroScene config={config} content={content} />}

        {/* Scan line overlay */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      </div>

      {/* Status indicator */}
      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        <span className="font-mono text-xs text-white/60">3D WORKSPACE ONLINE</span>
      </div>
    </motion.div>
  )
}

function MobileVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {[120, 160, 200].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-blue-500/20"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              marginTop: -size / 2,
              marginLeft: -size / 2,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={deg}
            className="absolute h-3 w-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
            style={{
              top: "50%",
              left: "50%",
              marginTop: -6,
              marginLeft: -6,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
            initial={{ rotate: deg }}
          >
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ["#60a5fa", "#a855f7", "#10b981"][i],
                transform: `translateX(${70 + i * 20}px)`,
              }}
            />
          </motion.div>
        ))}

        <motion.div
          className="relative h-24 w-24 rounded-full"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, #a855f7 60%, transparent 100%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-4xl">💻</span>
        </motion.div>
      </div>

      {[
        { label: "React", pos: "top-8 left-8" },
        { label: "Next.js", pos: "top-8 right-8" },
        { label: "AI/ML", pos: "bottom-8 left-8" },
        { label: "TypeScript", pos: "bottom-8 right-8" },
      ].map(({ label, pos }, i) => (
        <motion.div
          key={label}
          className={`absolute ${pos} rounded-full border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-white/70 backdrop-blur-sm`}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
        >
          {label}
        </motion.div>
      ))}
    </div>
  )
}
