"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react"
import type { HackathonGalleryItem } from "@/types"

interface HackathonGalleryCarouselProps {
  items: HackathonGalleryItem[]
  autoPlayInterval?: number
}

export function HackathonGalleryCarousel({
  items,
  autoPlayInterval = 3500,
}: HackathonGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Auto-play timer
  useEffect(() => {
    if (items.length <= 1 || isPaused) return
    const timer = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(timer)
  }, [items.length, isPaused, autoPlayInterval, nextSlide])

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide])

  if (!items || items.length === 0) return null

  const currentItem = items[currentIndex]

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (diff > 50) nextSlide()
    if (diff < -50) prevSlide()
    touchStartX.current = null
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Banner Title */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Sparkles className="h-4 w-4 text-rose-400" />
          Event Participation Gallery Carousel
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/50">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="rounded-lg p-1 text-white/40 hover:text-white"
            title={isPaused ? "Resume auto-play" : "Pause auto-play"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="relative aspect-[16/9] w-full max-h-[500px] bg-black/80 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentItem.image_url}
              alt={currentItem.image_title || "Hackathon participation photo"}
              className="h-full w-full object-cover"
            />

            {/* Gradient Overlay & Captions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="inline-self-start self-start rounded-full bg-rose-500/20 px-3 py-1 font-mono text-[11px] font-semibold text-rose-300 border border-rose-500/30 mb-2">
                {currentItem.category || "Event Photo"}
              </span>
              {currentItem.image_title && (
                <h3 className="text-lg font-bold text-white sm:text-xl">{currentItem.image_title}</h3>
              )}
              {currentItem.image_description && (
                <p className="mt-1 text-xs text-white/70 max-w-2xl line-clamp-2">
                  {currentItem.image_description}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/20"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-6 bg-rose-500" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
