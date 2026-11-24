# Libra API — Express backend (Phase 2)

A complete REST API for the library app. Runs standalone now with a local JSON store;
switch to Supabase/PostgreSQL in Phase 3 by setting one environment variable.

## Run it

```bash
cd C:\Users\USER\Desktop\library-app\server
npm install
npm run dev
```

The API runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## Configuration

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | API port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
| `JWT_SECRET` | dev placeholder | Token signing — **change in production** |
| `DATABASE_URL` | empty | Empty = JSON store; set = PostgreSQL/Supabase |

## Endpoints

All responses are JSON. Errors return `{ "message": "..." }` with the proper status code.
Protected routes need `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/health` | public | Server status |
| POST | `/api/auth/register` | public | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | public | Login, returns `{ token, user }` |
| GET | `/api/auth/me` | required | Current user |
| GET | `/api/books?search=&category=&availableOnly=true` | public | List/filter books |
| GET | `/api/books/categories` | public | Distinct categories |
| GET | `/api/books/:id` | public | One book |
| POST | `/api/books` | admin | Add book |
| PUT | `/api/books/:id` | admin | Edit book |
| DELETE | `/api/books/:id` | admin | Delete book |
| GET | `/api/borrows?memberId=&status=` | required | Loans (students see their own; admins see all) |
| POST | `/api/borrow` | required | Borrow `{ "bookId": 1 }` |
| POST | `/api/return` | required | Return `{ "borrowId": 1 }` |

### Registration rules

- `role` is `"student"` or `"admin"`; anything else becomes `"student"`.
- If `role` is `"admin"`, `idCard` must be supplied with a `name` (file metadata object). Otherwise the server returns **403**. A student therefore cannot self-upgrade to admin.
- Passwords are hashed with bcrypt; tokens are JWTs valid for 7 days.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `student@library.test` | `1234` |
| Admin | `admin@library.test` | `1234` |

## Business rules enforced here

- A loan lasts **14 days**.
- Borrowing is rejected when no copies are available.
- Returning sets `return_date`, restores one copy and calculates a **$1 per day** late fine.
- Only admins can change the catalog. Students cannot return someone else's book.

## Storage adapter

`server/db/index.js` picks the store from `DATABASE_URL`:

- **empty** → `db/memory.js`, persisted to `data/store.json` (works immediately, no setup)
- **set** → `db/postgres.js`, using `pg` with transactions and row locks

Both implement the same methods, so no route code changes between phases.

## Phase 3: switching to Supabase

1. Create a project at supabase.com.
2. In **SQL Editor**, run `db/schema.sql`. Optionally run `db/supabase-storage.sql` if you want a private bucket for ID cards.
3. In **Project Settings → Database → Connection string**, copy the **Transaction pooler** URL (port `6543`) and put it in `.env` as `DATABASE_URL`, including the password and `?sslmode=require`.
4. Verify with `npm run check-db` — it prints `Connected to PostgreSQL` with book and loan counts.
5. Restart `npm run dev`. The server detects `DATABASE_URL`, applies the schema if needed, seeds demo users and uses Supabase from then on.

Notes:
- The connection string is a **server secret** — never put it in the frontend or commit `.env`.
- The API uses the Postgres/service connection, so RLS is not needed; authorization lives in the API.
- `JWT_SECRET` in `.env` is already set to a random value; keep it stable or existing tokens will stop working.

## Connecting the React frontend later

`client/src/api.js` is the single file to change. Example:

```js
const BASE = 'http://localhost:5000/api'
const token = () => localStorage.getItem('libra_token')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function login({ email, password }) {
  const { token: jwt, user } = await request('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('libra_token', jwt)
  return user
}
```

Keep the existing function names and return shapes so no page component needs editing.
