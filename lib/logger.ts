import { createClient } from "@supabase/supabase-js"

// Simple browser-safe initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Avoid full client-side server dependency, just a lightweight fetch client for logging
const logClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

type LogMetadata = Record<string, any>

export const logger = {
  info: (message: string, metadata?: LogMetadata) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${message}`, metadata || "")
    }
  },

  warn: (message: string, metadata?: LogMetadata) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[WARN] ${message}`, metadata || "")
    }
  },

  error: async (message: string, error?: Error | unknown, route?: string, metadata?: LogMetadata) => {
    const errorObject = error instanceof Error ? error : new Error(String(error))
    
    // Log to console in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR] ${message}`, errorObject, metadata || "")
    }

    // In production, attempt to log directly to the Supabase database
    if (logClient) {
      try {
        await logClient.from("error_logs").insert({
          message: `${message}: ${errorObject.message}`,
          stack: errorObject.stack || null,
          route: route || (typeof window !== "undefined" ? window.location.pathname : "server"),
          additional_metadata: metadata || null,
        })
      } catch (dbError) {
        // Fallback console logging in case database logging fails
        console.error("Logger failed to write to database:", dbError)
      }
    }
  }
}
export default logger
