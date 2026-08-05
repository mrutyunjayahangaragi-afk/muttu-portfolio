"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<SVGSVGElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 500], [0, 150])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement
      const x = (e.clientX / clientWidth - 0.5) * 30
      const y = (e.clientY / clientHeight - 0.5) * 30
      setMousePosition({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Build star positions on mount
  useEffect(() => {
    const svg = starsRef.current
    if (!svg) return
    const w = window.innerWidth
    const h = window.innerHeight
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < 150; i++) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", String(Math.random() * w))
      circle.setAttribute("cy", String(Math.random() * h))
      const r = Math.random() * 1.5 + 0.3
      circle.setAttribute("r", String(r))
      circle.setAttribute("fill", `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.1})`)
      circle.style.animation = `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`
      circle.style.animationDelay = `${Math.random() * 4}s`
      fragment.appendChild(circle)
    }
    svg.appendChild(fragment)
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden noise-texture" aria-hidden="true">
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-[#020408]" />

      {/* Mesh Gradient / Aurora Blobs with mouse parallax and scroll transform */}
      <motion.div
        style={{
          x: mousePosition.x * 0.8,
          y: mousePosition.y * 0.8,
          background: "radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)",
        }}
        className="absolute -top-40 left-1/4 h-[550px] w-[750px] rounded-full blur-[110px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        style={{
          x: -mousePosition.x * 0.6,
          y: -mousePosition.y * 0.6,
          background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 60%, transparent 80%)",
        }}
        className="absolute top-1/3 -right-20 h-[450px] w-[550px] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        style={{
          x: mousePosition.x * 0.5,
          y: -mousePosition.y * 0.5,
          background: "radial-gradient(ellipse, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.05) 60%, transparent 80%)",
        }}
        className="absolute bottom-10 left-10 h-[450px] w-[650px] rounded-full blur-[120px]"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Perspective Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] grid-bg"
        style={{
          perspective: "1000px",
          transform: "rotateX(60deg) translateY(-30%) scale(1.4)",
          transformOrigin: "top center",
        }}
      />

      {/* Floating Glass Panels */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: mousePosition.x * 0.3, y: mousePosition.y * 0.3 }}
          className="glass-subtle absolute top-[25%] left-[8%] h-24 w-24 rounded-2xl opacity-40"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ x: -mousePosition.x * 0.4, y: -mousePosition.y * 0.4 }}
          className="glass-subtle absolute bottom-[30%] right-[12%] h-36 w-36 rounded-3xl opacity-30"
        />
      </div>

      {/* Star field SVG */}
      <svg
        ref={starsRef}
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      />

      {/* Neural network SVG lines */}
      <NeuralLines />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(2,4,8,0.85) 100%)",
        }}
      />

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}

function NeuralLines() {
  const nodes = [
    { x: "12%", y: "18%" },
    { x: "28%", y: "55%" },
    { x: "52%", y: "12%" },
    { x: "78%", y: "68%" },
    { x: "88%", y: "32%" },
    { x: "18%", y: "78%" },
    { x: "62%", y: "42%" },
    { x: "42%", y: "82%" },
  ]

  const lines = [
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 4],
    [1, 5],
    [2, 6],
    [3, 6],
    [5, 7],
    [6, 7],
  ]

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.05]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {lines.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#60a5fa"
          strokeWidth="0.75"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.4, 1] }}
          transition={{
            pathLength: { duration: 2.5, delay: i * 0.25, ease: "easeInOut" },
            opacity: { duration: 5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" },
          }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="2.5"
          fill="#c084fc"
          animate={{ r: [2.5, 3.5, 2.5], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
    </svg>
  )
}
