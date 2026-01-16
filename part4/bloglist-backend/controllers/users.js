import { hash } from 'bcrypt'
import { Router } from 'express'
import { createError } from 'http-errors-enhanced'

import User from '../models/user'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1
  })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (typeof password !== 'string' || password.length < 3) {
    next(
      createError(
        400,
        'Password must be of string type and at least 3 characters long'
      )
    )
  }

  const passwordHash = await hash(password, 10)
  const user = new User({ username, name, passwordHash })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

export default usersRouter
