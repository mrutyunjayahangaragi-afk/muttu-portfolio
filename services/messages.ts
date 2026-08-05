import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type { ContactMessage } from "@/types"
import { unstable_cache } from "next/cache"

export interface MessageStats {
  total: number
  newCount: number
  unreadCount: number
  repliedCount: number
  archivedCount: number
  todayCount: number
  thisMonthCount: number
}

export interface MessageAnalytics {
  byMonth: { month: string; count: number }[]
  byProjectType: { type: string; count: number }[]
  topCountries: { country: string; count: number }[]
  responseRate: number
}

async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((msg) => ({
      ...msg,
      name: msg.full_name || msg.name || "Anonymous",
      read: msg.is_read ?? msg.read ?? false,
    })) as ContactMessage[]
  } catch (err) {
    return []
  }
}

export const getContactMessages = unstable_cache(
  async () => fetchContactMessages(),
  ["contact-messages-data"],
  { revalidate: 60, tags: ["messages"] }
)

export async function getMessageStats(): Promise<MessageStats> {
  const messages = await getContactMessages()
  const now = new Date()
  const todayStr = now.toISOString().split("T")[0]
  const monthStr = now.toISOString().slice(0, 7)

  const total = messages.length
  const newCount = messages.filter((m) => m.status === "new" || (!m.is_read && !m.read)).length
  const unreadCount = messages.filter((m) => !m.is_read && !m.read).length
  const repliedCount = messages.filter((m) => m.replied || m.status === "replied").length
  const archivedCount = messages.filter((m) => m.archived || m.status === "archived").length

  const todayCount = messages.filter((m) => m.created_at?.startsWith(todayStr)).length
  const thisMonthCount = messages.filter((m) => m.created_at?.startsWith(monthStr)).length

  return {
    total,
    newCount,
    unreadCount,
    repliedCount,
    archivedCount,
    todayCount,
    thisMonthCount,
  }
}

export async function getMessageAnalytics(): Promise<MessageAnalytics> {
  const messages = await getContactMessages()

  // Project type distribution
  const typeMap: Record<string, number> = {}
  messages.forEach((m) => {
    const pType = m.project_type || "General Inquiry"
    typeMap[pType] = (typeMap[pType] || 0) + 1
  })
  const byProjectType = Object.entries(typeMap).map(([type, count]) => ({ type, count }))

  // Top countries
  const countryMap: Record<string, number> = {}
  messages.forEach((m) => {
    if (m.country) {
      countryMap[m.country] = (countryMap[m.country] || 0) + 1
    }
  })
  const topCountries = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Monthly trends (last 6 months)
  const monthMap: Record<string, number> = {}
  messages.forEach((m) => {
    const mStr = m.created_at ? new Date(m.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" }) : "Unknown"
    monthMap[mStr] = (monthMap[mStr] || 0) + 1
  })
  const byMonth = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

  const replied = messages.filter((m) => m.replied || m.status === "replied").length
  const responseRate = messages.length > 0 ? Math.round((replied / messages.length) * 100) : 100

  return {
    byMonth,
    byProjectType,
    topCountries,
    responseRate,
  }
}
