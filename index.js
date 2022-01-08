require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
//console.log("testttttt")

  switch (error.name) {
  case 'CastError':
    return response.status(400).send({ error: 'invalid id, check format' })
  case 'ValidationError':
    return response.status(400).send({ error: error.message })
  default:
    next(error)
  }
}

morgan.token('object', (req) => {
  return (req.body.name ? JSON.stringify(req.body) : ' ')
})

app.use(express.json(), morgan(':method :url :status :res[content-length] - :response-time ms :object'), cors(), express.static('build'))

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(person => {
    response.send(`<div><h1>Phonebook has info for ${person.length} people</h1><p>${date}</p></div>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch((error) => {
    console.log(error)
  })
})

app.get('/api/persons/:id', (request, response, next) =>  {
  Person.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content is missing' })
  }

  const person = new Person({
    content: body.content,
    number: body.number,
    date: new Date(),
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
//	console.log(request.params.id)
//	console.log(request.body)
  Person.findByIdAndUpdate(request.params.id, request.body, {
    new: true, runValidators: true
  })
    .then(res => {
      if (res) {
        response.json(res)
      }
      else
        response.status(404).send({ error: 'Couldnt find entry' })
    })
    .catch(error => next(error))
})

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})