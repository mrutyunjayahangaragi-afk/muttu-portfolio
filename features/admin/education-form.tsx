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
import type { Education } from "@/types"

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().min(1, "Field of study is required"),
  branch: z.string().optional(),
  university: z.string().optional(),
  cgpa: z.string().optional(),
  percentage: z.string().optional(),
  location: z.string().optional(),
  institution_url: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  subjects: z.string().optional(),
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof educationSchema>

interface EducationFormProps {
  education?: Education
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function EducationForm({ education, onSubmit }: EducationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logoUrl, setLogoUrl] = useState(education?.institution_logo ?? "")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      field_of_study: education?.field_of_study ?? "",
      branch: education?.branch ?? "",
      university: education?.university ?? "",
      cgpa: education?.cgpa ?? education?.gpa ?? "",
      percentage: education?.percentage ?? "",
      location: education?.location ?? "",
      institution_url: education?.institution_url ?? "",
      start_date: education?.start_date ?? "",
      end_date: education?.end_date ?? "",
      current: education?.current ?? false,
      description: education?.description ?? "",
      subjects: Array.isArray(education?.subjects) ? education.subjects.join(", ") : "",
      display_order: education?.display_order ?? 0,
    },
  })

  const isCurrent = watch("current")

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "education")
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
    fd.append("institution", values.institution)
    fd.append("degree", values.degree)
    fd.append("field_of_study", values.field_of_study)
    fd.append("branch", values.branch || "")
    fd.append("university", values.university || "")
    fd.append("cgpa", values.cgpa || "")
    fd.append("percentage", values.percentage || "")
    fd.append("location", values.location || "")
    fd.append("institution_url", values.institution_url || "")
    fd.append("start_date", values.start_date)
    fd.append("end_date", values.current ? "" : values.end_date || "")
    fd.append("current", String(values.current))
    fd.append("description", values.description || "")
    fd.append("institution_logo", logoUrl)
    fd.append("display_order", String(values.display_order))

    const subArray = values.subjects
      ? values.subjects.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("subjects", JSON.stringify(subArray))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/education"), 800)
      } else {
        setServerError(result.error ?? "Failed to save education entry")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Degree & Institution</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Institution / College *</label>
            <Input {...register("institution")} placeholder="e.g. Stanford University" />
            {errors.institution && <p className="text-xs text-red-400 mt-1">{errors.institution.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Degree *</label>
            <Input {...register("degree")} placeholder="e.g. Bachelor of Science (B.S.)" />
            {errors.degree && <p className="text-xs text-red-400 mt-1">{errors.degree.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Field of Study / Major *</label>
            <Input {...register("field_of_study")} placeholder="e.g. Computer Science & Engineering" />
            {errors.field_of_study && <p className="text-xs text-red-400 mt-1">{errors.field_of_study.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">University / Affiliation</label>
            <Input {...register("university")} placeholder="e.g. Affiliated University" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">CGPA / GPA</label>
            <Input {...register("cgpa")} placeholder="e.g. 3.9 / 4.0 or 9.2 / 10" />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Percentage (%)</label>
            <Input {...register("percentage")} placeholder="e.g. 92%" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Location</label>
            <Input {...register("location")} placeholder="e.g. Stanford, CA" />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Website URL</label>
            <Input {...register("institution_url")} placeholder="https://stanford.edu" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Timeline</h3>

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
          <span className="text-sm text-white/70">Currently studying here</span>
        </label>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Description & Core Subjects</h3>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Overview / Description</label>
          <Textarea {...register("description")} rows={3} placeholder="Highlights, honors, or research work..." />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Key Subjects / Coursework (comma-separated)</label>
          <Input {...register("subjects")} placeholder="Data Structures, Algorithms, Distributed Systems, Machine Learning" />
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
          <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
        </div>
      </div>

      {/* Institution Logo Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Institution Logo</h3>
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
          {education ? "Save Changes" : "Create Education Entry"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/education")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
