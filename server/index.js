import app from './app.js'
import { config } from './config.js'
import { initStore } from './db/index.js'

await initStore()

app.listen(config.port, () => {
  console.log(`Libra API listening on http://localhost:${config.port}`)
  console.log(`CORS origin: ${config.corsOrigin}`)
})
