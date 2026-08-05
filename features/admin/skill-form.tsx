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
import type { Skill } from "@/types"

// ─── Schema ───────────────────────────────────────────────────────────────────

const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  category: z.string().min(1, "Category is required"),
  icon: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  proficiency: z.number().int().min(0).max(100),
  skill_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years_of_experience: z.number().min(0).max(50),
  featured: z.boolean(),
  learning_status: z.enum(["learning", "learned", "mastered"]),
  order: z.number().int().min(0),
})

type SkillFormValues = z.infer<typeof skillSchema>

const CATEGORIES = [
  { value: "frontend",  label: "Frontend" },
  { value: "backend",   label: "Backend" },
  { value: "ai_ml",     label: "AI / ML" },
  { value: "database",  label: "Database" },
  { value: "devops",    label: "DevOps" },
  { value: "cloud",     label: "Cloud" },
  { value: "tools",     label: "Tools" },
  { value: "languages", label: "Languages" },
  { value: "frameworks",label: "Frameworks" },
  { value: "other",     label: "Other" },
]

const CATEGORY_COLORS: Record<string, string> = {
  frontend:  "from-blue-500 to-cyan-500",
  backend:   "from-green-500 to-emerald-500",
  ai_ml:     "from-purple-500 to-pink-500",
  database:  "from-orange-500 to-amber-500",
  devops:    "from-red-500 to-orange-500",
  cloud:     "from-sky-500 to-blue-500",
  tools:     "from-teal-500 to-cyan-500",
  languages: "from-pink-500 to-rose-500",
  other:     "from-gray-500 to-slate-500",
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SkillFormProps {
  /** Existing skill when editing; undefined when creating */
  skill?: Skill
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkillForm({ skill, onSubmit }: SkillFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [iconUrl, setIconUrl] = useState(skill?.icon_url ?? "")
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name:                skill?.name                ?? "",
      slug:                skill?.slug                ?? "",
      category:            skill?.category            ?? "frontend",
      icon:                skill?.icon                ?? "",
      description:         skill?.description         ?? "",
      proficiency:         skill?.proficiency         ?? 80,
      skill_level:         skill?.skill_level         ?? "intermediate",
      years_of_experience: skill?.years_of_experience ?? 1,
      featured:            skill?.featured            ?? false,
      learning_status:     skill?.learning_status     ?? "learned",
      order:               skill?.order               ?? 0,
    },
  })

  // Auto-generate slug from name
  const watchedName = watch("name")
  function handleNameBlur() {
    if (!skill) {
      const slug = watchedName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setValue("slug", slug)
    }
  }

  // Upload icon image to Cloudinary
  async function handleIconUpload(file: File) {
    setUploadingIcon(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "skills")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setIconUrl(data.secure_url)
    else setServerError(data.error)
    setUploadingIcon(false)
  }

  async function submit(values: SkillFormValues) {
    setServerError(null)
    setSaved(false)

    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
    fd.append("icon_url", iconUrl)

    startTransition(async () => {
      const result = await onSubmit(fd)
      if (result.success) {
        setSaved(true)
        setTimeout(() => router.push("/admin/skills"), 800)
      } else {
        setServerError(result.error ?? "Unknown error")
      }
    })
  }

  const watchedCategory = watch("category")
  const watchedProficiency = watch("proficiency")
  const catColor = CATEGORY_COLORS[watchedCategory] || CATEGORY_COLORS.other

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 max-w-2xl">

      {/* ── Preview card ───────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-white/10 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${catColor} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
          {iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconUrl} alt="Icon preview" className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-white">{watch("icon") || watch("name")?.[0] || "?"}</span>
          )}
        </div>
        <div>
          <p className="text-base font-semibold text-white">{watch("name") || "Skill Name"}</p>
          <p className="text-xs text-white/45 capitalize">{watchedCategory.replace("_", " / ")} · {watchedProficiency}%</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold text-white">{watchedProficiency}%</p>
          <p className="text-xs text-white/40">Proficiency</p>
        </div>
      </div>

      {/* ── Identity ───────────────────────────────────────────────────── */}
      <Section title="Identity">
        <Field label="Name *" error={errors.name?.message}>
          <Input
            {...register("name")}
            placeholder="e.g. React"
            onBlur={handleNameBlur}
          />
        </Field>
        <Field label="Slug *" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="e.g. react" />
        </Field>
        <Field label="Category *" error={errors.category?.message}>
          <select
            {...register("category")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Emoji Icon" error={errors.icon?.message}>
          <Input {...register("icon")} placeholder="e.g. ⚛ or R" maxLength={4} />
        </Field>
        <Field label="Description" error={errors.description?.message} full>
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Short description of this skill…"
          />
        </Field>
      </Section>

      {/* ── Icon image upload ──────────────────────────────────────────── */}
      <Section title="Icon Image (optional)">
        <div className="sm:col-span-2 flex items-center gap-4">
          {iconUrl && (
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catColor} flex items-center justify-center shrink-0`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconUrl} alt="Icon" className="w-8 h-8 object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleIconUpload(e.target.files[0])}
            />
            {uploadingIcon ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploadingIcon ? "Uploading…" : "Upload Icon Image"}
          </label>
          {iconUrl && (
            <button
              type="button"
              onClick={() => setIconUrl("")}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          )}
        </div>
      </Section>

      {/* ── Metrics ────────────────────────────────────────────────────── */}
      <Section title="Metrics">
        <Field label={`Proficiency: ${watchedProficiency}%`} error={errors.proficiency?.message}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              className="flex-1 accent-blue-500"
              {...register("proficiency", { valueAsNumber: true })}
            />
            <span className="w-10 text-sm text-white/70 text-right">{watchedProficiency}%</span>
          </div>
        </Field>
        <Field label="Skill Level" error={errors.skill_level?.message}>
          <select
            {...register("skill_level")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </Field>
        <Field label="Years of Experience" error={errors.years_of_experience?.message}>
          <Input
            type="number"
            min={0}
            max={50}
            step={0.5}
            {...register("years_of_experience", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Display Order" error={errors.order?.message}>
          <Input
            type="number"
            min={0}
            {...register("order", { valueAsNumber: true })}
          />
        </Field>
      </Section>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <Section title="Status">
        <Field label="Learning Status" error={errors.learning_status?.message}>
          <select
            {...register("learning_status")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="learning">Currently Learning</option>
            <option value="learned">Learned</option>
            <option value="mastered">Mastered</option>
          </select>
        </Field>
        <Field label="Featured (shown in Top Skills)" error={undefined}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("featured")}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-sm text-white/70">Mark as featured / top skill</span>
          </label>
        </Field>
      </Section>

      {/* ── Feedback ───────────────────────────────────────────────────── */}
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

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="gradient"
          disabled={isPending}
          className="gap-2"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {skill ? "Save Changes" : "Create Skill"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/skills")}
        >
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

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs text-white/60 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
