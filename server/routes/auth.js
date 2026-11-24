import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { store } from '../db/index.js'
import { authenticate, signToken } from '../middleware/auth.js'
import { asyncHandler, HttpError } from '../utils/http.js'
import { requiredString, email as validEmail, role as parseRole } from '../utils/validate.js'

const router = Router()

const toPublicUser = (u) => ({
  id: Number(u.id),
  name: u.name,
  email: u.email,
  role: u.role,
  idCard: u.idCard ?? u.id_card ?? null,
  createdAt: u.createdAt ?? u.created_at ?? null,
})

const withToken = (user) => ({ token: signToken(user), user })

router.post('/register', asyncHandler(async (req, res) => {
  const name = requiredString(req.body?.name, 'name')
  const mail = validEmail(req.body?.email)
  const password = requiredString(req.body?.password, 'password')
  if (password.length < 4) throw new HttpError(400, 'Password must be at least 4 characters')

  const requestedRole = parseRole(req.body?.role)
  const idCard = requestedRole === 'admin' ? req.body?.idCard : null

  // Server-side rule: a student account can never be created with admin privileges.
  if (requestedRole === 'admin' && !idCard?.name) {
    throw new HttpError(403, 'Admin registration requires a staff ID card. Students cannot register as admins.')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await store.createUser({ name, email: mail, passwordHash, role: requestedRole, idCard })
  res.status(201).json(withToken(toPublicUser(user)))
}))

router.post('/login', asyncHandler(async (req, res) => {
  const mail = validEmail(req.body?.email)
  const password = requiredString(req.body?.password, 'password')

  const user = await store.findUserByEmail(mail)
  if (!user || !(await bcrypt.compare(password, user.passwordHash || user.password_hash))) {
    throw new HttpError(401, 'Invalid email or password')
  }
  res.json(withToken(toPublicUser(user)))
}))

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await store.findUserById(req.user.id)
  if (!user) throw new HttpError(401, 'Account no longer exists')
  res.json(toPublicUser(user))
}))

export default router
