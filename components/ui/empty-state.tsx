"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowLeft, LucideIcon } from "lucide-react"
import Link from "next/link"

export interface EmptyStateProps {
  title?: string
  message?: string
  description?: string
  icon?: LucideIcon | string
  showHomeButton?: boolean
}

export function EmptyState({
  title = "No Content Yet",
  message = "Content will be available soon.",
  description,
  showHomeButton = true,
}: EmptyStateProps) {
  const displayMessage = description || message

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative flex max-w-md flex-col items-center rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-xl"
      >
        {/* Glow backdrop */}
        <div
          className="absolute -top-12 left-1/2 -z-10 h-40 w-40 -translate-x-1/2 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6, #a855f7)" }}
        />

        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/15 text-blue-400 shadow-inner"
        >
          <Sparkles className="h-8 w-8 text-blue-400" />
        </motion.div>

        {/* Text content */}
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mb-8 text-sm text-white/60 leading-relaxed">
          {displayMessage}
        </p>

        {/* Optional Action Button */}
        {showHomeButton && (
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        )}
      </motion.div>
    </div>
  )
}
