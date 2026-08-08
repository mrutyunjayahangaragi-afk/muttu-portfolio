"use server"

import { revalidatePath, updateTag } from "next/cache"
import { z } from "zod"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const Hero3DConfigSchema = z.object({
  // Booleans — use z.boolean() (not coerce) since form state sends actual JS booleans
  show_laptop: z.boolean(),
  show_ai_globe: z.boolean(),
  show_project_cards: z.boolean(),
  show_certificate_card: z.boolean(),
  show_hackathon_badge: z.boolean(),
  show_trophy: z.boolean(),
  show_github_cube: z.boolean(),
  show_tech_icons: z.boolean(),
  show_particles: z.boolean(),
  orbit_auto_rotate: z.boolean().default(true),
  custom_glb_url: z.string().optional().nullable(),
  hdr_environment_url: z.string().optional().nullable(),
  environment_preset: z.enum(["night", "city", "sunset", "dawn", "studio"]).default("night"),
  background_color: z.string().default("#020408"),
  ambient_light_intensity: z.coerce.number().min(0).max(5).default(0.4),
  directional_light_color: z.string().default("#ffffff"),
  directional_light_intensity: z.coerce.number().min(0).max(10).default(1.5),
  point_light_color: z.string().default("#a855f7"),
  point_light_intensity: z.coerce.number().min(0).max(10).default(1.0),
  spot_light_color: z.string().default("#60a5fa"),
  camera_position_x: z.coerce.number().default(0),
  camera_position_y: z.coerce.number().default(0),
  camera_position_z: z.coerce.number().default(9),
  floating_speed: z.coerce.number().min(0.1).max(5.0).default(1.0),
  mouse_sensitivity: z.coerce.number().min(0.1).max(5.0).default(1.0),
  orbit_rotation_speed: z.coerce.number().default(0.5),
  particle_count: z.coerce.number().int().min(50).max(2000).default(300),
})

export async function updateHero3DConfigAction(data: Record<string, unknown>): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const parsed = Hero3DConfigSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from("hero_3d_config")
    .upsert(
      {
        id: "00000000-0000-0000-0002-000000000001",
        ...parsed.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

  if (error) {
    return { success: false, error: error.message }
  }

  updateTag("hero")
  updateTag("hero_3d")
  revalidatePath("/")
  revalidatePath("/admin/hero-3d")
  return { success: true }
}
