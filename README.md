# Innlandet Arrangementer

A full-stack web application designed to connect local communities through event discovery and management. This platform allows users to find, share, and organize local gatherings in one unified interface.

## 📌 Table of contents

<!-- markdownlint-disable MD051 -->
- [Features](#-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Authentication & authorization](#authentication--authorization)
- [Database schema](#database-schema)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Storage (Supabase)](#storage-supabase)
- [Deployment](#deployment)
- [Acknowledgments](#acknowledgments)
- [License](#license)
- [Authors](#authors)
<!-- markdownlint-enable MD051 -->

## 🚀 Features

### Event discovery

- **Browse events**
  - Upcoming events overview
  - Event detail pages with key information (date, location, category, description, image)
- **Search & filtering**
  - Search events by title
  - Filter events by category

### Favorites

- **Save favorites**
  - Favorite / unfavorite events
  - Personal favorites overview

### Organizer dashboard

- **Event management**
  - Create events
  - Edit events
  - Delete events
- **Images**
  - Add an image to an event (upload or URL)

### Admin dashboard

- **User & role management**
  - View users
  - Update user roles (user / organizer / admin)
- **Event moderation**
  - View all events
  - Edit or remove events when needed

### Authentication & authorization (overview)

- Email/password authentication with Supabase Auth
- Role-based access control (user, organizer, admin)
- Protected organizer and admin routes
- Database enforcement with Row Level Security

## 🛠 Tech stack

### Frontend

- **Framework**: Next.js v16.2.1
  - App Router (Server Components + Server Actions)
  - Middleware for session refresh
- **UI & styling**
  - Tailwind CSS:  utility-first styling and consistent spacing/layout
  - shadcn/ui (Component library)
  - Responsive design with mobile-first approach

- **Forms & validation**
  - React Hook Form + Zod: structured form handling with validation for event create/edit
- **Dates**
  - date-fns

### Backend

- **Database & authentication**
  - Supabase Auth: email/password authentication and sessions
  - PostgreSQL: data storage for profiles, events and favorites
  - Row Level Security (RLS): database-enforced authorization
  - Supabase Storage: stores event images and saves the public URL on the event

### Development tools

- **Language**: TypeScript 5
- **Package manager**: pnpm
- **Code quality**
  - Biome for linting and formatting
  - TypeScript for type safety
- **Build tools**
  - Tailwind for styling

## 🧩 Project structure

```text
src/
├── app/                              # Routes (Next.js App Router)
│   ├── page.tsx                      # Public event listing (search/filter)
│   ├── arrangementer/
│   │   └── [id]/page.tsx             # Public event detail page
│   ├── favoritter/                   # Favorites page (+ actions)
│   ├── login/                        # Login page
│   ├── signup/                       # Signup page
│   ├── logout/                       # Logout server action
│   ├── arrangor/                     # Organizer-protected routes (dashboard)
│   └── admin/                        # Admin-protected routes (users/events)
├── components/
│   ├── events/                       # Event UI + reusable forms
│   ├── nav/                          # Header/navigation
│   └── ui/                           # Base UI components (shadcn/ui)
├── lib/
│   ├── supabase/                     # Supabase client helpers (server/client/middleware)
│   ├── date.ts                       # Date formatting helpers
│   └── event-form.ts                 # Zod schema for event forms
└── middleware.ts                     # Supabase session refresh middleware
```

## 🚀 Getting started

### Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended) or npm
- Git
- A Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd test-apprentice-test
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   Create `.env.local` in the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000`.

### Available scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Start the production server



## 🔐 Authentication & authorization

- Authentication uses Supabase email/password.
- Application roles are stored in `public.profiles.role`.
- Protected routes are enforced in two layers:
  -  **Route protection in Next.js layouts** (server-side): `/arrangor/*` and `/admin/*`
  -  **Database protection with RLS**: policies restrict inserts/updates/deletes by `auth.uid()` and role

Roles:

- **guest**: browse events
- **user**: favorites
- **organizer**: CRUD on own events
- **admin**: role management + moderate events

## 📊 Database schema

Tables:

- `profiles`
  - `id` (uuid, references `auth.users`)
  - `full_name` (text)
  - `email` (text)
  - `role` (enum: `admin | organizer | user`)
- `events`
  - `id` (uuid)
  - `title` (text)
  - `description` (text)
  - `date` (timestamptz)
  - `location` (text)
  - `category` (text)
  - `image_url` (text)
  - `organizer_id` (uuid -> `profiles.id`)
- `favorites`
  - `user_id` (uuid -> `profiles.id`)
  - `event_id` (uuid -> `events.id`)
  - unique `(user_id, event_id)`

Triggers:

- `handle_new_user`: automatically creates a `profiles` row when a new `auth.users` row is created.

## 🛡️ Row Level Security (RLS)

RLS is enabled and policies ensure:

- Public read access to events
- Users can only read/insert/delete their own favorites
- Organizers can only create/edit/delete events they own
- Admin can override for moderation tasks

## 🖼️ Storage (Supabase)

Bucket:

- `event-images` (public)

Upload flow:

- Images are uploaded via server actions.
- The public URL is stored in `events.image_url`.
- The UI requires choosing either upload or URL (mutually exclusive).

## 🚀 Deployment

The application can be deployed to various platforms:

1. **Build the Application**

   ```bash
   pnpm build
   ```

2. **Deploy Options**
   - Vercel
   - Netlify
   - Self-hosted server
   - Docker container

## 🙏 Acknowledgments

- Supabase for authentication, database, and storage
- shadcn/ui for accessible UI components
- Nicklas Båkind-Øverjordet for asking questions that helped me reflect on my technical choices
- Martin Myhre for asking clarifying questions and challenging my decisions in a constructive way

## 📝 License

This project is private and proprietary. All rights reserved.

## 👤 Authors

- Kristian Haugsrud
