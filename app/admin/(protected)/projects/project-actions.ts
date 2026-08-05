"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const ProjectSchema = z.object({
  title:             z.string().min(1).max(200),
  slug:              z.string().min(1).max(200),
  description:       z.string().min(1).max(1000),
  short_description: z.string().max(300).optional(),
  full_description:  z.string().optional(),
  category:          z.string().min(1),
  status:            z.enum(["completed", "in_progress", "archived"]),
  featured:          z.preprocess((v) => v === "true" || v === true, z.boolean()),
  published:         z.preprocess((v) => v === "true" || v === true, z.boolean()),
  tech_stack:        z.preprocess((v) => {
    if (typeof v === "string") {
      try { return JSON.parse(v) } catch { return v.split(",").map((s: string) => s.trim()).filter(Boolean) }
    }
    return v
  }, z.array(z.string())),
  tags:              z.preprocess((v) => {
    if (typeof v === "string") {
      try { return JSON.parse(v) } catch { return v.split(",").map((s: string) => s.trim()).filter(Boolean) }
    }
    return v
  }, z.array(z.string())).optional(),
  github_url:        z.string().url().optional().or(z.literal("")),
  live_url:          z.string().url().optional().or(z.literal("")),
  live_demo_url:     z.string().url().optional().or(z.literal("")),
  documentation_url: z.string().url().optional().or(z.literal("")),
  pdf_url:           z.string().optional(),
  cover_image:       z.string().optional(),
  image_url:         z.string().optional(),
  architecture_image:z.string().optional(),
  duration:          z.string().optional(),
  team_size:         z.coerce.number().int().min(1).optional(),
  version:           z.string().optional(),
  display_order:     z.coerce.number().int().min(0).optional(),
  order:             z.coerce.number().int().min(0).optional(),
})

function revalidate() {
  revalidatePath("/", "layout")
  revalidatePath("/projects", "layout")
  revalidatePath("/admin/projects")
}

export async function createProjectAction(formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData.entries())
  const parsed = ProjectSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    published_at: parsed.data.published ? new Date().toISOString() : null,
  })
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

export async function updateProjectAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData.entries())
  const parsed = ProjectSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

export async function toggleProjectFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase
    .from("projects")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}

export async function toggleProjectPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase
    .from("projects")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidate()
  return { success: true }
}
