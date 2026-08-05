"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Package, FileText, FolderOpen, Inbox, Search, Image, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ─── Icon Map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  projects: Rocket,
  blog: FileText,
  files: FolderOpen,
  inbox: Inbox,
  search: Search,
  gallery: Image,
  default: Package,
}

// ─── Empty State Component ───────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string | LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon =
    typeof icon === "string"
      ? iconMap[icon] ?? iconMap.default
      : icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      {/* Animated icon container */}
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow rings */}
        <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-md" />

        {/* Icon circle */}
        <div className="glass relative flex h-20 w-20 items-center justify-center rounded-2xl">
          <Icon
            size={32}
            className="text-white/40"
            strokeWidth={1.5}
          />

          {/* Orbiting dot */}
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-blue-400/60"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              transformOrigin: "40px 40px",
              top: -4,
              left: "calc(50% - 4px)",
            }}
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-2 text-xl font-semibold text-white/90"
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-6 max-w-sm text-sm leading-relaxed text-white/50"
        >
          {description}
        </motion.p>
      )}

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30"
            >
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
