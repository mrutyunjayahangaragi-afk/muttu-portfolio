"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types"

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
})

type FormValues = z.infer<typeof blogSchema>

interface BlogFormProps {
  post?: BlogPost
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function BlogForm({ post, onSubmit }: BlogFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
      published: post?.published ?? false,
      featured: post?.featured ?? false,
    },
  })

  const watchedTitle = watch("title")
  function handleTitleBlur() {
    if (!post) {
      const slug = watchedTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setValue("slug", slug)
    }
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "blog")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setCoverImage(data.secure_url)
    else setServerError(data.error)
    setUploadingImage(false)
  }

  async function submit(values: FormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    fd.append("title", values.title)
    fd.append("slug", values.slug)
    fd.append("excerpt", values.excerpt)
    fd.append("content", values.content)
    fd.append("published", String(values.published))
    fd.append("featured", String(values.featured))
    fd.append("cover_image", coverImage)

    const tagArray = values.tags
      ? values.tags.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("tags", JSON.stringify(tagArray))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/blog"), 800)
      } else {
        setServerError(result.error ?? "Failed to save blog post")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-3xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Article Header</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Article Title *</label>
            <Input {...register("title")} placeholder="e.g. Building High Performance Web Apps with Next.js 16" onBlur={handleTitleBlur} />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">URL Slug *</label>
            <Input {...register("slug")} placeholder="building-high-performance-nextjs-16" />
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Short Summary / Excerpt *</label>
          <Textarea {...register("excerpt")} rows={2} placeholder="A concise summary displayed on blog cards..." />
          {errors.excerpt && <p className="text-xs text-red-400 mt-1">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Tags (comma-separated)</label>
          <Input {...register("tags")} placeholder="Nextjs, React, Performance, WebDev" />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Post Content (Markdown supported)</h3>

        <div>
          <Textarea {...register("content")} rows={14} placeholder="# Introduction&#10;&#10;Write your article here..." className="font-mono text-sm" />
          {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content.message}</p>}
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/70 font-medium">Publish Immediately</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-purple-500" />
            <span className="text-sm text-white/70 font-medium">Featured Post</span>
          </label>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Cover Image</h3>
        <div className="flex items-center gap-4">
          {coverImage && (
            <div className="w-24 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploadingImage ? "Uploading..." : "Upload Cover Image"}
          </label>
        </div>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={15} />
          Saved! Redirecting...
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="gradient" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {post ? "Save Changes" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
