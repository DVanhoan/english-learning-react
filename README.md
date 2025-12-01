# English Learning (React)

A modern English learning web app built with React + TypeScript, Vite, and Tailwind CSS. It includes courses, chapters, lessons, posts, flashcards, dictation, user authentication (email/password and Google OAuth), pagination, on‑demand loading, and a clean UI.

## Tech Stack

- React 19 + TypeScript + Vite 7
- React Router v7 (`react-router-dom`)
- TanStack React Query v5 (data fetching & caching)
- Tailwind CSS v4, Shadcn UI (UI primitives), Lucide Icons
- React Hook Form + Zod (forms & validation)
- Axios (HTTP) with refresh‑token flow, React‑Toastify for notifications
- Tiptap editor, DnD Kit, Embla Carousel, NProgress

## Features

- Sign up / Sign in, Google OAuth, automatic token refresh, secure sign out
- Manage courses, chapters, lessons; posts/categories; flashcards; dictation
- Dynamic pagination, lazy loading, global loading indicator, toast messages
- Route protection (public/private/admin) with auth guards

## Requirements

- Node.js >= 18.18 (LTS recommended)
- npm v9+ or pnpm/yarn (examples below use npm)

## Setup & Run

1. Install dependencies

```bash
npm install
```

2. Environment variables

- Create a `.env` file at the project root based on `.env.example`:

```bash
cp .env.example .env
```

- Fill in the variable below:
  - `VITE_GOOGLE_CLIENT_ID`: Google OAuth Client ID (used in `src/App.tsx` via `GoogleOAuthProvider`).

3. Start development server

```bash
npm run dev
```

- The app runs at http://localhost:3000 by default (see `vite.config.ts`).

4. Build & Preview

```bash
npm run build
npm run preview
```

## Backend API Configuration

- API base URL is currently set in `src/api/http.ts`:
  - `baseURL: "http://localhost:8080/e-learning"`
  - All endpoints are prefixed with `/api/v1` (see `src/api/path.ts`).
- For multiple environments, either adjust this `baseURL` directly or refactor to read from env variables for more flexible deployments.

## Project Structure (short)

```
src/
  api/           # axios instance, paths, api modules
  components/    # UI components (Header, Footer, CourseItem, Editor, ...)
  context/       # AuthContext, AppContext
  hooks/         # custom hooks (use-mobile, use-pagination, ...)
  layouts/       # MainLayout, AdminLayout
  pages/         # feature pages (Courses, Posts, Lesson, Admin, ...)
  routes/        # routing & guards
  types/         # type definitions (auth, course, post, ...)
  utils/         # utilities (token, appUtils, ...)
```

## Scripts

- `npm run dev`: Start development server (Vite)
- `npm run build`: Production build (`tsc -b` + `vite build`)
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Linting

- Uses ESLint 9 + TypeScript ESLint:

```bash
npm run lint
```

## Deployment Notes

- Enable CORS on the backend to allow calls from the frontend domain (default http://localhost:3000).
- Google OAuth: ensure Authorized JavaScript origins and redirect URIs match your running domain(s).
