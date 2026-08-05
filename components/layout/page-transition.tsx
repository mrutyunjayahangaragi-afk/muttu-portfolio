"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { easings } from "@/lib/design-tokens"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <div key={pathname} className="relative w-full">
        {/* Sliding Curtain Panels */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: easings.inOut }}
          className="fixed inset-0 z-50 origin-top bg-gradient-to-b from-blue-900/90 to-black pointer-events-none"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
          transition={{ duration: 0.5, ease: easings.out, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
