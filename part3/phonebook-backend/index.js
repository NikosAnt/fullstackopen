import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return response.status(400).json({ error: error.message })
    case 'MongoServerError':
      if (error.code === 11000) {
        return response.status(400).json({ error: 'name must be unique' })
      }
      break
    case 'JsonWebTokenError':
      return response.status(401).json({ error: 'invalid token' })
    case 'TokenExpiredError':
      return response.status(401).json({ error: 'token expired' })
    case 'NotFoundError':
      return response.status(404).json({ error: 'not found' })
    default:
      response.status(500).send({ error: 'something went wrong' })
  }

  console.error(error)
  next(error)
}
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('post', function (request) {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)

app.get('/', response => {
  response.send('<h1>Phonebook Server</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({})
    .then(count => {
      const info = `
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            `
      response.send(info)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
