"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, ExternalLink, User, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSigningOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    startTransition(() => {
      router.push("/admin")
      router.refresh()
    })
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black/20 px-6 backdrop-blur-sm">
      {/* Left — current page breadcrumb handled by children */}
      <div />

      {/* Right — user info + actions */}
      <div className="flex items-center gap-4">
        {/* View live site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/50 transition-colors duration-150 hover:text-white"
          aria-label="View live portfolio"
        >
          <ExternalLink size={13} />
          Live Site
        </a>

        {/* Admin user pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <User size={11} className="text-white" />
          </div>
          <span className="hidden max-w-[140px] truncate text-xs text-white/70 sm:block">
            {email}
          </span>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut || isPending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/50 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sign out"
        >
          {isSigningOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
