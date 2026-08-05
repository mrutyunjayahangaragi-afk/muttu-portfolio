import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MessagesClient } from "@/features/admin/messages-client"
import type { ContactMessage } from "@/types"

export const metadata: Metadata = {
  title: "Contact Messages | Admin Dashboard",
}

export default async function MessagesAdminPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  const messages: ContactMessage[] = data || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
        <p className="mt-2 text-white/50">View and manage messages sent from your portfolio contact form.</p>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  )
}
