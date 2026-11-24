import { HttpError } from './http.js'

export function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} is required`)
  }
  return value.trim()
}

export function optionalString(value, fallback = '') {
  if (value === undefined || value === null) return fallback
  if (typeof value !== 'string') throw new HttpError(400, 'Invalid string value')
  return value.trim()
}

export function positiveNumber(value, field, fallback) {
  if (value === undefined || value === null || value === '') {
    if (fallback !== undefined) return fallback
    throw new HttpError(400, `${field} is required`)
  }
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) throw new HttpError(400, `${field} must be a positive number`)
  return n
}

export function nullableYear(value) {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  if (!Number.isInteger(n)) throw new HttpError(400, 'publishedYear must be a whole number')
  return n
}

export function email(value) {
  const clean = requiredString(value, 'email').toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw new HttpError(400, 'Enter a valid email address')
  }
  return clean
}

export function role(value) {
  return value === 'admin' ? 'admin' : 'student'
}
