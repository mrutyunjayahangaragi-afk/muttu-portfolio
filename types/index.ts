// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  short_description: string | null
  full_description: string | null
  long_description: string | null
  tech_stack: string[]
  tags: string[]
  github_url: string | null
  live_url: string | null
  live_demo_url: string | null
  documentation_url: string | null
  pdf_url: string | null
  image_url: string | null
  cover_image: string | null
  logo_url: string | null
  architecture_image: string | null
  images: string[]
  featured: boolean
  published: boolean
  status: "completed" | "in_progress" | "archived"
  category: string
  order: number
  display_order: number
  duration: string | null
  team_size: number
  version: string | null
  likes: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface ProjectGalleryImage {
  id: string
  project_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}

export interface ProjectVideo {
  id: string
  project_id: string
  video_url: string
  video_type: "mp4" | "youtube" | "vimeo"
  title: string | null
  created_at: string
}

export interface ProjectFeature {
  id: string
  project_id: string
  title: string
  description: string
  icon: string
  display_order: number
}

export interface ProjectTimeline {
  id: string
  project_id: string
  milestone: string
  description: string | null
  milestone_date: string | null
  display_order: number
}

export interface ProjectWithRelations extends Project {
  gallery: ProjectGalleryImage[]
  videos: ProjectVideo[]
  features: ProjectFeature[]
  timeline: ProjectTimeline[]
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  slug: string | null
  icon: string | null
  icon_url: string | null
  category: SkillCategory
  description: string | null
  proficiency: number // 0–100  (used as skill_percentage)
  skill_level: "beginner" | "intermediate" | "advanced" | "expert"
  years_of_experience: number
  featured: boolean
  display_order: number
  order: number
  learning_status: "learning" | "learned" | "mastered"
  created_at: string
  updated_at: string | null
}

export interface SkillCategory_DB {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string | null
  order: number
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "tools"
  | "languages"
  | "frameworks"
  | "ai_ml"
  | "cloud"
  | "other"

// ─── Experience ──────────────────────────────────────────────────────────────

export interface Experience {
  id: string
  company: string
  role: string
  description: string
  tech_stack: string[]
  responsibilities: string[]
  achievements: string[]
  skills_learned: string[]
  start_date: string
  end_date: string | null
  current: boolean
  company_logo: string | null
  company_url: string | null
  location: string | null
  employment_type: "full_time" | "part_time" | "internship" | "freelance" | "contract"
  type: "full_time" | "part_time" | "internship" | "freelance" | "contract"
  team_size: number | null
  order: number
  display_order: number
  created_at: string
}

// ─── Education ───────────────────────────────────────────────────────────────

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string
  branch: string | null
  university: string | null
  description: string | null
  gpa: string | null
  cgpa: string | null
  percentage: string | null
  subjects: string[]
  activities: string[]
  start_date: string
  end_date: string | null
  current: boolean
  institution_logo: string | null
  institution_url: string | null
  location: string | null
  order: number
  display_order: number
  created_at: string
}

// ─── Certificates ────────────────────────────────────────────────────────────

export interface Certificate {
  id: string
  slug: string | null
  title: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  image_url: string | null
  pdf_url: string | null
  category: string
  skills: string[]
  featured: boolean
  order: number
  display_order: number
  created_at: string
}

// ─── Hackathons ──────────────────────────────────────────────────────────────

export interface HackathonGalleryItem {
  id: string
  hackathon_id: string
  image_url: string
  image_title: string | null
  image_description: string | null
  category: string | null
  image_order: number
  display_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Hackathon {
  id: string
  slug: string | null
  name: string
  event_name: string | null
  organizer: string
  description: string
  theme: string | null
  team_name: string | null
  my_role: string | null
  problem_statement: string | null
  solution: string | null
  result: string | null
  position: string | null
  team_size: number | null
  tech_stack: string[]
  ai_models: string[]
  duration: string | null
  mentor_names: string[]
  prize: string | null
  ranking: string | null
  certificate_url: string | null
  github_url: string | null
  demo_url: string | null
  project_url: string | null
  image_url: string | null
  gallery: string[]
  gallery_items?: HackathonGalleryItem[]
  lessons_learned: string | null
  future_improvements: string | null
  date: string
  location: string | null
  mode: "online" | "offline" | "hybrid"
  featured: boolean
  order: number
  display_order: number
  created_at: string
}

// ─── Achievements ────────────────────────────────────────────────────────────

export type AchievementCategory =
  | "award"
  | "competition"
  | "scholarship"
  | "ranking"
  | "publication"
  | "open_source"
  | "leadership"
  | "other"

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  organization: string | null
  image_url: string | null
  award_date: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// ─── Leadership ──────────────────────────────────────────────────────────────

export interface Leadership {
  id: string
  title: string
  organization: string
  start_date: string | null
  end_date: string | null
  current: boolean
  description: string | null
  achievements: string[]
  logo_url: string | null
  display_order: number
  created_at: string
}

// ─── Volunteering ────────────────────────────────────────────────────────────

export interface Volunteering {
  id: string
  title: string
  organization: string
  start_date: string | null
  end_date: string | null
  current: boolean
  description: string | null
  impact: string | null
  logo_url: string | null
  display_order: number
  created_at: string
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  tags: string[]
  published: boolean
  featured: boolean
  read_time: number | null
  views: number
  likes: number
  author_id: string
  created_at: string
  updated_at: string
}

export type BlogPost = Blog

// ─── Media Gallery ─────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  url: string
  public_id: string | null
  filename: string
  file_type: string
  file_size: number
  caption: string | null
  created_at: string
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  replied: boolean
  created_at: string
}

// ─── Resume ──────────────────────────────────────────────────────────────────

export interface Resume {
  id: string
  title: string
  file_url: string
  version: string | null
  download_count: number
  published: boolean
  created_at: string
  updated_at: string
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface Settings {
  id: string
  site_name: string
  logo_text: string | null
  site_description: string | null
  seo_keywords: string[] | null
  logo_url: string | null
  favicon_url: string | null
  theme_color: string | null
  accent_color: string | null
  openrouter_api_key: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_location: string | null
  created_at: string
  updated_at: string
}

// ─── Media Library ────────────────────────────────────────────────────────────

export interface MediaLibrary {
  id: string
  title: string | null
  url: string
  type: "image" | "video"
  category: string | null
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

// ─── AI Conversation ──────────────────────────────────────────────────────────

export interface AiConversation {
  id: string
  session_id: string | null
  visitor_ip: string | null
  created_at: string
  updated_at: string
}

export interface AiMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  external?: boolean
}
