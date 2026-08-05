"use client"

import { create } from "zustand"

interface UIState {
  // Navigation
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void

  // Loading screen
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // Custom cursor
  cursorVariant: "default" | "hover" | "text" | "hidden"
  setCursorVariant: (variant: UIState["cursorVariant"]) => void

  // Scroll progress
  scrollProgress: number
  setScrollProgress: (progress: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),

  cursorVariant: "default",
  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}))
