import type { Metadata } from "next"
import { BlogClient } from "@/features/blog/blog-client"
import { getCachedBlogs } from "@/services/blog"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description: "Read my latest articles on software engineering, web development, AI, and technology.",
  openGraph: {
    title: "Blog & Technical Articles",
    description: "Insights, guides, and engineering thoughts.",
  },
}

export const revalidate = 3600

export default async function BlogPage() {
  const blogs = await getCachedBlogs().catch(() => [])

  return (
    <main className="min-h-screen bg-[#020408] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Publications</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Blog &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-base">
            Technical writing, tutorials, and engineering takeaways.
          </p>
        </div>

        {blogs.length === 0 ? (
          <EmptyState title="Articles" message="Content will be available soon." />
        ) : (
          <BlogClient initialBlogs={blogs} />
        )}
      </div>
    </main>
  )
}
