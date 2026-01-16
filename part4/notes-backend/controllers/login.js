import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'username and password required' })
  }

  const user = await User.findOne({ username })
  let passwordCorrect = false

  if (user) {
    passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  }

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  if (!process.env.SECRET) {
    return response
      .status(500)
      .json({ error: 'JWT secret not defined in environment variables' })
  }

  // token expires in 60*60 seconds, that is 1 hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  response.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
