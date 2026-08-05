/**
 * lib/supabase/middleware.ts
 *
 * Core proxy logic — called by proxy.ts on every matched request.
 *
 * Responsibilities:
 *  1. Refresh Supabase auth session token via getUser()
 *  2. Attach x-pathname and x-invoke-path to request.headers so Server Components (headers() in RootLayout)
 *     detect /admin routes and suppress public chrome (Navbar, Footer, Lenis scroll lock, AiChat, CustomCursor)
 *  3. Block legacy auth routes (/login, /register)
 *  4. Protect /admin/* sub-routes (verifies session & ADMIN_EMAIL match)
 */
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Forward pathname to Server Components via request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)
  requestHeaders.set("x-invoke-path", pathname)

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: always call getUser() — refreshes session cookie
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Set response header as well
  supabaseResponse.headers.set("x-pathname", pathname)

  // Block legacy public auth routes
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // /admin itself (login page) — let through
  if (pathname === "/admin") {
    return supabaseResponse
  }

  // Protect all /admin/* sub-routes
  if (pathname.startsWith("/admin/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const userEmail = user.email?.toLowerCase().trim()
    const targetAdminEmail = adminEmail?.toLowerCase().trim()

    if (!targetAdminEmail || userEmail !== targetAdminEmail) {
      return NextResponse.redirect(new URL("/admin?unauthorized=1", request.url))
    }
  }

  return supabaseResponse
}
