import { createClient } from "@/lib/supabase/server"

export async function getPortfolioContext() {
  const supabase = await createClient()
  
  const [
    { data: about },
    { data: skills },
    { data: experience },
    { data: projects },
    { data: settings }
  ] = await Promise.all([
    supabase.from("about").select("*").limit(1).single(),
    supabase.from("skills").select("name, proficiency, category"),
    supabase.from("experience").select("company, role, start_date, end_date, current, description"),
    supabase.from("projects").select("title, description, tech_stack"),
    supabase.from("settings").select("site_name, contact_email, contact_location").limit(1).single(),
  ])

  return `
Context about the portfolio owner:
Name: ${settings?.site_name || "Portfolio Owner"}
About: ${about?.short_description || "Software Engineer"}
Location: ${settings?.contact_location || "Unknown"}
Email: ${settings?.contact_email || "Unknown"}

Skills:
${skills?.map(s => `- ${s.name} (${s.category})`).join("\n") || "No skills listed"}

Experience:
${experience?.map(e => `- ${e.role} at ${e.company} (${e.start_date} to ${e.current ? "Present" : e.end_date})`).join("\n") || "No experience listed"}

Projects:
${projects?.map(p => `- ${p.title}: ${p.description}`).join("\n") || "No projects listed"}

Instructions:
You are an AI assistant on this portfolio website. 
Answer questions ONLY based on the context above. 
If a user asks about something not in this context, politely inform them that the information is not available in the portfolio data. 
Do not invent or hallucinate answers.
Keep answers concise, professional, and friendly.
`
}
