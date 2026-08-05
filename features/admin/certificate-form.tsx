"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Certificate } from "@/types"

const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  category: z.string().optional(),
  skills: z.string().optional(),
  featured: z.boolean(),
  display_order: z.number().int().min(0),
})

type FormValues = z.infer<typeof certificateSchema>

interface CertificateFormProps {
  certificate?: Certificate
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function CertificateForm({ certificate, onSubmit }: CertificateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState(certificate?.image_url ?? "")
  const [pdfUrl, setPdfUrl] = useState(certificate?.pdf_url ?? "")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: certificate?.title ?? "",
      slug: certificate?.slug ?? "",
      issuer: certificate?.issuer ?? "",
      issue_date: certificate?.issue_date ?? "",
      expiry_date: certificate?.expiry_date ?? "",
      credential_id: certificate?.credential_id ?? "",
      credential_url: certificate?.credential_url ?? "",
      category: certificate?.category ?? "cloud",
      skills: Array.isArray(certificate?.skills) ? certificate.skills.join(", ") : "",
      featured: certificate?.featured ?? false,
      display_order: certificate?.display_order ?? 0,
    },
  })

  const watchedTitle = watch("title")
  function handleTitleBlur() {
    if (!certificate) {
      const slug = watchedTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setValue("slug", slug)
    }
  }

  async function handleFileUpload(file: File, type: "image" | "pdf") {
    if (type === "image") setUploadingImage(true)
    else setUploadingPdf(true)

    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "certificates")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()

    if (res.ok) {
      if (type === "image") setImageUrl(data.secure_url)
      else setPdfUrl(data.secure_url)
    } else {
      setServerError(data.error)
    }

    if (type === "image") setUploadingImage(false)
    else setUploadingPdf(false)
  }

  async function submit(values: FormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    fd.append("title", values.title)
    fd.append("slug", values.slug)
    fd.append("issuer", values.issuer)
    fd.append("issue_date", values.issue_date)
    fd.append("expiry_date", values.expiry_date || "")
    fd.append("credential_id", values.credential_id || "")
    fd.append("credential_url", values.credential_url || "")
    fd.append("category", values.category || "general")
    fd.append("featured", String(values.featured))
    fd.append("image_url", imageUrl)
    fd.append("pdf_url", pdfUrl)
    fd.append("display_order", String(values.display_order))

    const skillArray = values.skills
      ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    fd.append("skills", JSON.stringify(skillArray))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/certificates"), 800)
      } else {
        setServerError(result.error ?? "Failed to save certificate")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Certificate Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Certificate Title *</label>
            <Input {...register("title")} placeholder="e.g. AWS Certified Solutions Architect" onBlur={handleTitleBlur} />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Slug *</label>
            <Input {...register("slug")} placeholder="aws-solutions-architect" />
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Issuing Organization *</label>
            <Input {...register("issuer")} placeholder="e.g. Amazon Web Services" />
            {errors.issuer && <p className="text-xs text-red-400 mt-1">{errors.issuer.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Category</label>
            <select
              {...register("category")}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cloud">Cloud Architecture</option>
              <option value="frontend">Frontend & Web</option>
              <option value="backend">Backend & APIs</option>
              <option value="ai_ml">AI & Data Science</option>
              <option value="security">Cybersecurity</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Credential ID</label>
            <Input {...register("credential_id")} placeholder="e.g. AWS-839201" />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Credential Verification Link</label>
            <Input {...register("credential_url")} placeholder="https://credly.com/badges/..." />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Validity & Skills</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Issue Date *</label>
            <Input type="date" {...register("issue_date")} />
            {errors.issue_date && <p className="text-xs text-red-400 mt-1">{errors.issue_date.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Expiration Date (optional)</label>
            <Input type="date" {...register("expiry_date")} />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Skills / Topics Tested (comma-separated)</label>
          <Input {...register("skills")} placeholder="Docker, Kubernetes, AWS IAM, Terraform" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/70">Featured Certificate</span>
          </label>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Display Order</label>
            <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      {/* Image / Badge & PDF Upload */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Badge Image & PDF Certificate</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 mb-2 block">Badge / Certificate Image</label>
            {imageUrl && (
              <div className="w-20 h-20 rounded-xl bg-white/10 mb-3 flex items-center justify-center overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Badge" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "image")}
              />
              {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploadingImage ? "Uploading..." : "Upload Badge Image"}
            </label>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-2 block">PDF Document (optional)</label>
            {pdfUrl && <p className="text-xs text-blue-400 truncate mb-3">{pdfUrl}</p>}
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "pdf")}
              />
              {uploadingPdf ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploadingPdf ? "Uploading..." : "Upload Certificate PDF"}
            </label>
          </div>
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
          {certificate ? "Save Changes" : "Create Certificate"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/certificates")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
