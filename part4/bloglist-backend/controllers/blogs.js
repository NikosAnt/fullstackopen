import { Router } from 'express'
import { body } from 'express-validator'
import { createError } from 'http-errors-enhanced'

import Blog from '../models/blog'
import { warn } from '../utils/logger'
import { userExtractor } from '../utils/middleware'

const blogRouter = Router()

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1
    })
    if (!blogs || blogs.length === 0) {
      warn('No blogs found')
      return response.status(200).json([])
    }
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (err) {
    next(createError(500, 'Error fetching blogs', { cause: err }))
  }
})

blogRouter.post(
  '/',
  userExtractor,
  [
    body('title').notEmpty().isString().withMessage('Title is required'),
    body('url').optional().isString(),
    body('author').optional().isString(),
    body('likes').optional().isInt({ min: 0 })
  ],
  async (request, response, next) => {
    try {
      const body = request.body
      const user = request.user

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
      })

      const savedBlog = await blog.save()
      if (!user.blogs) {
        user.blogs = []
      }

      const populated = await savedBlog.populate('user', {
        username: 1,
        name: 1
      })

      user.blogs = user.blogs.concat(savedBlog.id)
      await user.save()

      response.status(201).json(populated.toJSON())
    } catch (err) {
      next(createError(400, 'Error saving blog', { cause: err }))
    }
  }
)

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const { id } = request.params
    const user = request.user

    const blog = await Blog.findById(id)
    if (!blog) {
      warn(`Blog with id ${id} not found`)
      next(createError(404, 'Blog not found'))
    }
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(id)
      response.status(204).end()
    } else {
      next(createError(401, 'Unauthorized'))
    }
  } catch (err) {
    next(createError(500, 'Error deleting blog', { cause: err }))
  }
})

blogRouter.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').optional().isString(),
    body('author').optional().isString(),
    body('likes').notEmpty().isInt({ min: 0 })
  ],
  async (request, response, next) => {
    const { id } = request.params
    try {
      const errors = (await import('express-validator')).validationResult(
        request
      )
      if (!errors.isEmpty()) {
        warn('Validation failed for PUT /blogs/:id', errors.array())
        next(createError(400, 'Validation error', { errors: errors.array() }))
      }

      const body = request.body
      const updatedBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      }

      const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
        new: true
      })
      if (!result) {
        warn(`Blog with id ${id} not found`)
        next(createError(404, 'Blog not found'))
      }
      const populated = await result.populate('user', { username: 1, name: 1 })
      response.json(populated.toJSON())
    } catch (err) {
      next(createError(500, 'Error updating blog', { cause: err }))
    }
  }
)

blogRouter.post('/:id/comments', async (req, res) => {
  const { comment } = req.body
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  blog.comments.push(comment)
  const updatedBlog = await blog.save()
  res.status(201).json(updatedBlog)
})

export default blogRouter
