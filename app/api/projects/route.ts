import { NextResponse } from "next/server"
import { getProjects } from "@/services/projects"
import { getAdminSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

/** GET /api/projects — public, returns all projects */
export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

/** POST /api/projects — admin only */
export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const supabase = await createClient()
    const { data, error } = await supabase.from("projects").insert(body).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
