import express from 'express'

import Note from '../models/note'
import User from '../models/user'

const router = express.Router()

// Testing route for resetting test database
router.post('/reset', async (request, response) => {
  // Add database reset logic here
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

export default router
