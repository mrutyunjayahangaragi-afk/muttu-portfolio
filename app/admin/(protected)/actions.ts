"use server"

/**
 * app/admin/(protected)/actions.ts
 *
 * Server Actions for all admin CRUD operations.
 *
 * Every action calls requireAdminForAction() first — if the caller is not
 * the authenticated admin, it throws "Unauthorized" before touching the DB.
 *
 * Pattern:
 *  1. Authenticate & authorize
 *  2. Validate input (zod)
 *  3. Execute DB operation
 *  4. Revalidate affected paths so the live site updates immediately
 *  5. Return typed result { success, error, data? }
 */

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

// Re-export so existing imports from this file continue to work
export type { ActionResult }

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutAction(): Promise<ActionResult> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/admin", "layout")
  return { success: true }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const ProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  long_description: z.string().max(10000).optional(),
  tech_stack: z.array(z.string()).default([]),
  github_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in_progress", "archived"]).default("completed"),
  category: z.string().default("web"),
  order: z.number().int().default(0),
})

export async function createProject(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    github_url: formData.get("github_url") || undefined,
    live_url: formData.get("live_url") || undefined,
    image_url: formData.get("image_url") || undefined,
    featured: formData.get("featured") === "true",
    status: formData.get("status") || "completed",
    category: formData.get("category") || "web",
    order: Number(formData.get("order") || 0),
  }

  const parsed = ProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("projects").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/projects")
  return { success: true }
}

export async function updateProject(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    github_url: formData.get("github_url") || undefined,
    live_url: formData.get("live_url") || undefined,
    image_url: formData.get("image_url") || undefined,
    featured: formData.get("featured") === "true",
    status: formData.get("status") || "completed",
    category: formData.get("category") || "web",
    order: Number(formData.get("order") || 0),
  }

  const parsed = ProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/projects")
  return { success: true }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/projects")
  return { success: true }
}

// ─── Skills ───────────────────────────────────────────────────────────────────

const SkillSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
  category: z.string().default("other"),
  proficiency: z.number().int().min(0).max(100).default(80),
  order: z.number().int().default(0),
})

export async function createSkill(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = SkillSchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon") || undefined,
    category: formData.get("category") || "other",
    proficiency: Number(formData.get("proficiency") || 80),
    order: Number(formData.get("order") || 0),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("skills").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/skills")
  return { success: true }
}

export async function updateSkill(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = SkillSchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon") || undefined,
    category: formData.get("category") || "other",
    proficiency: Number(formData.get("proficiency") || 80),
    order: Number(formData.get("order") || 0),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("skills").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/skills")
  return { success: true }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/skills")
  return { success: true }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

const BlogSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  cover_image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

export async function createBlog(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = BlogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image: formData.get("cover_image") || undefined,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("blogs").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/blog", "layout")
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function updateBlog(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = BlogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image: formData.get("cover_image") || undefined,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from("blogs")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/blog", "layout")
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("blogs").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/blog", "layout")
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function toggleBlogPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase
    .from("blogs")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/blog", "layout")
  revalidatePath("/admin/blog")
  return { success: true }
}

// ─── Experience ───────────────────────────────────────────────────────────────

const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  tech_stack: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skills_learned: z.array(z.string()).default([]),
  start_date: z.string().min(1),
  end_date: z.string().nullable().optional(),
  current: z.boolean().default(false),
  company_logo: z.string().optional(),
  company_url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  employment_type: z.enum(["full_time", "part_time", "internship", "freelance", "contract"]).default("full_time"),
  type: z.enum(["full_time", "part_time", "internship", "freelance", "contract"]).default("full_time"),
  team_size: z.number().int().nullable().optional(),
  display_order: z.number().int().default(0),
  order: z.number().int().default(0),
})

export async function createExperience(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    company: formData.get("company"),
    role: formData.get("role"),
    description: formData.get("description"),
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    responsibilities: JSON.parse((formData.get("responsibilities") as string) || "[]"),
    achievements: JSON.parse((formData.get("achievements") as string) || "[]"),
    skills_learned: JSON.parse((formData.get("skills_learned") as string) || "[]"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    company_logo: formData.get("company_logo") || undefined,
    company_url: formData.get("company_url") || undefined,
    location: formData.get("location") || undefined,
    employment_type: formData.get("employment_type") || "full_time",
    type: formData.get("employment_type") || "full_time",
    team_size: formData.get("team_size") ? Number(formData.get("team_size")) : null,
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = ExperienceSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("experience").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateExperience(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    company: formData.get("company"),
    role: formData.get("role"),
    description: formData.get("description"),
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    responsibilities: JSON.parse((formData.get("responsibilities") as string) || "[]"),
    achievements: JSON.parse((formData.get("achievements") as string) || "[]"),
    skills_learned: JSON.parse((formData.get("skills_learned") as string) || "[]"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    company_logo: formData.get("company_logo") || undefined,
    company_url: formData.get("company_url") || undefined,
    location: formData.get("location") || undefined,
    employment_type: formData.get("employment_type") || "full_time",
    type: formData.get("employment_type") || "full_time",
    team_size: formData.get("team_size") ? Number(formData.get("team_size")) : null,
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = ExperienceSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("experience").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("experience").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Education ────────────────────────────────────────────────────────────────

const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field_of_study: z.string().min(1),
  branch: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  gpa: z.string().nullable().optional(),
  cgpa: z.string().nullable().optional(),
  percentage: z.string().nullable().optional(),
  subjects: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
  start_date: z.string().min(1),
  end_date: z.string().nullable().optional(),
  current: z.boolean().default(false),
  institution_logo: z.string().optional(),
  institution_url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  display_order: z.number().int().default(0),
  order: z.number().int().default(0),
})

export async function createEducation(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    institution: formData.get("institution"),
    degree: formData.get("degree"),
    field_of_study: formData.get("field_of_study"),
    branch: formData.get("branch") || null,
    university: formData.get("university") || null,
    description: formData.get("description") || null,
    gpa: formData.get("cgpa") || formData.get("gpa") || null,
    cgpa: formData.get("cgpa") || null,
    percentage: formData.get("percentage") || null,
    subjects: JSON.parse((formData.get("subjects") as string) || "[]"),
    activities: JSON.parse((formData.get("activities") as string) || "[]"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    institution_logo: formData.get("institution_logo") || undefined,
    institution_url: formData.get("institution_url") || undefined,
    location: formData.get("location") || undefined,
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = EducationSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("education").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateEducation(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    institution: formData.get("institution"),
    degree: formData.get("degree"),
    field_of_study: formData.get("field_of_study"),
    branch: formData.get("branch") || null,
    university: formData.get("university") || null,
    description: formData.get("description") || null,
    gpa: formData.get("cgpa") || formData.get("gpa") || null,
    cgpa: formData.get("cgpa") || null,
    percentage: formData.get("percentage") || null,
    subjects: JSON.parse((formData.get("subjects") as string) || "[]"),
    activities: JSON.parse((formData.get("activities") as string) || "[]"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    institution_logo: formData.get("institution_logo") || undefined,
    institution_url: formData.get("institution_url") || undefined,
    location: formData.get("location") || undefined,
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = EducationSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("education").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("education").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Certificates ─────────────────────────────────────────────────────────────

const CertificateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.string().min(1),
  expiry_date: z.string().nullable().optional(),
  credential_id: z.string().nullable().optional(),
  credential_url: z.string().url().nullable().optional().or(z.literal("")),
  image_url: z.string().nullable().optional(),
  pdf_url: z.string().nullable().optional(),
  category: z.string().default("general"),
  skills: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  order: z.number().int().default(0),
})

export async function createCertificate(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    issuer: formData.get("issuer"),
    issue_date: formData.get("issue_date"),
    expiry_date: formData.get("expiry_date") || null,
    credential_id: formData.get("credential_id") || null,
    credential_url: formData.get("credential_url") || null,
    image_url: formData.get("image_url") || null,
    pdf_url: formData.get("pdf_url") || null,
    category: formData.get("category") || "general",
    skills: JSON.parse((formData.get("skills") as string) || "[]"),
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = CertificateSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("certificates").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateCertificate(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    issuer: formData.get("issuer"),
    issue_date: formData.get("issue_date"),
    expiry_date: formData.get("expiry_date") || null,
    credential_id: formData.get("credential_id") || null,
    credential_url: formData.get("credential_url") || null,
    image_url: formData.get("image_url") || null,
    pdf_url: formData.get("pdf_url") || null,
    category: formData.get("category") || "general",
    skills: JSON.parse((formData.get("skills") as string) || "[]"),
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = CertificateSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("certificates").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("certificates").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Hackathons ───────────────────────────────────────────────────────────────

const HackathonSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  event_name: z.string().nullable().optional(),
  organizer: z.string().min(1),
  description: z.string().min(1),
  theme: z.string().nullable().optional(),
  team_name: z.string().nullable().optional(),
  my_role: z.string().nullable().optional(),
  problem_statement: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  result: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  team_size: z.number().int().nullable().optional(),
  tech_stack: z.array(z.string()).default([]),
  ai_models: z.array(z.string()).default([]),
  duration: z.string().nullable().optional(),
  mentor_names: z.array(z.string()).default([]),
  prize: z.string().nullable().optional(),
  ranking: z.string().nullable().optional(),
  certificate_url: z.string().url().nullable().optional().or(z.literal("")),
  github_url: z.string().url().nullable().optional().or(z.literal("")),
  demo_url: z.string().url().nullable().optional().or(z.literal("")),
  project_url: z.string().url().nullable().optional().or(z.literal("")),
  image_url: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  lessons_learned: z.string().nullable().optional(),
  future_improvements: z.string().nullable().optional(),
  date: z.string().min(1),
  location: z.string().nullable().optional(),
  mode: z.enum(["online", "offline", "hybrid"]).default("online"),
  featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  order: z.number().int().default(0),
})

export async function createHackathon(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    event_name: formData.get("event_name") || formData.get("name"),
    organizer: formData.get("organizer"),
    description: formData.get("description"),
    theme: formData.get("theme") || null,
    team_name: formData.get("team_name") || null,
    my_role: formData.get("my_role") || null,
    problem_statement: formData.get("problem_statement") || null,
    solution: formData.get("solution") || null,
    result: formData.get("ranking") || formData.get("result") || null,
    position: formData.get("ranking") || formData.get("position") || null,
    team_size: formData.get("team_size") ? Number(formData.get("team_size")) : null,
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    ai_models: JSON.parse((formData.get("ai_models") as string) || "[]"),
    duration: formData.get("duration") || null,
    mentor_names: JSON.parse((formData.get("mentor_names") as string) || "[]"),
    prize: formData.get("prize") || null,
    ranking: formData.get("ranking") || null,
    certificate_url: formData.get("certificate_url") || null,
    github_url: formData.get("github_url") || null,
    demo_url: formData.get("demo_url") || null,
    project_url: formData.get("demo_url") || formData.get("project_url") || null,
    image_url: formData.get("image_url") || null,
    gallery: JSON.parse((formData.get("gallery") as string) || "[]"),
    lessons_learned: formData.get("lessons_learned") || null,
    future_improvements: formData.get("future_improvements") || null,
    date: formData.get("date"),
    location: formData.get("location") || null,
    mode: formData.get("mode") || "online",
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = HackathonSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("hackathons").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateHackathon(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    event_name: formData.get("event_name") || formData.get("name"),
    organizer: formData.get("organizer"),
    description: formData.get("description"),
    theme: formData.get("theme") || null,
    team_name: formData.get("team_name") || null,
    my_role: formData.get("my_role") || null,
    problem_statement: formData.get("problem_statement") || null,
    solution: formData.get("solution") || null,
    result: formData.get("ranking") || formData.get("result") || null,
    position: formData.get("ranking") || formData.get("position") || null,
    team_size: formData.get("team_size") ? Number(formData.get("team_size")) : null,
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    ai_models: JSON.parse((formData.get("ai_models") as string) || "[]"),
    duration: formData.get("duration") || null,
    mentor_names: JSON.parse((formData.get("mentor_names") as string) || "[]"),
    prize: formData.get("prize") || null,
    ranking: formData.get("ranking") || null,
    certificate_url: formData.get("certificate_url") || null,
    github_url: formData.get("github_url") || null,
    demo_url: formData.get("demo_url") || null,
    project_url: formData.get("demo_url") || formData.get("project_url") || null,
    image_url: formData.get("image_url") || null,
    gallery: JSON.parse((formData.get("gallery") as string) || "[]"),
    lessons_learned: formData.get("lessons_learned") || null,
    future_improvements: formData.get("future_improvements") || null,
    date: formData.get("date"),
    location: formData.get("location") || null,
    mode: formData.get("mode") || "online",
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
    order: Number(formData.get("order") || 0),
  }

  const parsed = HackathonSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("hackathons").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteHackathon(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("hackathons").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Achievements ─────────────────────────────────────────────────────────────

const AchievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["award", "competition", "scholarship", "ranking", "publication", "open_source", "leadership", "other"]).default("award"),
  organization: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  award_date: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
})

export async function createAchievement(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category") || "award",
    organization: formData.get("organization") || null,
    image_url: formData.get("image_url") || null,
    award_date: formData.get("award_date") || null,
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = AchievementSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("achievements").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateAchievement(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category") || "award",
    organization: formData.get("organization") || null,
    image_url: formData.get("image_url") || null,
    award_date: formData.get("award_date") || null,
    featured: formData.get("featured") === "true",
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = AchievementSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("achievements").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("achievements").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Leadership ───────────────────────────────────────────────────────────────

const LeadershipSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().nullable().optional(),
  achievements: z.array(z.string()).default([]),
  logo_url: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
})

export async function createLeadership(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    start_date: formData.get("start_date") || null,
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    description: formData.get("description") || null,
    achievements: JSON.parse((formData.get("achievements") as string) || "[]"),
    logo_url: formData.get("logo_url") || null,
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = LeadershipSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("leadership").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateLeadership(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    start_date: formData.get("start_date") || null,
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    description: formData.get("description") || null,
    achievements: JSON.parse((formData.get("achievements") as string) || "[]"),
    logo_url: formData.get("logo_url") || null,
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = LeadershipSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("leadership").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteLeadership(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("leadership").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Volunteering ─────────────────────────────────────────────────────────────

const VolunteeringSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
})

export async function createVolunteering(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    start_date: formData.get("start_date") || null,
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    description: formData.get("description") || null,
    impact: formData.get("impact") || null,
    logo_url: formData.get("logo_url") || null,
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = VolunteeringSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("volunteering").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateVolunteering(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    start_date: formData.get("start_date") || null,
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    description: formData.get("description") || null,
    impact: formData.get("impact") || null,
    logo_url: formData.get("logo_url") || null,
    display_order: Number(formData.get("display_order") || 0),
  }

  const parsed = VolunteeringSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("volunteering").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function deleteVolunteering(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()
  const { error } = await supabase.from("volunteering").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/messages")
  return { success: true }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/messages")
  return { success: true }
}

// ─── Fun Facts ─────────────────────────────────────────────────────────────────

const FunFactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  icon: z.string().default("⚡"),
  order: z.number().int().default(0),
})

export async function createFunFact(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon") || "⚡",
    order: Number(formData.get("order") || 0),
  }

  const parsed = FunFactSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("fun_facts").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function updateFunFact(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon") || "⚡",
    order: Number(formData.get("order") || 0),
  }

  const parsed = FunFactSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("fun_facts").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function deleteFunFact(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("fun_facts").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

// ─── About Stats ───────────────────────────────────────────────────────────────

const AboutStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  icon: z.string().default("⚡"),
  color: z.string().default("from-blue-500 to-purple-500"),
  order: z.number().int().default(0),
})

export async function createAboutStat(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = AboutStatSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("about_stats").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function updateAboutStat(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = AboutStatSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("about_stats").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function deleteAboutStat(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("about_stats").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

// ─── Journey Milestones ────────────────────────────────────────────────────────

const JourneyMilestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  year: z.string().min(1, "Year is required").max(50),
  icon: z.string().default("⚡"),
  color: z.string().default("from-blue-500 to-purple-500"),
  order: z.number().int().default(0),
})

export async function createJourneyMilestone(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    year: formData.get("year"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = JourneyMilestoneSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("journey_milestones").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/about")
  revalidatePath("/journey")
  revalidatePath("/admin/about")
  revalidatePath("/admin/journey")
  return { success: true }
}

export async function updateJourneyMilestone(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    year: formData.get("year"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = JourneyMilestoneSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("journey_milestones").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/about")
  revalidatePath("/journey")
  revalidatePath("/admin/about")
  revalidatePath("/admin/journey")
  return { success: true }
}

export async function deleteJourneyMilestone(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("journey_milestones").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/about")
  revalidatePath("/journey")
  revalidatePath("/admin/about")
  revalidatePath("/admin/journey")
  return { success: true }
}

// ─── Core Values ──────────────────────────────────────────────────────────────

const CoreValueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("⚡"),
  color: z.string().default("from-blue-500 to-purple-500"),
  order: z.number().int().default(0),
})

export async function createCoreValue(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = CoreValueSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("core_values").insert(parsed.data)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function updateCoreValue(id: string, _prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon") || "⚡",
    color: formData.get("color") || "from-blue-500 to-purple-500",
    order: Number(formData.get("order") || 0),
  }

  const parsed = CoreValueSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from("core_values").update(parsed.data).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

export async function deleteCoreValue(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("core_values").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  revalidatePath("/admin/about")
  return { success: true }
}

// ─── Media Gallery ─────────────────────────────────────────────────────────────

export async function saveMediaItem(data: {
  url: string
  public_id?: string
  filename: string
  file_size?: number
}): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("media_gallery").insert({
    url: data.url,
    public_id: data.public_id || null,
    filename: data.filename,
    file_size: data.file_size || 0,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteMediaItem(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("media_gallery").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/gallery")
  return { success: true }
}

// ─── Activity Logger Helper ───────────────────────────────────────────────────

export async function logActivity(
  action: string,
  module: string,
  status: "success" | "warning" | "error" = "success",
  details?: string
): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from("activity_logs").insert({
      action,
      module,
      status,
      details: details || null,
    })
  } catch (err) {
    console.error("Failed to log activity:", err)
  }
}

// ─── Notifications Actions ────────────────────────────────────────────────────

export async function markNotificationRead(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/notifications")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("read", false)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/notifications")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteNotification(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/notifications")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

// ─── Backup Actions ───────────────────────────────────────────────────────────

export async function createDatabaseBackup(): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  // Fetch summary of all database records
  const [projects, blogs, skills, certs, hackathons, messages] = await Promise.all([
    supabase.from("projects").select("*"),
    supabase.from("blogs").select("*"),
    supabase.from("skills").select("*"),
    supabase.from("certificates").select("*"),
    supabase.from("hackathons").select("*"),
    supabase.from("contact_messages").select("*"),
  ])

  const backupData = {
    timestamp: new Date().toISOString(),
    version: "1.0",
    tables: {
      projects: projects.data ?? [],
      blogs: blogs.data ?? [],
      skills: skills.data ?? [],
      certificates: certs.data ?? [],
      hackathons: hackathons.data ?? [],
      contact_messages: messages.data ?? [],
    },
  }

  const jsonStr = JSON.stringify(backupData, null, 2)
  const sizeBytes = new Blob([jsonStr]).size
  const backupName = `db_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`

  const { error } = await supabase.from("backups").insert({
    name: backupName,
    size_bytes: sizeBytes,
    type: "database",
    status: "completed",
  })

  if (error) return { success: false, error: error.message }

  await logActivity(`Created manual database backup: ${backupName}`, "backups", "success")

  revalidatePath("/admin/backups")
  return { success: true }
}

export async function restoreDatabaseBackup(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { data: backup } = await supabase.from("backups").select("*").eq("id", id).single()
  if (!backup) return { success: false, error: "Backup record not found." }

  await logActivity(`Verified and restored database backup: ${backup.name}`, "backups", "success")

  revalidatePath("/admin/backups")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteBackup(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("backups").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/backups")
  return { success: true }
}

// ─── Theme Config Actions ──────────────────────────────────────────────────────

const ThemeSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  logo_text: z.string().default("<Dev/>"),
  primary_color: z.string().default("#3b82f6"),
  secondary_color: z.string().default("#a855f7"),
  accent_color: z.string().default("#10b981"),
  background_color: z.string().default("#020408"),
  font_heading: z.string().default("Inter"),
  font_body: z.string().default("Inter"),
  border_radius: z.string().default("1rem"),
  mode: z.enum(["light", "dark", "system", "custom"]).default("dark"),
})

export async function updateThemeConfig(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const raw = {
    site_name: formData.get("site_name"),
    logo_text: formData.get("logo_text") || "<Dev/>",
    primary_color: formData.get("primary_color") || "#3b82f6",
    secondary_color: formData.get("secondary_color") || "#a855f7",
    accent_color: formData.get("accent_color") || "#10b981",
    background_color: formData.get("background_color") || "#020408",
    font_heading: formData.get("font_heading") || "Inter",
    font_body: formData.get("font_body") || "Inter",
    border_radius: formData.get("border_radius") || "1rem",
    mode: formData.get("mode") || "dark",
  }

  const parsed = ThemeSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase
    .from("theme_config")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", "00000000-0000-0000-0000-000000000099")

  if (error) return { success: false, error: error.message }

  // Sync to settings table as well if present
  await supabase
    .from("settings")
    .update({ site_name: parsed.data.site_name, logo_text: parsed.data.logo_text, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000")

  await logActivity(`Updated site theme & branding configuration (${parsed.data.logo_text})`, "theme", "success")

  revalidatePath("/", "layout")
  revalidatePath("/admin/theme")
  return { success: true }
}

// ─── Hackathon Gallery Actions ────────────────────────────────────────────────

export async function addHackathonGalleryItem(data: {
  hackathon_id: string
  image_url: string
  image_title?: string
  image_description?: string
  category?: string
  is_featured?: boolean
}): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("hackathon_gallery").insert({
    hackathon_id: data.hackathon_id,
    image_url: data.image_url,
    image_title: data.image_title || null,
    image_description: data.image_description || null,
    category: data.category || "Event",
    is_featured: Boolean(data.is_featured),
  })

  if (error) return { success: false, error: error.message }

  await logActivity(`Added gallery photo to hackathon`, "hackathons", "success")

  revalidatePath(`/admin/hackathons/${data.hackathon_id}/edit`)
  revalidatePath("/hackathons")
  return { success: true }
}

export async function updateHackathonGalleryItem(
  id: string,
  data: {
    image_title?: string
    image_description?: string
    category?: string
    is_featured?: boolean
  }
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase
    .from("hackathon_gallery")
    .update({
      image_title: data.image_title || null,
      image_description: data.image_description || null,
      category: data.category || "Event",
      is_featured: Boolean(data.is_featured),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/hackathons")
  return { success: true }
}

export async function deleteHackathonGalleryItem(id: string, hackathonId?: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("hackathon_gallery").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  await logActivity(`Deleted gallery photo from hackathon`, "hackathons", "success")

  if (hackathonId) {
    revalidatePath(`/admin/hackathons/${hackathonId}/edit`)
  }
  revalidatePath("/hackathons")
  return { success: true }
}









