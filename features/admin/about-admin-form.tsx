"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, CheckCircle, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AboutProfile } from "@/types/about"

const schema = z.object({
  name: z.string().min(1, "Required"),
  tagline: z.string().min(1, "Required"),
  bio: z.string().min(1, "Required"),
  availability_status: z.enum(["available", "busy", "not_available"]),
  availability_text: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  degree: z.string().min(1, "Required"),
  university: z.string().min(1, "Required"),
  languages: z.string(),
  interests: z.string(),
  career_goal: z.string().min(1, "Required"),
  resume_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

interface AboutAdminFormProps {
  profile: AboutProfile | null
}

export function AboutAdminForm({ profile }: AboutAdminFormProps) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? "",
      tagline: profile?.tagline ?? "",
      bio: profile?.bio ?? "",
      availability_status: profile?.availability_status ?? "available",
      availability_text: profile?.availability_text ?? "",
      location: profile?.location ?? "",
      degree: profile?.degree ?? "",
      university: profile?.university ?? "",
      languages: profile?.languages?.join(", ") ?? "",
      interests: profile?.interests?.join(", ") ?? "",
      career_goal: profile?.career_goal ?? "",
      resume_url: profile?.resume_url ?? "",
      github_url: profile?.github_url ?? "",
      linkedin_url: profile?.linkedin_url ?? "",
    },
  })

  async function uploadAvatar(file: File) {
    setAvatarUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "avatars")
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (res.ok) setAvatarUrl(data.secure_url)
    setAvatarUploading(false)
  }

  async function onSubmit(values: FormValues) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from("about_profile")
        .upsert({
          id: "00000000-0000-0000-0000-000000000001",
          ...values,
          languages: values.languages.split(",").map((s) => s.trim()).filter(Boolean),
          interests: values.interests.split(",").map((s) => s.trim()).filter(Boolean),
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
      if (dbError) setError(dbError.message)
      else setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── Avatar ──────────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-4">Profile Image</h3>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-3xl shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : "👤"}
          </div>
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors text-sm text-white/70">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
            />
            {avatarUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {avatarUploading ? "Uploading…" : "Upload Image"}
          </label>
          {avatarUrl && (
            <button type="button" onClick={() => setAvatarUrl("")} className="text-xs text-red-400 hover:text-red-300">
              Remove
            </button>
          )}
        </div>
      </div>

      {/* ── Identity ────────────────────────────────────────────────── */}
      <Section title="Identity">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Your full name" />
        </Field>
        <Field label="Tagline" error={errors.tagline?.message}>
          <Input {...register("tagline")} placeholder="CSE Student & Full Stack Developer" />
        </Field>
        <Field label="Bio" error={errors.bio?.message} full>
          <Textarea {...register("bio")} rows={5} placeholder="Write 2–4 paragraphs about yourself. Separate paragraphs with a blank line." className="min-h-[120px]" />
        </Field>
      </Section>

      {/* ── Availability ────────────────────────────────────────────── */}
      <Section title="Availability">
        <Field label="Status" error={errors.availability_status?.message}>
          <select
            {...register("availability_status")}
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">✅ Available</option>
            <option value="busy">⏳ Busy</option>
            <option value="not_available">❌ Not Available</option>
          </select>
        </Field>
        <Field label="Availability Text" error={errors.availability_text?.message}>
          <Input {...register("availability_text")} placeholder="Open to Internships & Freelance" />
        </Field>
      </Section>

      {/* ── Personal Info ────────────────────────────────────────────── */}
      <Section title="Personal Info">
        <Field label="Location" error={errors.location?.message}>
          <Input {...register("location")} placeholder="City, Country" />
        </Field>
        <Field label="Degree" error={errors.degree?.message}>
          <Input {...register("degree")} placeholder="B.E. Computer Science Engineering" />
        </Field>
        <Field label="University" error={errors.university?.message}>
          <Input {...register("university")} placeholder="Your University" />
        </Field>
        <Field label="Languages (comma-separated)" error={errors.languages?.message}>
          <Input {...register("languages")} placeholder="English, Hindi, Kannada" />
        </Field>
        <Field label="Interests (comma-separated)" error={errors.interests?.message}>
          <Input {...register("interests")} placeholder="Web Development, AI/ML, Open Source" />
        </Field>
        <Field label="Career Goal" error={errors.career_goal?.message} full>
          <Textarea {...register("career_goal")} rows={2} placeholder="Build impactful products…" />
        </Field>
      </Section>

      {/* ── Links ───────────────────────────────────────────────────── */}
      <Section title="Links">
        <Field label="Resume URL" error={errors.resume_url?.message}>
          <Input {...register("resume_url")} placeholder="https://…" />
        </Field>
        <Field label="GitHub URL" error={errors.github_url?.message}>
          <Input {...register("github_url")} placeholder="https://github.com/…" />
        </Field>
        <Field label="LinkedIn URL" error={errors.linkedin_url?.message}>
          <Input {...register("linkedin_url")} placeholder="https://linkedin.com/in/…" />
        </Field>
      </Section>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={15} /> Saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        Save Changes
      </button>
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
