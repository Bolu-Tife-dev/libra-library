# Libra — live deployment

## Links

| Service | URL |
|---------|-----|
| Website | https://libra-library-bolu.vercel.app |
| API | https://libra-library-api.vercel.app/api/health |
| GitHub | https://github.com/Bolu-Tife-dev/libra-library |

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `student@library.test` | `1234` |
| Admin | `admin@library.test` | `1234` |

## How it is hosted

- **Frontend:** Vite + React, deployed from the `client` directory as a static Vercel project (`libra-library-bolu`).
- **Backend:** Express, deployed from the `server` directory as a Vercel Node function at `api/index.js`. `server/vercel.json` rewrites `/api/(.*)` to that function so all Express routes work.
- Both Vercel projects have their root directory set explicitly (`client` and `server`) so GitHub pushes build the right folder.
- **Database:** Supabase PostgreSQL. The API connects with the transaction pooler connection string stored as a Vercel environment variable.
- **Authentication:** JWT in localStorage. The frontend sends `Authorization: Bearer <token>` to the API.

## Vercel environment variables

Frontend project (`libra-library-bolu`):

| Name | Value |
|------|-------|
| `VITE_API_BASE` | `https://libra-library-api.vercel.app/api` |

API project (`libra-library-api`):

| Name | Value |
|------|-------|
| `DATABASE_URL` | Supabase transaction pooler connection string (secret) |
| `JWT_SECRET` | Random signing secret (secret) |
| `CORS_ORIGIN` | `https://libra-library-bolu.vercel.app` |

Secrets are stored in Vercel and in the local `server/.env` (gitignored). They are never committed to GitHub.

## Local development

```bash
# API
cd server && npm install && npm run dev     # http://localhost:5000

# Frontend (uses localhost API when VITE_API_BASE is unset)
cd client && npm install && npm run dev     # http://localhost:5173
```

## Redeploy

Pushing to `main` triggers a Vercel deployment through the GitHub integration. Manual CLI deploys are also available if you need to redeploy immediately. To deploy manually:

```bash
cd server && vercel --prod
cd ../client && vercel --prod
```
