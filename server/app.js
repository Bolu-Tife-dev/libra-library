import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
import borrowRoutes from './routes/borrows.js'
import { notFound, errorHandler } from './middleware/errors.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api', borrowRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
