import { compare } from 'bcrypt'
import { Router } from 'express'
import { createError } from 'http-errors-enhanced'
import jwt from 'jsonwebtoken'

import User from '../models/user'

const loginRouter = Router()

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    next(createError(401, 'invalid username or password'))
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id })
})

export default loginRouter
