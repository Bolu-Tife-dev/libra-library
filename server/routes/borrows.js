import { Router } from 'express'
import { store } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler, HttpError } from '../utils/http.js'
import { positiveNumber } from '../utils/validate.js'

const router = Router()

router.get('/borrows', authenticate, asyncHandler(async (req, res) => {
  // Students only see their own loans; admins see everything unless filtered.
  const memberId = req.user.role === 'admin' ? (req.query.memberId || undefined) : req.user.id
  res.json(await store.listBorrows({ memberId, status: req.query.status || '' }))
}))

router.post('/borrow', authenticate, asyncHandler(async (req, res) => {
  const bookId = positiveNumber(req.body?.bookId, 'bookId')
  res.status(201).json(await store.createBorrow({ bookId, memberId: req.user.id }))
}))

router.post('/return', authenticate, asyncHandler(async (req, res) => {
  const borrowId = positiveNumber(req.body?.borrowId ?? req.body?.id, 'borrowId')
  const record = await store.getBorrow(borrowId)
  if (!record) throw new HttpError(404, 'Borrow record not found')
  if (req.user.role !== 'admin' && Number(record.memberId) !== Number(req.user.id)) {
    throw new HttpError(403, 'You can only return your own books')
  }
  res.json(await store.returnBorrow(borrowId))
}))

export default router
