"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  User,
  Compass,
  Zap,
  Box,
  FolderKanban,
  BookOpen,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  MessageSquare,
  FileText,
  ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Star,
  Users,
  Bell,
  Activity,
  Database,
  Paintbrush,
  Server,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin/dashboard",    label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/notifications",label: "Notifications",    icon: Bell },
  { href: "/admin/activity",     label: "Activity Logs",    icon: Activity },
  { href: "/admin/backups",      label: "Backup & Restore", icon: Database },
  { href: "/admin/theme",        label: "Theme & Branding", icon: Paintbrush },
  { href: "/admin/database",     label: "Database Monitor", icon: Server },
  { href: "/admin/hero",         label: "Hero Text & Stats",icon: Zap },
  { href: "/admin/hero-3d",      label: "Hero 3D Manager",  icon: Box },
  { href: "/admin/about",        label: "About Me",         icon: User },
  { href: "/admin/journey",      label: "Journey Timeline", icon: Compass },
  { href: "/admin/projects",     label: "Projects",         icon: FolderKanban },
  { href: "/admin/blog",         label: "Blog",             icon: BookOpen },
  { href: "/admin/skills",       label: "Skills",           icon: Wrench },
  { href: "/admin/experience",   label: "Experience",       icon: Briefcase },
  { href: "/admin/education",    label: "Education",        icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates",     icon: Award },
  { href: "/admin/hackathons",   label: "Hackathons",       icon: Trophy },
  { href: "/admin/achievements", label: "Achievements",     icon: Star },
  { href: "/admin/leadership",   label: "Leadership",       icon: Users },
  { href: "/admin/volunteering", label: "Volunteering",     icon: Users },
  { href: "/admin/messages",     label: "Messages",         icon: MessageSquare },
  { href: "/admin/resume",       label: "Resume",           icon: FileText },
  { href: "/admin/gallery",      label: "Gallery",          icon: ImageIcon },
  { href: "/admin/settings",     label: "Settings",         icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative h-screen flex-shrink-0 bg-black/40 backdrop-blur-xl
                 border-r border-white/10 flex flex-col overflow-hidden z-20"
      aria-label="Admin navigation"
      suppressHydrationWarning
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0" suppressHydrationWarning>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" suppressHydrationWarning>
        <ul className="space-y-0.5 px-2" role="list" suppressHydrationWarning>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              mounted && (pathname === href || pathname.startsWith(href + "/"))
            return (
              <li key={href} suppressHydrationWarning>
                <Link
                  href={href}
                  suppressHydrationWarning
                  className={cn(
                    "relative flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    "hover:bg-white/8 hover:text-white group",
                    isActive ? "bg-white/10 text-white" : "text-white/60"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? label : undefined}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-white/50 group-hover:text-white/80"
                    )}
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {mounted && isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-0.5 h-6 bg-blue-400 rounded-r-full"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/10 shrink-0">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl
                     text-white/40 hover:text-white hover:bg-white/8 transition-all text-xs"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Collapse
                </motion.span>
              </AnimatePresence>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
