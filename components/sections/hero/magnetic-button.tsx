"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  disabled?: boolean
}

/**
 * MagneticButton follows the mouse with a magnetic pull effect on hover.
 * Works with both buttons and links. Respects reduced-motion preferences.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (disabled) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * 0.3
    const y = (clientY - (top + height / 2)) * 0.3
    setPosition({ x, y })
  }

  const resetPosition = () => setPosition({ x: 0, y: 0 })

  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium",
    "transition-all duration-200 overflow-hidden group select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40":
        variant === "primary",
      "bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm border border-white/20":
        variant === "secondary",
      "border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400":
        variant === "outline",
    },
    className
  )

  const content = (
    <>
      {/* Shine effect */}
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
        aria-hidden="true"
      />
      <span className="relative z-10 font-semibold" suppressHydrationWarning>{children}</span>
    </>
  )

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouse}
      onMouseLeave={resetPosition}
      className="inline-block"
    >
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className={baseStyles}
          suppressHydrationWarning
          {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={baseStyles}
          suppressHydrationWarning
        >
          {content}
        </button>
      )}
    </motion.div>
  )
}
