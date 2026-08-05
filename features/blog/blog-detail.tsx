"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react"
import type { Blog } from "@/types"

import "highlight.js/styles/github-dark.css"

interface BlogDetailProps {
  blog: Blog
}

export function BlogDetail({ blog }: BlogDetailProps) {
  return (
    <article className="min-h-screen pt-32 pb-24">
      {/* Header Section */}
      <header className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center gap-4 text-sm text-white/50"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={16} />
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            {blog.read_time ? `${blog.read_time} min read` : "5 min read"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {blog.title}
        </motion.h1>

        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex flex-wrap justify-center gap-2"
          >
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </header>

      {/* Cover Image */}
      {blog.cover_image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mb-16 max-w-6xl px-4"
        >
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-auto max-w-3xl px-4"
      >
        <div className="prose prose-invert prose-indigo mx-auto max-w-none lg:prose-lg prose-headings:font-bold prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-img:rounded-2xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Footer Actions */}
        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Articles
          </Link>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  text: blog.excerpt,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
              }
            }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </motion.div>
    </article>
  )
}
