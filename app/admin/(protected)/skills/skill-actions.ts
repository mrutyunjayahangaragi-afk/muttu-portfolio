"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const SkillSchema = z.object({
  name:                z.string().min(1).max(100),
  slug:                z.string().min(1).max(100),
  category:            z.string().min(1),
  icon:                z.string().max(10).optional(),
  icon_url:            z.string().optional(),
  description:         z.string().max(500).optional(),
  proficiency:         z.coerce.number().int().min(0).max(100),
  skill_level:         z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years_of_experience: z.coerce.number().min(0).max(50),
  featured:            z.preprocess((v) => v === "true" || v === true, z.boolean()),
  learning_status:     z.enum(["learning", "learned", "mastered"]),
  order:               z.coerce.number().int().min(0),
})

// ─── Shared schema ────────────────────────────────────────────────────────────

function revalidate() {
  revalidatePath("/", "layout")
  revalidatePath("/admin/skills")
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSkillAction(formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData.entries())
  const parsed = SkillSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("skills").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateSkillAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData.entries())
  const parsed = SkillSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from("skills")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

// ─── Delete (re-export for convenience) ──────────────────────────────────────

export async function deleteSkillAction(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

// ─── Toggle featured ──────────────────────────────────────────────────────────

export async function toggleSkillFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase
    .from("skills")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}
