"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const HeroProfileSchema = z.object({
  greeting:          z.string().max(100).optional(),
  name:              z.string().max(200).optional(),
  roles:             z.preprocess((v) => {
    if (typeof v === "string") {
      try { return JSON.parse(v) } catch { return v.split(",").map((s: string) => s.trim()).filter(Boolean) }
    }
    return v
  }, z.array(z.string())).optional(),
  tagline:           z.string().max(500).optional(),
  availability_text: z.string().max(200).optional(),
  resume_url:        z.string().url().optional().or(z.literal("")),
  github_url:        z.string().url().optional().or(z.literal("")),
  linkedin_url:      z.string().url().optional().or(z.literal("")),
  twitter_url:       z.string().url().optional().or(z.literal("")),
  email:             z.string().email().optional().or(z.literal("")),
  instagram_url:     z.string().url().optional().or(z.literal("")),
})

export async function updateHeroProfileAction(formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData.entries())
  const parsed = HeroProfileSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase
    .from("hero_profile")
    .upsert({
      id: "00000000-0000-0000-0001-000000000001",
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/hero")
  return { success: true }
}

const HeroStatSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(50),
  icon:  z.string().max(10),
  color: z.string().max(100),
  order: z.coerce.number().int().min(0),
})

export async function createHeroStatAction(formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = HeroStatSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("hero_stats").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/hero")
  return { success: true }
}

export async function deleteHeroStatAction(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("hero_stats").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/hero")
  return { success: true }
}
