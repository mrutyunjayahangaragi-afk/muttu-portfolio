"use server"

import { createClient } from "@/lib/supabase/server"

export async function trackPageViewAction(path: string): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from("analytics_events").insert({
      event_type: "page_view",
      path: path || "/",
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    // Ignore analytics insertion errors silently
  }
}
