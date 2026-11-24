# Libra — Frontend (React + Tailwind)

The UI talks to the Express API in `../server`. It no longer uses localStorage as a data source.

## Run the full stack

Terminal 1 — backend:

```bash
cd C:\Users\USER\Desktop\library-app\server
npm install
npm run dev
```

Terminal 2 — frontend:

```bash
cd C:\Users\USER\Desktop\library-app\client
npm install
npm run dev
```

Frontend: `http://localhost:5173` · API: `http://localhost:5000/api/health`

## App flow

```
Landing page (public)  →  Log in / Sign up  →  Dashboard  →  Catalog / My Loans / Admin
```

- `/` — public landing page with an animated floating 3D book stack and a professional footer
- 3D throughout: floating book stacks with floor planes on the landing, login and dashboard pages, a 5-book shelf in the catalog and dashboard, extruded cards, cursor-follow tilt and scroll-reveal motion
- `/login`, `/register` — auth pages; successful auth always goes to `/dashboard`
- `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/disclaimer` — full legal documents linked from the footer
- `/catalog`, `/books/:id`, `/my-loans`, `/admin` — require login; `/admin` requires the admin role

## Registration rules

- Choose **Student** or **Staff / Admin** on the sign-up form.
- Staff signup requires a **staff ID card**. The backend rejects admin registration without one, so a student account can never become an admin.
- Sessions use a JWT in `localStorage` (`libra_token`) plus a cached user (`libra_user`).

## Demo accounts (password `1234`)

| Role | Email |
|------|-------|
| Student | `student@library.test` |
| Admin | `admin@library.test` |

## API layer

`src/api.js` contains every network call. It keeps the same function names and return shapes as the old mock layer, so page components were not changed when the backend was connected.

If the API is unreachable, calls fail with a clear message instead of silently using stale data.

## Theme

Light and dark themes are available from the toggle in the navbar and footer. The choice is saved in `localStorage`; on first visit the system colour preference is used.
