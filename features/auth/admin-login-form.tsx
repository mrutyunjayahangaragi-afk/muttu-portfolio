"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, Shield, AlertCircle, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(254, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
})

type LoginValues = z.infer<typeof loginSchema>

// ─── Rate-limit helper (client-side attempt counter) ──────────────────────────
// This is a UX guard only — real rate limiting happens server-side in Supabase.

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

function useRateLimit() {
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil
  const remaining = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)) : 0

  function recordFailure() {
    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_MS)
    }
  }

  function reset() {
    setAttempts(0)
    setLockedUntil(null)
  }

  return { isLocked, remaining, recordFailure, reset, attempts }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminLoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { isLocked, remaining, recordFailure, reset } = useRateLimit()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const isLoading = isSubmitting || isPending

  async function onSubmit(values: LoginValues) {
    if (isLocked) return
    setError(null)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (authError) {
      // Use a generic message — never reveal whether the email exists
      recordFailure()
      setError("Invalid credentials. Please check your email and password.")
      return
    }

    // Successful auth — the proxy will enforce admin email check on /admin/dashboard
    reset()
    startTransition(() => {
      router.push("/admin/dashboard")
      router.refresh()
    })
  }

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass space-y-4 rounded-2xl p-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <Shield size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Access Temporarily Locked</h3>
        <p className="text-sm text-white/60">
          Too many failed attempts. Try again in{" "}
          <span className="font-mono text-white">
            {Math.ceil(remaining / 60)}m {remaining % 60}s
          </span>
          .
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="glass space-y-5 rounded-2xl p-8"
      noValidate
      aria-label="Admin login form"
    >
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="text-sm font-medium text-white/80">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <Input
            id="admin-email"
            type="email"
            placeholder="your@email.com"
            className="pl-9"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "admin-email-error" : undefined}
            {...register("email")}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              id="admin-email-error"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-xs text-red-400"
            >
              <AlertCircle size={12} />
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium text-white/80">
          Password
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-10 pl-9"
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "admin-password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
            suppressHydrationWarning
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              id="admin-password-error"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-xs text-red-400"
            >
              <AlertCircle size={12} />
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Server error */}
      <AnimatePresence>
        {error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Authenticating…
          </>
        ) : (
          <>
            <Shield size={16} />
            Access Admin Panel
          </>
        )}
      </Button>
    </motion.form>
  )
}
