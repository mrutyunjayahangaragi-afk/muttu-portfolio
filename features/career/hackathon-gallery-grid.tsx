"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from "lucide-react"
import type { HackathonGalleryItem } from "@/types"

interface HackathonGalleryGridProps {
  items: HackathonGalleryItem[]
}

export function HackathonGalleryGrid({ items }: HackathonGalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!items || items.length === 0) {
    return (
      <div className="glass rounded-3xl border border-white/10 p-12 text-center my-8">
        <Camera className="mx-auto h-10 w-10 text-white/20 mb-3" />
        <h4 className="text-base font-semibold text-white/80">No Participation Photos Added Yet</h4>
        <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
          Participation photos will appear here once uploaded by the event organizer.
        </p>
      </div>
    )
  }

  // Extract distinct categories
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))]

  const filtered = selectedCategory === "All" ? items : items.filter((i) => i.category === selectedCategory)

  const activePhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null

  function nextLightbox() {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! + 1) % filtered.length)
  }

  function prevLightbox() {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! - 1 + filtered.length) % filtered.length)
  }

  return (
    <div className="space-y-6 my-12">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Event Photo Gallery</h3>
          <p className="text-xs text-white/50">Explore stage, team, and presentation moments</p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white font-medium shadow-lg shadow-rose-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            onClick={() => setLightboxIndex(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 aspect-[4/3]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.image_title || "Hackathon photo"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4 flex flex-col justify-between">
              <span className="self-end rounded-full bg-black/60 backdrop-blur-md p-2 text-white">
                <Maximize2 size={14} />
              </span>

              <div>
                <span className="rounded-md bg-rose-500/30 border border-rose-500/40 px-2 py-0.5 font-mono text-[10px] text-white">
                  {item.category || "Event"}
                </span>
                {item.image_title && <p className="mt-1 text-sm font-semibold text-white truncate">{item.image_title}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20 z-50"
            >
              <X size={20} />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20 z-50"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20 z-50"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.image_url}
                alt={activePhoto.image_title || "Expanded photo"}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />

              {(activePhoto.image_title || activePhoto.image_description) && (
                <div className="border-t border-white/10 bg-black/80 p-6 space-y-1">
                  {activePhoto.image_title && (
                    <h4 className="text-base font-bold text-white">{activePhoto.image_title}</h4>
                  )}
                  {activePhoto.image_description && (
                    <p className="text-xs text-white/70">{activePhoto.image_description}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
