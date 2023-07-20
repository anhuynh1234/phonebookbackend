const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>Phonebook has info for ${persons.length} ${persons.length > 1 ? "people" : "person"} <br /> ${Date()}</div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(!person){
        response.status(404).end()
    }else{
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

morgan.token('requestBody', (request, response) => {
    return(JSON.stringify(request.body))
})

app.use(morgan((tokens, req, res) => {
    console.log(tokens.req(req, res, ''))

    return [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens.res(req, res, 'content-length'), tokens['response-time'](res, req), 'ms', tokens.requestBody(req, res)].join(' ')
}))

// app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*1000000000000)
    const person = {...request.body, id:id}

    if(request.body.name){
        let duplicate = false
        persons.map(person => {
            return ((person.name === request.body.name) ? (duplicate = true) : (duplicate === true ? duplicate = true : duplicate = false))
        })

        if(duplicate){
            return(response.status(400).json({
                error: "duplicate name"
            }))
        }
    }

    if(!request.body){
        return response.status(400).json({
            error: "empty profile"
        })
    }else if(!request.body.name || !request.body.number){
        if(!request.body.name){
            return response.status(400).json({
                error: "name missing"
            })
        }else if(!request.body.number){
            return(response.status(400).json({
                error: "number missing"
            }))
        }
    }else{
        persons = persons.concat(person)
        response.json(persons)
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})