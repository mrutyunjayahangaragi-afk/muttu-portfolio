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
import type { Achievement } from "@/types"

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["award", "competition", "scholarship", "ranking", "publication", "open_source", "leadership", "other"]),
  organization: z.string().optional(),
  award_date: z.string().optional(),
  featured: z.boolean(),
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof achievementSchema>

interface AchievementFormProps {
  achievement?: Achievement
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function AchievementForm({ achievement, onSubmit }: AchievementFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState(achievement?.image_url ?? "")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      category: (achievement?.category as any) ?? "award",
      organization: achievement?.organization ?? "",
      award_date: achievement?.award_date ?? "",
      featured: achievement?.featured ?? false,
      display_order: achievement?.display_order ?? 0,
    },
  })

  async function handleImageUpload(file: File) {
    setUploadingImage(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "achievements")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setImageUrl(data.secure_url)
    else setServerError(data.error)
    setUploadingImage(false)
  }

  async function submit(values: FormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    fd.append("title", values.title)
    fd.append("description", values.description)
    fd.append("category", values.category)
    fd.append("organization", values.organization || "")
    fd.append("award_date", values.award_date || "")
    fd.append("featured", String(values.featured))
    fd.append("image_url", imageUrl)
    fd.append("display_order", String(values.display_order))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/achievements"), 800)
      } else {
        setServerError(result.error ?? "Failed to save achievement")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Achievement Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Title *</label>
            <Input {...register("title")} placeholder="e.g. Dean's Honor List" />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Category</label>
            <select
              {...register("category")}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="award">Award / Recognition</option>
              <option value="competition">Competition</option>
              <option value="scholarship">Scholarship</option>
              <option value="ranking">Ranking / Percentile</option>
              <option value="publication">Research Publication</option>
              <option value="open_source">Open Source</option>
              <option value="leadership">Leadership</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Organization / Issuer</label>
            <Input {...register("organization")} placeholder="e.g. ACM / University" />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Award Date</label>
            <Input type="date" {...register("award_date")} />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Description *</label>
          <Textarea {...register("description")} rows={3} placeholder="Details about this recognition..." />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/70">Featured Achievement</span>
          </label>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
            <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Award / Certificate Image</h3>
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Award" className="w-full h-full object-cover" />
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
            {uploadingImage ? "Uploading..." : "Upload Image"}
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
          {achievement ? "Save Changes" : "Create Achievement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/achievements")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
