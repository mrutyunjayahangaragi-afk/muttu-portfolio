import type { Metadata } from "next"
import { Plus, Pencil, Globe, EyeOff } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { TogglePublishButton } from "@/features/admin/toggle-publish-button"
import { deleteBlog } from "../actions"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminBlogPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  const published = posts?.filter((p) => p.published).length ?? 0
  const drafts = (posts?.length ?? 0) - published

  return (
    <div>
      <AdminPageHeader title="Blog" description={`${published} published · ${drafts} drafts`}>
        <a
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus size={16} />
          New Post
        </a>
      </AdminPageHeader>

      <div className="space-y-3">
        {!posts?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No posts yet. Click "New Post" to write something.
          </div>
        )}
        {posts?.map((post) => (
          <div
            key={post.id}
            className="glass flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20"
          >
            <div
              className={`shrink-0 rounded-lg p-2 ${post.published ? "bg-green-500/20" : "bg-white/5"}`}
            >
              {post.published ? (
                <Globe size={16} className="text-green-400" />
              ) : (
                <EyeOff size={16} className="text-white/40" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <span className="truncate text-sm font-medium text-white">{post.title}</span>
                {post.featured && (
                  <span className="shrink-0 rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-xs text-yellow-400">
                    Featured
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-white/50">{post.excerpt}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-xs text-white/30">
                  {formatDate(post.created_at, { month: "short", day: "numeric", year: "numeric" })}
                </span>
                {post.read_time && (
                  <span className="text-xs text-white/30">{post.read_time} min read</span>
                )}
                {post.tags?.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <TogglePublishButton id={post.id} published={post.published} />
              <a
                href={`/admin/blog/${post.id}/edit`}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                aria-label="Edit post"
              >
                <Pencil size={15} />
              </a>
              <DeleteButton id={post.id} action={deleteBlog} label="post" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
