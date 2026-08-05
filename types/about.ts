// ─── About Section Types ─────────────────────────────────────────────────────

export interface AboutProfile {
  id: string
  name: string
  tagline: string
  bio: string
  avatar_url: string | null
  availability_status: "available" | "busy" | "not_available"
  availability_text: string
  location: string
  degree: string
  university: string
  languages: string[]
  interests: string[]
  career_goal: string
  resume_url: string | null
  github_url: string | null
  linkedin_url: string | null
  updated_at: string
}

export interface AboutStat {
  id: string
  label: string
  value: string
  icon: string
  color: string
  order: number
}

export interface JourneyMilestone {
  id: string
  title: string
  description: string
  year: string
  icon: string
  color: string
  order: number
}

export interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
}

export interface FunFact {
  id: string
  label: string
  value: string
  icon: string
  order: number
}

// ─── Static / config types (not stored in DB) ─────────────────────────────────

export interface PersonalInfoCard {
  icon: string
  label: string
  value: string
}

export interface SkillPreviewGroup {
  category: string
  color: string
  items: string[]
}
