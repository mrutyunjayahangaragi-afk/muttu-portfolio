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
