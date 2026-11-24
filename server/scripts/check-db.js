import { config, usePostgres } from '../config.js'
import { store } from '../db/index.js'

if (!usePostgres) {
  console.log('DATABASE_URL is empty — using the local JSON store. Nothing to check.')
  process.exit(0)
}

try {
  await store.init()
  const books = await store.listBooks()
  const borrows = await store.listBorrows()
  console.log(`Connected to PostgreSQL. books=${books.length} borrows=${borrows.length}`)
} catch (err) {
  console.error(`Connection failed: ${err.message}`)
  process.exitCode = 1
} finally {
  await store.pool?.end()
}
