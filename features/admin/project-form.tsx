"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Upload, AlertCircle, CheckCircle, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Project } from "@/types"
import type { ActionResult } from "@/types/actions"

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title:             z.string().min(1, "Required").max(200),
  slug:              z.string().min(1, "Required").max(200),
  description:       z.string().min(1, "Required").max(1000),
  short_description: z.string().max(300).optional(),
  full_description:  z.string().optional(),
  category:          z.string().min(1, "Required"),
  status:            z.enum(["completed", "in_progress", "archived"]),
  featured:          z.boolean(),
  published:         z.boolean(),
  github_url:        z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_url:          z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_demo_url:     z.string().url("Must be a valid URL").optional().or(z.literal("")),
  documentation_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  duration:          z.string().optional(),
  team_size:         z.number().int().min(1).optional(),
  version:           z.string().optional(),
  display_order:     z.number().int().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

const CATEGORIES = [
  "web", "ai", "ml", "mobile", "backend", "fullstack", "hackathon", "hackathon_participation", "open_source", "other"
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectFormProps {
  project?: Project
  onSubmit: (fd: FormData) => Promise<ActionResult>
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Media state
  const [coverImage, setCoverImage] = useState(project?.cover_image || project?.image_url || "")
  const [uploadingCover, setUploadingCover] = useState(false)

  // Tech stack & tags (comma-separated input)
  const [techInput, setTechInput] = useState((project?.tech_stack ?? []).join(", "))
  const [tagsInput, setTagsInput] = useState((project?.tags ?? []).join(", "))

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:             project?.title             ?? "",
      slug:              project?.slug              ?? "",
      description:       project?.description       ?? "",
      short_description: project?.short_description ?? "",
      full_description:  project?.full_description  ?? project?.long_description ?? "",
      category:          project?.category          ?? "web",
      status:            project?.status            ?? "completed",
      featured:          project?.featured          ?? false,
      published:         project?.published         ?? true,
      github_url:        project?.github_url        ?? "",
      live_url:          project?.live_url          ?? "",
      live_demo_url:     project?.live_demo_url     ?? "",
      documentation_url: project?.documentation_url ?? "",
      duration:          project?.duration          ?? "",
      team_size:         project?.team_size         ?? 1,
      version:           project?.version           ?? "1.0.0",
      display_order:     project?.display_order     ?? 0,
    },
  })

  // Auto-generate slug from title
  function handleTitleBlur() {
    if (!project) {
      const slug = watch("title")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setValue("slug", slug)
    }
  }

  // Upload cover image
  async function uploadCover(file: File) {
    setUploadingCover(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "projects/covers")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setCoverImage(data.secure_url)
    else setServerError(data.error)
    setUploadingCover(false)
  }

  async function submit(values: FormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    // Append all form values
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v))
    })
    // Append media + arrays
    fd.append("cover_image", coverImage)
    fd.append("image_url", coverImage)
    fd.append("tech_stack", JSON.stringify(
      techInput.split(",").map((s) => s.trim()).filter(Boolean)
    ))
    fd.append("tags", JSON.stringify(
      tagsInput.split(",").map((s) => s.trim()).filter(Boolean)
    ))

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/projects"), 800)
      } else {
        setServerError(result.error ?? "Unknown error")
      }
    })
  }

  const watchedTitle = watch("title")

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-3xl">

      {/* ── Cover Image ─────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-4">Cover Image</h3>
        <div className="flex items-center gap-4">
          {coverImage && (
            <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
            />
            {uploadingCover ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploadingCover ? "Uploading…" : "Upload Cover Image"}
          </label>
          {coverImage && (
            <button type="button" onClick={() => setCoverImage("")}
              className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 transition-colors">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Identity ────────────────────────────────────────────────── */}
      <Section title="Project Info">
        <Field label="Title *" error={errors.title?.message}>
          <Input {...register("title")} placeholder="My Awesome Project" onBlur={handleTitleBlur} />
        </Field>
        <Field label="Slug *" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="my-awesome-project" />
        </Field>
        <Field label="Category *" error={errors.category?.message}>
          <select {...register("category")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
            ))}
          </select>
        </Field>
        <Field label="Status *" error={errors.status?.message}>
          <select {...register("status")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Short Description (for cards)" error={errors.short_description?.message} full>
          <Textarea {...register("short_description")} rows={2} placeholder="1–2 sentence summary shown on cards…" />
        </Field>
        <Field label="Description *" error={errors.description?.message} full>
          <Textarea {...register("description")} rows={4} placeholder="Full description of the project…" />
        </Field>
        <Field label="Full Description (project detail page)" error={undefined} full>
          <Textarea {...register("full_description")} rows={6} placeholder="Detailed write-up with paragraphs (separate with blank lines)…" />
        </Field>
      </Section>

      {/* ── Tech ────────────────────────────────────────────────────── */}
      <Section title="Tech & Tags">
        <Field label="Tech Stack (comma-separated)" error={undefined} full>
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, Next.js, TypeScript, Supabase"
          />
        </Field>
        <Field label="Tags (comma-separated)" error={undefined} full>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="web, open-source, ai"
          />
        </Field>
      </Section>

      {/* ── Links ───────────────────────────────────────────────────── */}
      <Section title="Links">
        <Field label="GitHub URL" error={errors.github_url?.message}>
          <Input {...register("github_url")} placeholder="https://github.com/…" />
        </Field>
        <Field label="Live URL" error={errors.live_url?.message}>
          <Input {...register("live_url")} placeholder="https://yourproject.com" />
        </Field>
        <Field label="Live Demo URL" error={errors.live_demo_url?.message}>
          <Input {...register("live_demo_url")} placeholder="https://demo.yourproject.com" />
        </Field>
        <Field label="Documentation URL" error={errors.documentation_url?.message}>
          <Input {...register("documentation_url")} placeholder="https://docs.yourproject.com" />
        </Field>
      </Section>

      {/* ── Meta ────────────────────────────────────────────────────── */}
      <Section title="Meta">
        <Field label="Duration" error={undefined}>
          <Input {...register("duration")} placeholder="e.g. 2 months" />
        </Field>
        <Field label="Team Size" error={undefined}>
          <Input type="number" min={1} {...register("team_size", { valueAsNumber: true })} />
        </Field>
        <Field label="Version" error={undefined}>
          <Input {...register("version")} placeholder="1.0.0" />
        </Field>
        <Field label="Display Order" error={undefined}>
          <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
        </Field>
      </Section>

      {/* ── Visibility ──────────────────────────────────────────────── */}
      <Section title="Visibility">
        <Field label="Published (visible on public site)" error={undefined}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-white/70">Publish to public portfolio</span>
          </label>
        </Field>
        <Field label="Featured (shown prominently)" error={undefined}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-yellow-500" />
            <span className="text-sm text-white/70">Mark as featured project</span>
          </label>
        </Field>
      </Section>

      {/* ── Feedback ────────────────────────────────────────────────── */}
      {serverError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={15} />
          Saved! Redirecting…
        </div>
      )}

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="gradient" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {project ? "Save Changes" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Field({ label, error, full, children }: {
  label: string; error?: string; full?: boolean; children: React.ReactNode
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs text-white/60 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
