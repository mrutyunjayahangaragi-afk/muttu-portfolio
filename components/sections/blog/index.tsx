import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Calendar } from "lucide-react"
import { getCachedBlogs } from "@/services/blog"
import type { Blog } from "@/types"

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="glass group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
      {blog.cover_image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {blog.read_time && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {blog.read_time} min read
            </span>
          )}
        </div>
        <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="mb-6 line-clamp-2 text-sm text-white/60 leading-relaxed">
          {blog.excerpt}
        </p>
        <div className="mt-auto">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-all group-hover:gap-2"
          >
            Read Article <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

async function BlogData() {
  const blogs = await getCachedBlogs().catch(() => [])

  if (blogs.length === 0) return null

  const preview = blogs.slice(0, 3)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {preview.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          View All Blogs
          <ArrowRight size={18} />
        </Link>
      </div>
    </>
  )
}

export function BlogSection() {
  return (
    <section
      id="blog"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Blog Articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Publications</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Latest{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-white/55 mt-3 text-base">
            Technical insights, engineering tutorials, and lessons learned.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <BlogData />
        </Suspense>
      </div>
    </section>
  )
}
