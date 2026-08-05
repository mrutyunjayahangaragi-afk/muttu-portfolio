"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Grid,
  List,
  Award,
  ExternalLink,
  Download,
  CheckCircle2,
  Calendar,
  X,
  Filter,
} from "lucide-react"
import type { Certificate } from "@/types"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"

const CATEGORIES = ["All", "Cloud", "AI/ML", "Web Dev", "Security", "Data", "DevOps", "General"]

function CertificateCard({
  cert,
  view,
}: {
  cert: Certificate
  view: "grid" | "list"
}) {
  const [lightbox, setLightbox] = useState(false)

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass glass-hover group flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-all duration-300 hover:border-emerald-500/20"
      >
        {/* Thumbnail */}
        <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
          {cert.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.image_url}
              alt={cert.title}
              className="h-full w-full cursor-pointer object-cover"
              onClick={() => setLightbox(true)}
            />
          ) : (
            <Award size={20} className="text-emerald-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{cert.title}</p>
          <p className="text-xs text-white/50">
            {cert.issuer} ·{" "}
            {new Date(cert.issue_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {cert.featured && (
          <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs text-yellow-400 ring-1 ring-yellow-500/20">
            Featured
          </span>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {cert.slug && (
            <Link
              href={`/certificates/${cert.slug}`}
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="View details"
            >
              <ExternalLink size={14} />
            </Link>
          )}
          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-emerald-400/60 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
              aria-label="Verify certificate"
            >
              <CheckCircle2 size={14} />
            </a>
          )}
          {cert.pdf_url && (
            <a
              href={cert.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Download PDF"
            >
              <Download size={14} />
            </a>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass glass-hover group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10"
      >
        {/* Featured badge */}
        {cert.featured && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-medium text-black">
            ⭐ Featured
          </div>
        )}

        {/* Thumbnail */}
        <div
          className="relative h-44 w-full cursor-zoom-in overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
          onClick={() => setLightbox(true)}
        >
          {cert.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.image_url}
              alt={cert.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Award size={48} className="text-emerald-400/30" />
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white">{cert.title}</h3>
          <p className="mb-3 text-xs text-white/50">{cert.issuer}</p>

          <div className="mb-3 flex items-center gap-2 text-xs text-white/35">
            <Calendar size={11} />
            {new Date(cert.issue_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
            {cert.expiry_date && (
              <span>
                – Expires{" "}
                {new Date(cert.expiry_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Skills */}
          {cert.skills && cert.skills.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {cert.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400/70"
                >
                  {s}
                </span>
              ))}
              {cert.skills.length > 3 && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/30">
                  +{cert.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {cert.slug && (
              <Link
                href={`/certificates/${cert.slug}`}
                className="flex-1 rounded-xl bg-emerald-500/15 py-2 text-center text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25"
              >
                View Details
              </Link>
            )}
            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Verify"
              >
                <CheckCircle2 size={15} />
              </a>
            )}
            {cert.pdf_url && (
              <a
                href={cert.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Download"
              >
                <Download size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && cert.image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-h-[90vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(false)}
                className="absolute -right-3 -top-3 z-10 rounded-full bg-white/10 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <X size={16} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.image_url}
                alt={cert.title}
                className="max-h-[85vh] w-full rounded-2xl object-contain"
              />
              <p className="mt-3 text-center text-sm text-white/60">{cert.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface CertificatesClientProps {
  certificates: Certificate[]
}

export function CertificatesClient({ certificates }: CertificatesClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    let items = certificates
    if (selectedCategory !== "All") {
      items = items.filter(
        (c) =>
          c.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          c.skills?.some((s) =>
            s.toLowerCase().includes(selectedCategory.toLowerCase())
          )
      )
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q))
      )
    }
    return items
  }, [certificates, search, selectedCategory])

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates, issuers, skills…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 transition-colors ${
              view === "grid"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/40 hover:text-white"
            }`}
            aria-label="Grid view"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 transition-colors ${
              view === "list"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/40 hover:text-white"
            }`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "glass border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Filter size={13} />
        {filtered.length} certificate{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </div>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="default"
          title="No certificates found"
          description="Try modifying your search or filter categories to find what you are looking for."
        />
      ) : (
        <AnimatePresence mode="sync">
          <motion.div
            key={view}
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-3"
            }
          >
            {filtered.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} view={view} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
