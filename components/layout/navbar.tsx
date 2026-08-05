"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store"
import type { NavItem } from "@/types"
import { easings } from "@/lib/design-tokens"

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

interface NavbarProps {
  logoText?: string
}

export function Navbar({ logoText = "<Dev/>" }: NavbarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Track active section on scroll
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("")
      return
    }

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)
    
    const sections = ["about", "skills", "projects", "experience", "gallery", "contact"]
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [pathname])

  // Scroll detection for navbar styling
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, setMobileMenuOpen])

  // Keyboard navigation & Focus trapping in mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (e.key === "Tab") {
        const focusable = menuRef.current?.querySelectorAll(
          'a[href], button:not([disabled])'
        ) as NodeListOf<HTMLElement>
        
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobileMenuOpen, setMobileMenuOpen])

  const checkActive = (itemHref: string) => {
    if (itemHref.startsWith("/#")) {
      return mounted && pathname === "/" && activeSection === itemHref.substring(1)
    }
    return pathname === itemHref
  }

  return (
    <>
      {/* WCAG Skip Link */}
      <a href="#content" className="skip-link" suppressHydrationWarning>
        Skip to content
      </a>

      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative" aria-label="Go to homepage" suppressHydrationWarning>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent select-none">
                {logoText}
              </span>
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden items-center gap-1 md:flex" suppressHydrationWarning>
              {NAV_ITEMS.map((item) => {
                const isActive = checkActive(item.href)
                return (
                  <li key={item.href} suppressHydrationWarning>
                    <Link
                      href={item.href}
                      suppressHydrationWarning
                      className={cn(
                        "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300",
                        "text-white/70 hover:text-white"
                      )}
                    >
                      {mounted && isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 rounded-lg bg-white/5"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10" suppressHydrationWarning>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* CTA Button */}
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/contact"
                suppressHydrationWarning
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98]"
              >
                Hire Me
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              ref={triggerRef}
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: easings.inOut }}
              className="overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl md:hidden"
            >
              <ul className="space-y-1 px-4 py-5">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, ease: easings.out }}
                  >
                    <Link
                      href={item.href}
                      suppressHydrationWarning
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        checkActive(item.href)
                          ? "bg-white/5 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span suppressHydrationWarning>{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_ITEMS.length * 0.04, ease: easings.out }}
                  className="pt-3"
                >
                  <Link
                    href="/contact"
                    suppressHydrationWarning
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg shadow-blue-500/20"
                  >
                    Hire Me
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
