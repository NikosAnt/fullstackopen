import bcrypt from 'bcrypt'
import express from 'express'

import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1
  })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    !/(?=.*[a-z])/.test(password) ||
    !/(?=.*[A-Z])/.test(password) ||
    !/(?=.*\d)/.test(password)
  ) {
    return response.status(400).json({
      error:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

export default usersRouter
