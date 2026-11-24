import { HttpError } from '../utils/http.js'

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route ${req.method} ${req.path} not found`))
}

export function errorHandler(err, _req, res, _next) {
  if (!(err instanceof HttpError)) console.error(err)
  const status = err.status || 500
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
  })
}
