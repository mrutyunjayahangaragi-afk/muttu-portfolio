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
import type { Leadership } from "@/types"

const leadershipSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof leadershipSchema>

interface LeadershipFormProps {
  leadership?: Leadership
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function LeadershipForm({ leadership, onSubmit }: LeadershipFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logoUrl, setLogoUrl] = useState(leadership?.logo_url ?? "")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(leadershipSchema),
    defaultValues: {
      title: leadership?.title ?? "",
      organization: leadership?.organization ?? "",
      start_date: leadership?.start_date ?? "",
      end_date: leadership?.end_date ?? "",
      current: leadership?.current ?? false,
      description: leadership?.description ?? "",
      display_order: leadership?.display_order ?? 0,
    },
  })

  const isCurrent = watch("current")

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "leadership")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setLogoUrl(data.secure_url)
    else setServerError(data.error)
    setUploadingLogo(false)
  }

  async function submit(values: FormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    fd.append("title", values.title)
    fd.append("organization", values.organization)
    fd.append("start_date", values.start_date || "")
    fd.append("end_date", values.current ? "" : values.end_date || "")
    fd.append("current", String(values.current))
    fd.append("description", values.description || "")
    fd.append("logo_url", logoUrl)
    fd.append("display_order", String(values.display_order))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/leadership"), 800)
      } else {
        setServerError(result.error ?? "Failed to save leadership entry")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Leadership Position</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Title / Role *</label>
            <Input {...register("title")} placeholder="e.g. Lead Organizer / Club President" />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Organization *</label>
            <Input {...register("organization")} placeholder="e.g. Google Developer Student Club" />
            {errors.organization && <p className="text-xs text-red-400 mt-1">{errors.organization.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Start Date</label>
            <Input type="date" {...register("start_date")} />
          </div>

          {!isCurrent && (
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">End Date</label>
              <Input type="date" {...register("end_date")} />
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("current")} className="w-4 h-4 rounded accent-blue-500" />
          <span className="text-sm text-white/70">Currently holding this role</span>
        </label>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Description</label>
          <Textarea {...register("description")} rows={3} placeholder="Key initiatives led, community impact..." />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
          <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Logo</h3>
        <div className="flex items-center gap-4">
          {logoUrl && (
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
            />
            {uploadingLogo ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploadingLogo ? "Uploading..." : "Upload Logo"}
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
          {leadership ? "Save Changes" : "Create Leadership Entry"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/leadership")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
