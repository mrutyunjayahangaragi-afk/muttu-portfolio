"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "./delete-button"
import {
  updateHeroProfileAction,
  createHeroStatAction,
  deleteHeroStatAction,
} from "@/app/admin/(protected)/hero/hero-actions"
import type { HeroProfile, HeroStat } from "@/types/hero"

const profileSchema = z.object({
  greeting:          z.string().max(100).optional(),
  name:              z.string().max(200).optional(),
  tagline:           z.string().max(500).optional(),
  availability_text: z.string().max(200).optional(),
  resume_url:        z.string().url("Invalid URL").optional().or(z.literal("")),
  github_url:        z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url:      z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter_url:       z.string().url("Invalid URL").optional().or(z.literal("")),
  email:             z.string().email("Invalid email").optional().or(z.literal("")),
  instagram_url:     z.string().url("Invalid URL").optional().or(z.literal("")),
})

type ProfileValues = z.infer<typeof profileSchema>

interface HeroAdminFormProps {
  profile: HeroProfile | null
  stats: HeroStat[]
}

export function HeroAdminForm({ profile, stats }: HeroAdminFormProps) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rolesInput, setRolesInput] = useState((profile?.roles ?? []).join(", "))

  // New stat form
  const [newStat, setNewStat] = useState({ label: "", value: "", icon: "🚀", color: "from-blue-500 to-cyan-500", order: 0 })
  const [statPending, startStatTransition] = useTransition()
  const [statError, setStatError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      greeting:          profile?.greeting          ?? "Hello, I'm",
      name:              profile?.name              ?? "",
      tagline:           profile?.tagline           ?? "",
      availability_text: profile?.availability_text ?? "",
      resume_url:        profile?.resume_url        ?? "",
      github_url:        profile?.github_url        ?? "",
      linkedin_url:      profile?.linkedin_url      ?? "",
      twitter_url:       profile?.twitter_url       ?? "",
      email:             profile?.email             ?? "",
      instagram_url:     profile?.instagram_url     ?? "",
    },
  })

  async function onSubmit(values: ProfileValues) {
    setError(null); setSaved(false)
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v) })
    fd.append("roles", JSON.stringify(
      rolesInput.split(",").map((s) => s.trim()).filter(Boolean)
    ))
    startTransition(async () => {
      const result = await updateHeroProfileAction(fd)
      if (result.success) setSaved(true)
      else setError(result.error ?? "Unknown error")
    })
  }

  async function addStat() {
    setStatError(null)
    if (!newStat.label || !newStat.value) { setStatError("Label and value are required"); return }
    const fd = new FormData()
    Object.entries(newStat).forEach(([k, v]) => fd.append(k, String(v)))
    startStatTransition(async () => {
      const result = await createHeroStatAction(fd)
      if (result.success) setNewStat({ label: "", value: "", icon: "🚀", color: "from-blue-500 to-cyan-500", order: 0 })
      else setStatError(result.error ?? "Unknown error")
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Profile form ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-5">Identity & Content</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Greeting" error={errors.greeting?.message}>
              <Input {...register("greeting")} placeholder="Hello, I'm" />
            </Field>
            <Field label="Your Name" error={errors.name?.message}>
              <Input {...register("name")} placeholder="Your full name" />
            </Field>
            <Field label="Roles (comma-separated)" error={undefined} full>
              <Input value={rolesInput} onChange={(e) => setRolesInput(e.target.value)}
                placeholder="CSE Student, Full Stack Developer, AI Engineer" />
            </Field>
            <Field label="Tagline" error={errors.tagline?.message} full>
              <Textarea {...register("tagline")} rows={2} placeholder="Your professional tagline…" />
            </Field>
            <Field label="Availability Text" error={errors.availability_text?.message} full>
              <Input {...register("availability_text")} placeholder="Open to Internships & Freelance" />
            </Field>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-5">Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Resume URL"    error={errors.resume_url?.message}><Input {...register("resume_url")}    placeholder="https://…" /></Field>
            <Field label="GitHub URL"    error={errors.github_url?.message}><Input {...register("github_url")}    placeholder="https://github.com/…" /></Field>
            <Field label="LinkedIn URL"  error={errors.linkedin_url?.message}><Input {...register("linkedin_url")}  placeholder="https://linkedin.com/in/…" /></Field>
            <Field label="Twitter URL"   error={errors.twitter_url?.message}><Input {...register("twitter_url")}   placeholder="https://x.com/…" /></Field>
            <Field label="Email"         error={errors.email?.message}><Input {...register("email")}         placeholder="you@example.com" /></Field>
            <Field label="Instagram URL" error={errors.instagram_url?.message}><Input {...register("instagram_url")} placeholder="https://instagram.com/…" /></Field>
          </div>
        </div>

        {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"><AlertCircle size={15} />{error}</div>}
        {saved && <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle size={15} />Saved!</div>}

        <Button type="submit" variant="gradient" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Hero Profile
        </Button>
      </form>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-5">Achievement Stats</h3>

        {/* Existing stats */}
        {stats.length === 0 ? (
          <p className="text-sm text-white/40 mb-4">No stats added yet.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xl">{stat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{stat.value}</p>
                  <p className="text-xs text-white/45">{stat.label}</p>
                </div>
                <DeleteButton id={stat.id} action={deleteHeroStatAction} label="stat" size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* Add new stat */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input placeholder="Label (e.g. Projects)" value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} />
          <Input placeholder="Value (e.g. 50+)" value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} />
          <Input placeholder="Icon emoji" maxLength={4} value={newStat.icon} onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })} />
          <Input placeholder="Color class (e.g. from-blue-500 to-cyan-500)" value={newStat.color} onChange={(e) => setNewStat({ ...newStat, color: e.target.value })} />
        </div>
        {statError && <p className="text-xs text-red-400 mb-2">{statError}</p>}
        <Button type="button" variant="outline" onClick={addStat} disabled={statPending} className="gap-2">
          {statPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add Stat
        </Button>
      </div>
    </div>
  )
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs text-white/60 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
