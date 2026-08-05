/**
 * Design Tokens — TypeScript Constants
 *
 * Mirrors CSS custom properties for use in JS-driven animations (GSAP, Framer Motion).
 * Import this instead of hardcoding values throughout components.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  blueDark: "#2563eb",
  purple: "#a855f7",
  purpleLight: "#c084fc",
  purpleDark: "#7c3aed",
  pink: "#ec4899",
  pinkLight: "#f472b6",
  cyan: "#06b6d4",
  emerald: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",

  black: "#000000",
  bg: "#020408",
  bgRaised: "#0a0e1a",
  bgOverlay: "#0f1320",
} as const

export const textColors = {
  primary: "rgba(255, 255, 255, 0.95)",
  secondary: "rgba(255, 255, 255, 0.7)",
  tertiary: "rgba(255, 255, 255, 0.5)",
  muted: "rgba(255, 255, 255, 0.35)",
} as const

export const surfaces = {
  1: "rgba(255, 255, 255, 0.03)",
  2: "rgba(255, 255, 255, 0.06)",
  3: "rgba(255, 255, 255, 0.1)",
  4: "rgba(255, 255, 255, 0.14)",
} as const

export const borders = {
  default: "rgba(255, 255, 255, 0.08)",
  hover: "rgba(255, 255, 255, 0.16)",
  focus: "rgba(59, 130, 246, 0.6)",
  accent: "rgba(168, 85, 247, 0.4)",
} as const

export const glows = {
  blue: "rgba(59, 130, 246, 0.3)",
  purple: "rgba(168, 85, 247, 0.3)",
  pink: "rgba(236, 72, 153, 0.3)",
  cyan: "rgba(6, 182, 212, 0.3)",
} as const

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const

// ─── Radii ───────────────────────────────────────────────────────────────────

export const radii = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const

// ─── Motion / Durations ──────────────────────────────────────────────────────

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1.0,
} as const

export const easings = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
} as const

// ─── Framer Motion Presets ───────────────────────────────────────────────────

export const motionPresets = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.slow, ease: easings.out },
  },
  fadeDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.slow, ease: easings.out },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: durations.slow, ease: easings.out },
  },
  fadeRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: durations.slow, ease: easings.out },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: durations.normal, ease: easings.out },
  },
  blurIn: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: durations.slow, ease: easings.out },
  },
  stagger: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: durations.slow, ease: easings.out },
      },
    },
  },
} as const

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
  glowBlue: "0 0 20px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)",
  glowPurple: "0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)",
  glowMixed: "0 0 20px rgba(59, 130, 246, 0.2), 0 0 40px rgba(168, 85, 247, 0.15)",
} as const
