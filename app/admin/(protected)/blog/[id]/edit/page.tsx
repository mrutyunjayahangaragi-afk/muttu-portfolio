import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { BlogForm } from "@/features/admin/blog-form"
import { updateBlog } from "../../../actions"
import type { BlogPost } from "@/types"

export const metadata: Metadata = {
  title: "Edit Post — Admin",
  robots: { index: false, follow: false },
}

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateBlog(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${post.title}`} description="Update article content, metadata, or status" />
      <BlogForm post={post as BlogPost} onSubmit={handleUpdate} />
    </div>
  )
}
