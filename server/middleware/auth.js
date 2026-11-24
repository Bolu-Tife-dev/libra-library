import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { HttpError } from '../utils/http.js'

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' })
}

export function authenticate(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return next(new HttpError(401, 'Authentication required'))
  try {
    req.user = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    next(new HttpError(401, 'Invalid or expired token'))
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') return next(new HttpError(403, 'Admin access required'))
  next()
}
