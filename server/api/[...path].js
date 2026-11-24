import app from '../app.js'
import { initStore } from '../db/index.js'

// Warm instances reuse the initialized store; each cold start initializes once.
let initialization

export default async function handler(req, res) {
  if (!initialization) initialization = initStore()

  try {
    await initialization
  } catch (err) {
    console.error('Store initialization failed:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ message: 'Database initialization failed' }))
  }

  return app(req, res)
}
