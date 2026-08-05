/**
 * lib/hero-config.ts
 *
 * Static UI configuration for the Hero section.
 * This file contains ONLY non-personal, layout-related config.
 *
 * ALL personal data (name, bio, social links, stats, resume URL, roles)
 * is fetched from Supabase via the about_profile table and managed
 * exclusively through the Owner-Only Admin Dashboard at /admin/about.
 *
 * Do NOT add any hardcoded personal values here.
 */

// Social link platform definitions — only icons/labels, no URLs.
// URLs come from the database (about_profile.github_url etc.)
export const SOCIAL_PLATFORMS = [
  { id: "github",    label: "GitHub",      color: "hover:text-white" },
  { id: "linkedin",  label: "LinkedIn",    color: "hover:text-blue-400" },
  { id: "twitter",   label: "Twitter / X", color: "hover:text-sky-400" },
  { id: "email",     label: "Email",       color: "hover:text-red-400" },
  { id: "instagram", label: "Instagram",   color: "hover:text-pink-400" },
] as const
