## Bugema University E-Book Library

Full-stack Next.js (App Router) platform for managing digital course material. Students read page-by-page scans stored in `/public/books`, while admins manage uploads, users, and categories. Built with TypeScript, TailwindCSS + Shadcn UI, MongoDB/Mongoose, and JWT authentication (access + refresh tokens).

### Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Visit <http://localhost:3000>. Create a student account, then promote yourself to admin via MongoDB or by updating the first user document.

### Environment variables

| Name | Purpose |
| --- | --- |
| `MONGODB_URI` | Mongo connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing tokens |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token TTLs |
| `NEXT_PUBLIC_APP_URL` | Base URL used by server utilities |

### Architecture overview

- **App Router** pages (`/app`) handle marketing site, authentication screens, dashboards, and the reader.
- **API Routes** (`/app/api`) expose auth, books, categories, users, and reading-progress endpoints with role checks.
- **Models** (`/models`) contain `User`, `Book`, `ReadingProgress` schemas.
- **Services** encapsulate domain logic (books, progress, analytics, users) for both server components and API routes.
- **Lib** utilities cover database connections, JWT helpers, role guards, validators, and Tailwind helpers.
- **Middleware helpers** (`/middleware/auth.ts`) ensure consistent API authorization.
- **Components** house Shadcn UI wrappers plus feature widgets (Header, Footer, BookCard, ReaderToolbar, dashboards).
- **Hooks** (`useAuth`, `useBooks`, `useReader`, `useDashboard`) provide client-side data fetching with React Query.

### Book storage

1. Create a folder under `public/books/<your-book-folder>/`.
2. Drop sequential page images (`1.jpg`, `2.jpg`, `3.jpg`, …). These paths become the `pages` array for each book record.
3. Use the Admin dashboard → “Add Book” form to register metadata (title, description, category, etc.). The reader loads images directly from `/public/books`.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Create a production build |
| `npm run start` | Run the built app |
| `npm run lint` | Run ESLint (Next.js rules) |
| `npm run typecheck` | Validate TypeScript types |

### Testing the flows

- **Registration/Login** – `POST /api/auth/register` (`/register` UI) creates a student. Login sets httpOnly access + refresh cookies.
- **Dashboards** – `/dashboard` surfaces in-progress & completed books; `/admin` exposes uploads, user table, quick stats. Both require a valid JWT cookie.
- **Reader** – `/books/:bookId` renders pages with next/previous controls and saves progress via `/api/books/:id/progress`.
- **Full-text search** – `/api/books?search=Algorithms` leverages a Mongo text index on titles, categories, and descriptions.

### Notes

- Shadcn UI primitives live under `components/ui`. Extend them as needed.
- Dark mode is powered by `next-themes`; `ThemeToggle` sits in the header.
- Replace placeholder hero copy and imagery as you customize the portal.
- Remember to seed your database with at least one admin user or promote manually via MongoDB.
