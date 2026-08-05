// ─── Hero Section Types ───────────────────────────────────────────────────────

export interface HeroProfile {
  id: string
  greeting: string
  name: string
  roles: string[]
  tagline: string
  availability_text: string
  resume_url: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  email: string | null
  instagram_url: string | null
  updated_at: string
}

export interface HeroStat {
  id: string
  label: string
  value: string
  icon: string
  color: string
  order: number
}

export interface Hero3DConfig {
  id: string
  show_laptop: boolean
  show_ai_globe: boolean
  show_project_cards: boolean
  show_certificate_card: boolean
  show_hackathon_badge: boolean
  show_trophy: boolean
  show_github_cube: boolean
  show_tech_icons: boolean
  show_particles: boolean
  custom_glb_url: string | null
  hdr_environment_url: string | null
  environment_preset: "night" | "city" | "sunset" | "dawn" | "studio"
  background_color: string
  ambient_light_intensity: number
  directional_light_color: string
  directional_light_intensity: number
  point_light_color: string
  point_light_intensity: number
  spot_light_color: string
  camera_position_x: number
  camera_position_y: number
  camera_position_z: number
  floating_speed: number
  mouse_sensitivity: number
  orbit_auto_rotate: boolean
  orbit_rotation_speed: number
  particle_count: number
  updated_at: string
}

export interface Hero3DContent {
  latestProjectTitle: string
  latestProjectImage: string | null
  latestProjectTech: string[]
  latestCertificateTitle: string
  latestCertificateIssuer: string
  latestHackathonTitle: string
  latestHackathonAward: string
  latestAchievementTitle: string
}
