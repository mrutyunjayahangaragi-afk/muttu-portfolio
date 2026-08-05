import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { BlogForm } from "@/features/admin/blog-form"
import { createBlog } from "../../actions"

export const metadata: Metadata = {
  title: "New Post — Admin",
  robots: { index: false, follow: false },
}

export default async function NewBlogPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createBlog({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Create Blog Post" description="Write a new article for your technical blog" />
      <BlogForm onSubmit={handleCreate} />
    </div>
  )
}
