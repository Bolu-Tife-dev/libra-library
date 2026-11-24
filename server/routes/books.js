import { Router } from 'express'
import { store } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { asyncHandler, HttpError } from '../utils/http.js'
import { requiredString, optionalString, positiveNumber, nullableYear } from '../utils/validate.js'

const router = Router()

const parseBookBody = (body) => ({
  title: requiredString(body?.title, 'title'),
  author: requiredString(body?.author, 'author'),
  isbn: optionalString(body?.isbn),
  category: optionalString(body?.category, 'Uncategorized') || 'Uncategorized',
  copiesTotal: positiveNumber(body?.copiesTotal, 'copiesTotal', 1),
  publishedYear: nullableYear(body?.publishedYear),
  description: optionalString(body?.description),
})

router.get('/', asyncHandler(async (req, res) => {
  const books = await store.listBooks({
    search: req.query.search || '',
    category: req.query.category || '',
    availableOnly: req.query.availableOnly === 'true',
  })
  res.json(books)
}))

router.get('/categories', asyncHandler(async (_req, res) => {
  res.json(await store.getCategories())
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const book = await store.getBook(req.params.id)
  if (!book) throw new HttpError(404, 'Book not found')
  res.json(book)
}))

router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const book = await store.createBook(parseBookBody(req.body))
  res.status(201).json(book)
}))

router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const book = await store.updateBook(req.params.id, parseBookBody(req.body))
  res.json(book)
}))

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  res.json(await store.deleteBook(req.params.id))
}))

export default router
