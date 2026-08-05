# Developer Portfolio — Enterprise Production-Ready Web Application

A world-class, award-grade personal portfolio website built with modern frameworks, micro-animations, multi-layer security, responsive 3D WebGL scenes, and strict performance optimization standards.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure Documentation](#-folder-structure-documentation)
- [Environment Variable Documentation](#-environment-variable-documentation)
- [Installation Guide](#-installation-guide)
- [Database Setup & Migrations](#-database-setup--migrations)
- [Admin Guide](#-admin-guide)
- [Deployment Guide](#-deployment-guide)
- [Maintenance & Troubleshooting Guide](#-maintenance--troubleshooting-guide)
- [Performance & Security Architecture](#-performance--security-architecture)

---

## ✨ Features

- **Dynamic Content Architecture**: 100% database-driven portfolio (projects, experiences, skills, education, certificates, hackathons, blogs, contact messages, site settings). Zero hardcoded or sample data.
- **Owner Admin Panel (`/admin`)**: Secure, single-admin dashboard for full CRUD management across all portfolio entities, file uploads, media gallery, and AI settings.
- **Interactive 3D Graphics**: Three.js / React Three Fiber interactive hero canvas with adaptive performance scaling and non-WebGL canvas fallback.
- **WCAG 2.2 AA Accessibility**: Full keyboard navigation support, skip-to-content links, ARIA labels, focus trap drawer menus, and system reduced-motion support.
- **API Rate Limiting & Protection**: IP-based sliding window rate limiters on public contact forms and AI chat endpoints to prevent DoS and quota abuse.
- **Embedded AI Assistant**: Intelligent portfolio assistant powered by OpenRouter API with dynamic context streaming.
- **SEO & Meta Optimization**: Auto-generated dynamic sitemap (`sitemap.xml`), `robots.txt`, JSON-LD Person Schema, OpenGraph, and Twitter cards.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling & System**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Smooth Scroll**: [Lenis Scroll](https://lenis.darkroom.engineering/)
- **3D Engine**: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) with Row Level Security (RLS)
- **Media Optimization**: [Cloudinary](https://cloudinary.com/) (next-cloudinary)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Type Safety & Validation**: [TypeScript](https://www.typescriptlang.org/), [Zod](https://zod.dev/)

---

## 📦 Folder Structure Documentation

```text
portfolio/
├── app/                      # Next.js 16 App Router Pages & API Endpoints
│   ├── admin/                # Owner-Only Admin Dashboard
│   │   ├── (auth)/           # Admin authentication login route
│   │   └── (protected)/      # Protected administrative management screens
│   ├── api/                  # Secure API Routes
│   │   ├── admin/upload/     # Admin image/PDF/video upload to Cloudinary
│   │   ├── chat/             # OpenRouter AI assistant route (Rate-limited)
│   │   ├── contact/          # Public contact form submission (Rate-limited)
│   │   └── projects/         # Public project data endpoints
│   ├── blog/                 # Public Blog pages (/blog & /blog/[slug])
│   ├── projects/             # Public Project gallery & details pages
│   ├── globals.css           # Design tokens, custom keyframes, scrollbar styling
│   ├── layout.tsx            # Root layout (Metadata, Google Fonts, Providers)
│   ├── manifest.ts           # PWA Web Manifest
│   ├── page.tsx              # Single-page portfolio root container
│   ├── robots.ts             # SEO robots rules generator
│   └── sitemap.ts            # Dynamic sitemap index generator
├── components/               # UI Components
│   ├── 3d/                   # Three.js / R3F WebGL scenes & mobile fallbacks
│   ├── animations/           # Framer Motion reveal cards, text effects, stagger lists
│   ├── layout/               # Navbar, Footer, SmoothScroll, CustomCursor, Progress
│   ├── sections/             # Portfolio sections (Hero, About, Skills, Projects, etc.)
│   └── ui/                   # Primitive design components (Dialog, Input, Toast)
├── features/                 # Modular feature controllers (Auth, AI Chat, Project Modals)
├── hooks/                    # Reusable React Hooks (media queries, scroll spy, focus trap)
├── lib/                      # Core System Utilities
│   ├── auth.ts               # Server-only admin security gate (requireAdmin)
│   ├── database.sql          # Unified master PostgreSQL schema & RLS policies
│   ├── design-tokens.ts      # Colors, typography, spacing, animation easings
│   ├── logger.ts             # Production error & telemetry logger
│   ├── rate-limit.ts         # IP sliding window rate limiter
│   ├── supabase/             # Supabase client instances (browser, server, middleware)
│   └── utils.ts              # Tailwind class merger (cn) & formatting helpers
├── proxy.ts                  # Next.js 16 Proxy middleware (Session refresh & security)
├── services/                 # Server-side data fetching layer (Supabase queries)
├── store/                    # Zustand global client UI state
└── types/                    # Strict TypeScript interfaces & database definitions
```

---

## 🔑 Environment Variable Documentation

Create a `.env.local` file in your root workspace:

```env
# ─── NEXT.JS SITE CONFIG ───────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_ENV=production

# ─── SUPABASE CONFIGURATION ─────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-private-key

# ─── OWNER ADMIN ACCESS ─────────────────────────────────────────────────────
# Must match the email address of your registered Supabase Admin user
ADMIN_EMAIL=admin@example.com

# ─── CLOUDINARY MEDIA HOSTING ───────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# ─── AI ASSISTANT CONFIGURATION ──────────────────────────────────────────────
OPENROUTER_API_KEY=your-openrouter-api-key
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js 18.18.0 or higher
- npm 9.0.0 or higher
- Supabase account & database instance
- Cloudinary account

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.local` template and supply your active credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize Database**:
   Follow the [Database Setup](#-database-setup--migrations) instructions below.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 💾 Database Setup & Migrations

All data is fetched dynamically from PostgreSQL via Supabase.

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the master migration script located at:
   - [`lib/database.sql`](file:///c:/Users/mruty/OneDrive/Desktop/portfoilo/lib/database.sql)
3. This script will automatically set up:
   - 13 Relational Tables (`profiles`, `projects`, `skills`, `experience`, `education`, `certificates`, `hackathons`, `blogs`, `contact_messages`, `resumes`, `social_links`, `settings`, `media_library`, `ai_conversations`, `ai_messages`, `error_logs`).
   - Row-Level Security (RLS) policies allowing public read on published portfolio items and administrative-only access for CRUD operations.
   - Idempotent triggers for automated timestamp updates (`updated_at`).

---

## 🔒 Admin Guide

Administrative access is strictly restricted to the portfolio owner.

### Logging In
1. Navigate to `/admin` in your browser.
2. Enter your `ADMIN_EMAIL` and password.

### Admin Setup Instructions
1. Create a user inside **Supabase Auth Console** using your designated `ADMIN_EMAIL`.
2. Execute the following SQL query in Supabase to grant the user admin status:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Once updated, you can log in at `/admin` to access the management interface.

### Admin Dashboard Capabilities
- Manage projects, achievements, experiences, skills, education, and certificates.
- Upload media directly to Cloudinary via the embedded file manager.
- View and reply to visitor contact submissions.
- Configure global site metadata and AI assistant prompts.

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push your code to your GitHub repository.
2. Import the project into **Vercel**.
3. Add all environment variables listed in `.env.local` to the Vercel Environment Variables settings.
4. Deploy! Vercel automatically detects Next.js 16 Turbopack build settings.

### Deployment Checklist
- [x] All environment variables configured in Vercel project settings.
- [x] Master migration executed on production Supabase database.
- [x] Admin email verified in production Supabase auth profiles.
- [x] `NEXT_PUBLIC_SITE_URL` updated to production URL.

---

## 🛠️ Maintenance & Troubleshooting Guide

### Common Issues & Solutions

#### Issue: `EPERM` file lock during local `npm run build`
- **Cause**: An active `npm run dev` process is running in another terminal holding `.next` directory locks.
- **Solution**: Terminate dev server (`Ctrl + C`) before running `npm run build`.

#### Issue: 403 Forbidden when accessing `/admin` routes
- **Cause**: The authenticated user profile does not have `role = 'admin'` in Supabase database.
- **Solution**: Execute `UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email';` in Supabase SQL editor.

#### Issue: AI Assistant returns 500 error
- **Cause**: `OPENROUTER_API_KEY` is missing or invalid.
- **Solution**: Set valid `OPENROUTER_API_KEY` in site settings or `.env.local`.

---

## 🔒 Performance & Security Architecture

1. **Server-Side Authorization Gates**: Hard security checks enforced via `requireAdmin()` in Server Components and `requireAdminForAction()` in Server Actions.
2. **Rate Limiting**: Public endpoints protected by IP-based sliding window rate limiters (`lib/rate-limit.ts`).
3. **Optimized 3D Rendering**: Three.js Canvas bounded DPR (1.5 max), power-preference hints, and automatic WebGL fallback for mobile devices.
4. **Security Headers**: Standard CSP, HSTS (`max-age=31536000`), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), and Referrer-Policy configured in `next.config.ts`.
#   m u t t u - p o r t f o l i o  
 