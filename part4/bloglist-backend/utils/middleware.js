import jwt from 'jsonwebtoken'

import User from '../models/user'
import { createError } from '../node_modules/http-errors-enhanced/dist/index.js'

/**
 * Auth Middleware
 * Extracts token from Authorization header and attaches to request.
 */
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}
/**
 * Auth Middleware
 * Verifies JWT and attaches user to request.
 */
const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    return next(createError(401, 'token missing'))
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return next(createError(401, 'decoded token invalid'))
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return next(createError(400, 'UserId missing or not valid'))
  }
  request.user = user
  next()
}

/**
 * Handles requests to unknown endpoints.
 */
const unknownEndpoint = (_request, _response) => {
  throw createError(404, 'unknown endpoint')
}

/**
 * Centralized error handler.
 * Logs error and sends appropriate response.
 */
const errorHandler = (error, request, response, next) => {
  // Log all errors for debugging without exposing format string injection surface
  const { method, originalUrl, path, url } = request
  const safePath = typeof originalUrl === 'string' ? originalUrl : path || url || ''
  console.error('Request error', {
    method,
    path: safePath,
    error
  })

  if (error.name === 'CastError') {
    next(createError(400, 'malformatted id'))
  } else if (error.name === 'ValidationError') {
    next(createError(400, error.message))
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    next(createError(400, 'expected `username` to be unique'))
  } else if (error.name === 'JsonWebTokenError') {
    next(createError(401, 'token invalid'))
  } else if (error.name === 'TokenExpiredError') {
    next(createError(401, 'token expired'))
  }

  // Handle express-validator errors (http-errors-enhanced can attach errors array)
  if (error.errors && Array.isArray(error.errors)) {
    return response.status(error.status || 400).json({ errors: error.errors })
  }

  // For http-errors-enhanced or unknown errors
  response
    .status(error.status || 500)
    .json({ error: error.message || 'Internal Server Error' })
}

export { tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
