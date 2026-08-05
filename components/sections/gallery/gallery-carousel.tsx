"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, Image as ImageIcon } from "lucide-react"
import type { MediaItem } from "@/types"

interface GalleryCarouselProps {
  items: MediaItem[]
}

export function GalleryCarousel({ items }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    if (!items.length) return
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    if (!items.length) return
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying || isLightboxOpen || items.length <= 1) return
    const timer = setInterval(nextSlide, 4500)
    return () => clearInterval(timer)
  }, [isAutoPlaying, isLightboxOpen, nextSlide, items.length])

  // Keyboard navigation for lightbox & carousel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
      if (e.key === "Escape") setIsLightboxOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide])

  if (!items.length) {
    return (
      <div className="glass rounded-3xl p-12 border border-white/10 text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mx-auto">
          <ImageIcon size={28} />
        </div>
        <h3 className="text-xl font-bold text-white">Media Gallery</h3>
        <p className="text-sm text-white/50">
          No gallery images uploaded yet. Upload images in the Admin Panel to display them here!
        </p>
      </div>
    )
  }

  const activeItem = items[currentIndex]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Main Showcase Carousel Frame ───────────────────────────────────── */}
      <div
        className="relative group w-full rounded-3xl overflow-hidden glass border border-white/15 shadow-2xl bg-black/60 aspect-[16/9] sm:aspect-[21/9] min-h-[340px] sm:min-h-[440px]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.url}
              alt={activeItem.filename || `Gallery image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Caption & Counter */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-blue-300 font-medium">
                  <Sparkles size={12} /> Gallery Image {currentIndex + 1} of {items.length}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-white truncate drop-shadow-md">
                  {activeItem.caption || activeItem.filename || "Portfolio Highlight"}
                </h3>
              </div>

              {/* Fullscreen Lightbox Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <Maximize2 size={14} /> Fullscreen
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 opacity-80 group-hover:opacity-100 z-10"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 opacity-80 group-hover:opacity-100 z-10"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail Strip Navigation ────────────────────────────────────── */}
      {items.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none justify-center">
          {items.map((item, i) => {
            const isSelected = i === currentIndex
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all border bg-black/60 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/40 scale-105"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* ── Lightbox Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all z-50"
            >
              <X size={24} />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[85vh] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.url}
                alt={activeItem.filename || "Expanded photo"}
                className="w-full h-full object-contain"
              />

              {/* Navigation inside Lightbox */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md z-50"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md z-50"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
