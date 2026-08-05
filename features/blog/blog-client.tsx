"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, Calendar, Clock, ArrowRight, BookOpen, X } from "lucide-react"
import type { Blog } from "@/types"
import { EmptyState } from "@/components/ui/empty-state"

interface BlogClientProps {
  initialBlogs: Blog[]
}

export function BlogClient({ initialBlogs }: BlogClientProps) {
  const [search, setSearch] = useState("")

  const filtered = initialBlogs.filter((b) => {
    const q = search.toLowerCase()
    return (
      !search ||
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen pt-32 pb-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <BookOpen size={32} />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Writing & <span className="text-indigo-400">Thoughts</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            Explore my latest articles on software engineering, web development, architecture, and technology.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="blog"
            title="No articles found"
            description="Try modifying your search query or check back later for new updates."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-indigo-500/5">
                      {blog.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.cover_image}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen size={48} className="text-indigo-500/20" />
                        </div>
                      )}
                      {blog.tags?.[0] && (
                        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          {blog.tags[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(blog.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {blog.read_time && (
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {blog.read_time} min read
                          </span>
                        )}
                      </div>

                      <h2 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-indigo-400">
                        {blog.title}
                      </h2>
                      
                      <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-white/50">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto flex items-center gap-2 text-sm font-medium text-indigo-400">
                        Read Article
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
