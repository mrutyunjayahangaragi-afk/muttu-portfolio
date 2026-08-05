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
import type { Hackathon } from "@/types"

const hackathonSchema = z.object({
  name: z.string().min(1, "Hackathon name is required"),
  slug: z.string().min(1, "Slug is required"),
  organizer: z.string().min(1, "Organizer is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  result: z.string().optional(),
  prize: z.string().optional(),
  project_title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  solution: z.string().optional(),
  tech_stack: z.string().optional(),
  github_url: z.string().optional(),
  demo_url: z.string().optional(),
  featured: z.boolean(),
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof hackathonSchema>

interface HackathonFormProps {
  hackathon?: Hackathon
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function HackathonForm({ hackathon, onSubmit }: HackathonFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState(hackathon?.image_url ?? "")
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
    resolver: zodResolver(hackathonSchema),
    defaultValues: {
      name: hackathon?.name ?? "",
      slug: hackathon?.slug ?? "",
      organizer: hackathon?.organizer ?? "",
      date: hackathon?.date ?? "",
      location: hackathon?.location ?? "",
      mode: (hackathon?.mode as any) ?? "online",
      result: hackathon?.result ?? hackathon?.position ?? "",
      prize: hackathon?.prize ?? "",
      project_title: (hackathon as any)?.project_title ?? hackathon?.solution ?? "",
      description: hackathon?.description ?? "",
      solution: hackathon?.solution ?? "",
      tech_stack: Array.isArray(hackathon?.tech_stack) ? hackathon.tech_stack.join(", ") : "",
      github_url: hackathon?.github_url ?? "",
      demo_url: hackathon?.demo_url ?? "",
      featured: hackathon?.featured ?? false,
      display_order: hackathon?.display_order ?? 0,
    },
  })

  const watchedName = watch("name")
  function handleNameBlur() {
    if (!hackathon) {
      const slug = watchedName
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
    fd.append("folder", "hackathons")
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
    fd.append("name", values.name)
    fd.append("slug", values.slug)
    fd.append("organizer", values.organizer)
    fd.append("date", values.date)
    fd.append("location", values.location || "")
    fd.append("mode", values.mode)
    fd.append("result", values.result || "")
    fd.append("ranking", values.result || "")
    fd.append("prize", values.prize || "")
    fd.append("description", values.description)
    fd.append("solution", values.solution || values.project_title || "")
    fd.append("github_url", values.github_url || "")
    fd.append("demo_url", values.demo_url || "")
    fd.append("featured", String(values.featured))
    fd.append("image_url", imageUrl)
    fd.append("display_order", String(values.display_order))

    const techArray = values.tech_stack
      ? values.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("tech_stack", JSON.stringify(techArray))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/hackathons"), 800)
      } else {
        setServerError(result.error ?? "Failed to save hackathon")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Event Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Hackathon Name *</label>
            <Input {...register("name")} placeholder="e.g. ETHGlobal Hackathon 2026" onBlur={handleNameBlur} />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Slug *</label>
            <Input {...register("slug")} placeholder="ethglobal-2026" />
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Organizer *</label>
            <Input {...register("organizer")} placeholder="e.g. Major League Hacking / ETHGlobal" />
            {errors.organizer && <p className="text-xs text-red-400 mt-1">{errors.organizer.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Event Mode</label>
            <select
              {...register("mode")}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="online">Online / Virtual</option>
              <option value="offline">In-Person (Offline)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Event Date *</label>
            <Input type="date" {...register("date")} />
            {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Location</label>
            <Input {...register("location")} placeholder="e.g. San Francisco, CA" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Project Built & Awards</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Position / Result</label>
            <Input {...register("result")} placeholder="e.g. 🥇 1st Place Winner or Finalist" />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Prize Won (optional)</label>
            <Input {...register("prize")} placeholder="e.g. $10,000 Grand Prize" />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Project Description *</label>
          <Textarea {...register("description")} rows={3} placeholder="Brief summary of the hackathon project..." />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Solution Details</label>
          <Textarea {...register("solution")} rows={3} placeholder="Technical solution breakdown, AI architecture..." />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Tech Stack (comma-separated)</label>
          <Input {...register("tech_stack")} placeholder="Next.js, Python, OpenAI, Supabase, Solidity" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">GitHub Repo URL</label>
            <Input {...register("github_url")} placeholder="https://github.com/..." />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Live Demo / Video URL</label>
            <Input {...register("demo_url")} placeholder="https://youtube.com/..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/70">Featured Hackathon</span>
          </label>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
            <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Cover / Event Image</h3>
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="w-20 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Hackathon cover" className="w-full h-full object-cover" />
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
          {hackathon ? "Save Changes" : "Create Hackathon Entry"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/hackathons")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
