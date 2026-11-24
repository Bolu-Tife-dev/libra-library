/* ============================================================================
 * REAL API LAYER — talks to the Express backend on http://localhost:5000
 * ----------------------------------------------------------------------------
 * Function names and return shapes match the old mock layer, so no page
 * component needs to change. Authentication uses a JWT stored in localStorage.
 * ==========================================================================*/

const BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/$/, '')
const TOKEN_KEY = 'libra_token'
const USER_KEY = 'libra_user'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const getToken = () => localStorage.getItem(TOKEN_KEY)

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Cannot reach the API. Make sure the backend is running on port 5000.', 0)
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Empty body — fine for some responses.
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('libra:unauthorized'))
    }
    throw new ApiError(data?.message || `Request failed (${response.status})`, response.status)
  }
  return data
}

const params = (obj) => new URLSearchParams(
  Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => [key, String(value)]),
).toString()

/* -------------------------------- books ----------------------------------- */

export async function getBooks({ search = '', category = '', availableOnly = false } = {}) {
  return request(`/books?${params({ search, category, availableOnly: availableOnly ? 'true' : '' })}`)
}

export async function getBook(id) {
  try {
    return await request(`/books/${id}`)
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function getCategories() {
  return request('/books/categories')
}

export async function createBook(data) {
  return request('/books', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateBook(id, data) {
  return request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteBook(id) {
  return request(`/books/${id}`, { method: 'DELETE' })
}

/* ------------------------------- borrows ---------------------------------- */

export async function getBorrows({ memberId, status } = {}) {
  return request(`/borrows?${params({ memberId, status })}`)
}

export async function borrowBook(bookId) {
  return request('/borrow', { method: 'POST', body: JSON.stringify({ bookId }) })
}

export async function returnBook(borrowId) {
  return request('/return', { method: 'POST', body: JSON.stringify({ borrowId }) })
}

/* --------------------------------- auth ----------------------------------- */

function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export async function login({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return saveSession(data)
}

export async function register({ name, email, password, role, idCard }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, idCard }),
  })
  return saveSession(data)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
