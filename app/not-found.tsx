import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <p className="gradient-text text-8xl font-bold">404</p>
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="text-white/50">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
