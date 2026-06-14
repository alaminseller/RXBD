# RxBD — Digital Prescription Platform for Bangladesh

<p align="center">
  <img src="public/logo.svg" alt="RxBD Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Modern digital prescription platform built for Bangladesh doctors</strong><br/>
  Create, manage, and share professional prescriptions with DGDA medicine database integration
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Prisma-ORM-blueviolet?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/shadcn/ui-New_York-000000" alt="shadcn/ui" />
</p>

---

## Features

### Core Platform
- **Prescription Composer** — Drag-and-drop medication builder with DGDA medicine search, dosage presets, and clinical sections (vitals, complaints, diagnosis, investigations, advice, follow-up)
- **Patient Management** — Full CRUD with search, history timeline, allergies, chronic diseases, and consent tracking
- **PDF Generation** — Professional prescription PDFs with custom letterhead, brand colors, QR code verification, and digital signatures
- **Dashboard** — Analytics overview with prescription stats, recent activity, and quick actions

### Authentication & Security
- **Supabase Auth** — Email/password authentication with JWT sessions
- **Local Auth Fallback** — Works without Supabase using bcrypt password verification
- **RBAC System** — 4 roles (super_admin, admin, manager, user) with 20 granular permissions
- **Row Level Security** — 20 RLS policies protecting all database tables
- **Audit Logging** — Complete audit trail on all RBAC changes

### Doctor Experience
- **Onboarding Walkthrough** — Branded 3-step onboarding (profile, branding, tutorial)
- **Settings** — Letterhead customization, brand colors, signature upload, language preferences
- **Medicine Templates** — Pre-built prescription templates for common conditions
- **Auto-Save** — Draft prescriptions saved automatically every 10 seconds

### Data & Localization
- **DGDA Medicine Database** — 8,000+ Bangladesh-approved medicines with generics, brands, dosages
- **Bilingual UI** — Full English and Bengali (বাংলা) support
- **Subscription System** — Free (50 prescriptions/month) and Premium tiers

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Database** | Prisma ORM (SQLite dev / PostgreSQL prod) |
| **Auth** | Supabase Auth + bcrypt fallback |
| **State** | Zustand (client) + TanStack Query (server) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **PDF** | @react-pdf/renderer |
| **QR Codes** | qrcode.react |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main SPA entry (auth → dashboard)
│   ├── layout.tsx                  # Root layout with providers
│   ├── api/
│   │   ├── auth/                   # Login, signup, logout, profile, me
│   │   ├── patients/              # Patient CRUD
│   │   ├── prescriptions/         # Prescription CRUD
│   │   ├── export/                # JSON export
│   │   ├── subscription/          # Subscription management
│   │   └── verify/                # Prescription verification
│   └── verify/[id]/               # Public verification page
├── components/
│   ├── auth/                      # Login & register forms
│   ├── composer/                  # Prescription composer + sub-components
│   ├── dashboard/                 # Dashboard home
│   ├── layout/                    # App shell, sidebar, navigation
│   ├── onboarding/               # Walkthrough steps
│   ├── patients/                 # Patient list, form, history
│   ├── pdf/                      # Prescription PDF template
│   ├── prescriptions/            # Prescription list, detail dialog
│   ├── settings/                 # Settings page, letterhead config
│   ├── subscription/             # Subscription plans
│   └── ui/                       # 30+ shadcn/ui components
├── store/                         # Zustand stores (auth, prescription, settings)
├── hooks/                         # Custom React hooks
├── lib/                           # Utilities (db, i18n, auth, medicine, PDF)
├── types/                         # TypeScript type definitions
└── utils/supabase/               # Supabase client/server/middleware

supabase/
├── migrations/                    # Database migration SQL files
│   ├── 001_rbac_system_setup.sql # Complete RBAC system (22KB)
│   └── 20260614000000_create_rxbd_schema.sql
└── rbac-migrations/              # Standalone RBAC migration

docs/
├── RBAC_README.md                # RBAC system documentation
└── RBAC_System_Documentation.docx # Full 12-chapter DOCX documentation

prisma/
└── schema.prisma                 # Database schema (7 models)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Supabase** account (optional — app works with local auth)

### 1. Clone & Install

```bash
git clone https://github.com/alaminseller/RXBD.git
cd RXBD
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# SQLite for local development
DATABASE_URL=file:./db/custom.db

# Supabase (optional — leave empty for local-only auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Set Up Database

```bash
# Push Prisma schema to SQLite
bun run db:push

# Generate Prisma client
bun run db:generate
```

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## RBAC System

The project includes a production-ready Role-Based Access Control system built on Supabase PostgreSQL.

### Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **super_admin** | 20 (all) | Full system access, can manage all roles |
| **admin** | 18 | Can manage users and content, cannot manage admin roles |
| **manager** | 10 | Can manage assigned resources |
| **user** | 5 | Basic read access |

### RBAC Features

- **20 RLS Policies** — Row Level Security on all tables
- **JWT Custom Claims Sync** — Roles auto-synced to `app_metadata` via triggers
- **Auto Role Assignment** — New users automatically get `user` role on signup
- **Privilege Escalation Prevention** — Admins cannot assign super_admin or admin roles
- **Audit Logging** — Complete change history on all RBAC table mutations
- **SECURITY DEFINER Functions** — `is_super_admin()`, `has_permission()`, `get_current_user_roles()`, etc.

### Deploy RBAC to Supabase

```bash
# Run the migration SQL in Supabase SQL Editor
# File: supabase/migrations/001_rbac_system_setup.sql
```

See [docs/RBAC_README.md](docs/RBAC_README.md) for complete documentation.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/signup` | Register new doctor |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Get current user |
| `PATCH` | `/api/auth/profile` | Update profile |
| `GET` | `/api/patients` | List patients |
| `POST` | `/api/patients` | Create patient |
| `GET` | `/api/patients/[id]` | Get patient |
| `PATCH` | `/api/patients/[id]` | Update patient |
| `DELETE` | `/api/patients/[id]` | Delete patient |
| `GET` | `/api/prescriptions` | List prescriptions |
| `POST` | `/api/prescriptions` | Create prescription |
| `GET` | `/api/prescriptions/[id]` | Get prescription |
| `PATCH` | `/api/prescriptions/[id]` | Update prescription |
| `GET` | `/api/subscription` | Get subscription |
| `GET` | `/api/export/json` | Export data as JSON |
| `GET` | `/api/verify/[id]` | Verify prescription (public) |

---

## Database Schema

```
Doctor ──┬── DoctorSettings (1:1)
          ├── Patient (1:N) ──── Prescription (1:N)
          ├── Subscription (1:1)
          └── AuditLog (1:N)
```

7 Prisma models with full type safety and auto-generated client.

---

## Deployment

### Vercel (Recommended)

```bash
# Set environment variables in Vercel dashboard
# DATABASE_URL = your PostgreSQL connection string
# NEXT_PUBLIC_SUPABASE_URL = your Supabase URL
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = your Supabase anon key

vercel deploy
```

### Docker

```bash
docker build -t rxbd .
docker run -p 3000:3000 --env-file .env rxbd
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Al Amin**  
- GitHub: [@alaminseller](https://github.com/alaminseller)
- Email: hello@alaminrafi.com

---

<p align="center">
  Built with ❤️ for Bangladesh Doctors • BMDC Registered
</p>
