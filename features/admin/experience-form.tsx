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
import type { Experience } from "@/types"

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  company_url: z.string().optional(),
  employment_type: z.enum(["full_time", "part_time", "internship", "freelance", "contract"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  current: z.boolean(),
  tech_stack: z.string().optional(), // comma-separated
  responsibilities: z.string().optional(), // newline-separated
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof experienceSchema>

interface ExperienceFormProps {
  experience?: Experience
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function ExperienceForm({ experience, onSubmit }: ExperienceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logoUrl, setLogoUrl] = useState(experience?.company_logo ?? "")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      description: experience?.description ?? "",
      location: experience?.location ?? "",
      company_url: experience?.company_url ?? "",
      employment_type: (experience?.employment_type as any) ?? "full_time",
      start_date: experience?.start_date ?? "",
      end_date: experience?.end_date ?? "",
      current: experience?.current ?? false,
      tech_stack: Array.isArray(experience?.tech_stack) ? experience.tech_stack.join(", ") : "",
      responsibilities: Array.isArray(experience?.responsibilities) ? experience.responsibilities.join("\n") : "",
      display_order: experience?.display_order ?? 0,
    },
  })

  const isCurrent = watch("current")

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "experience")
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
    fd.append("company", values.company)
    fd.append("role", values.role)
    fd.append("description", values.description)
    fd.append("location", values.location || "")
    fd.append("company_url", values.company_url || "")
    fd.append("employment_type", values.employment_type)
    fd.append("start_date", values.start_date)
    fd.append("end_date", values.current ? "" : values.end_date || "")
    fd.append("current", String(values.current))
    fd.append("company_logo", logoUrl)
    fd.append("display_order", String(values.display_order))

    const techArray = values.tech_stack
      ? values.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("tech_stack", JSON.stringify(techArray))

    const respArray = values.responsibilities
      ? values.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("responsibilities", JSON.stringify(respArray))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/experience"), 800)
      } else {
        setServerError(result.error ?? "Failed to save experience")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Position Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Job Title / Role *</label>
            <Input {...register("role")} placeholder="e.g. Senior Software Engineer" />
            {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Company Name *</label>
            <Input {...register("company")} placeholder="e.g. Google" />
            {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Employment Type</label>
            <select
              {...register("employment_type")}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Location</label>
            <Input {...register("location")} placeholder="e.g. San Francisco, CA (Hybrid)" />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Company Website URL</label>
          <Input {...register("company_url")} placeholder="https://example.com" />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Duration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Start Date *</label>
            <Input type="date" {...register("start_date")} />
            {errors.start_date && <p className="text-xs text-red-400 mt-1">{errors.start_date.message}</p>}
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
          <span className="text-sm text-white/70">I currently work here</span>
        </label>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Description & Responsibilities</h3>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Role Overview / Summary *</label>
          <Textarea {...register("description")} rows={3} placeholder="Brief summary of your role and accomplishments..." />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Key Responsibilities (one per line)</label>
          <Textarea {...register("responsibilities")} rows={4} placeholder="Led frontend architecture&#10;Mentored junior engineers&#10;Optimized build speeds by 40%" />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Tech Stack (comma-separated)</label>
          <Input {...register("tech_stack")} placeholder="React, TypeScript, Next.js, GraphQL, AWS" />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
          <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
        </div>
      </div>

      {/* Company Logo Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Company Logo</h3>
        <div className="flex items-center gap-4">
          {logoUrl && (
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
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
          {experience ? "Save Changes" : "Create Experience"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/experience")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
