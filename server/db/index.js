import { usePostgres } from '../config.js'
import { MemoryStore } from './memory.js'
import { PostgresStore } from './postgres.js'

export const store = usePostgres ? new PostgresStore() : new MemoryStore()

export async function initStore() {
  await store.init()
  console.log(`Storage: ${usePostgres ? 'PostgreSQL / Supabase' : 'local JSON file (server/data/store.json)'}`)
}
