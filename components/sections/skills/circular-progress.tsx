"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  showText?: boolean
  className?: string
}

/**
 * SVG circular progress ring that animates its stroke-dashoffset on scroll entry.
 * Uses requestAnimationFrame for 60fps smoothness.
 */
export function CircularProgress({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = "url(#progress-gradient)",
  showText = true,
  className = "",
}: CircularProgressProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [animated, setAnimated] = useState(false)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    if (inView && !animated) setAnimated(true)
  }, [inView, animated])

  const gradientId = `grad-${percentage}-${size}`

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`${percentage}%`}
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />

      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: animated ? offset : circumference }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {showText && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-white"
          fill="white"
          fontSize={size * 0.18}
          fontWeight="700"
          fontFamily="inherit"
        >
          {percentage}%
        </text>
      )}
    </svg>
  )
}
