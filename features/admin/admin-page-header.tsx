import { cn } from "@/lib/utils"

interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode // action buttons slot
  className?: string
}

/**
 * Reusable page header for all admin sections.
 * Accepts an optional `children` slot for action buttons (e.g. "New Project").
 */
export function AdminPageHeader({ title, description, children, className }: AdminPageHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
    </div>
  )
}
