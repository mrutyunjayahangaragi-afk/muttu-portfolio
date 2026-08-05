/**
 * app/admin/(auth)/layout.tsx
 *
 * Layout for the /admin login page only.
 * Route group "(auth)" means this renders at the /admin URL — no sidebar,
 * just a full-screen centered login form on a dark background.
 *
 * The root layout detects the /admin prefix and strips public chrome
 * (Navbar, Footer, SmoothScrollProvider) so this page is completely isolated.
 */
export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#020408] text-white antialiased">{children}</div>
}
