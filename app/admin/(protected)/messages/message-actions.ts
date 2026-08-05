"use server"

import { revalidatePath } from "next/cache"
import { requireAdminForAction } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

export async function updateMessageStatusAction(
  id: string,
  updates: { is_read?: boolean; status?: string; replied?: boolean; archived?: boolean }
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  }
  if (typeof updates.is_read !== "undefined") {
    payload.read = updates.is_read
  }

  let { error } = await supabase
    .from("contact_messages")
    .update(payload)
    .eq("id", id)

  if (error && error.message.includes('column "status" does not exist')) {
    const fallbackPayload: Record<string, unknown> = {}
    if (typeof updates.is_read !== "undefined") fallbackPayload.read = updates.is_read
    if (typeof updates.replied !== "undefined") fallbackPayload.replied = updates.replied
    const fallback = await supabase
      .from("contact_messages")
      .update(fallbackPayload)
      .eq("id", id)
    error = fallback.error
  }

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/messages")
  return { success: true }
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/messages")
  return { success: true }
}

export async function bulkMessageAction(
  ids: string[],
  actionType: "read" | "unread" | "archive" | "delete"
): Promise<ActionResult> {
  await requireAdminForAction()
  const supabase = await createClient()

  if (ids.length === 0) return { success: true }

  if (actionType === "delete") {
    const { error } = await supabase.from("contact_messages").delete().in("id", ids)
    if (error) return { success: false, error: error.message }
  } else {
    let updates = {}
    if (actionType === "read") updates = { is_read: true, read: true, status: "read" }
    if (actionType === "unread") updates = { is_read: false, read: false, status: "new" }
    if (actionType === "archive") updates = { archived: true, status: "archived" }

    let { error } = await supabase
      .from("contact_messages")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .in("id", ids)

    if (error && error.message.includes('column "status" does not exist')) {
      let fallbackUpdates = {}
      if (actionType === "read") fallbackUpdates = { read: true }
      if (actionType === "unread") fallbackUpdates = { read: false }
      const fallback = await supabase
        .from("contact_messages")
        .update(fallbackUpdates)
        .in("id", ids)
      error = fallback.error
    }

    if (error) return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/messages")
  return { success: true }
}
