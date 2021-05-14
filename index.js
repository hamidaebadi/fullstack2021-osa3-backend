require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const { response, json } = require('express')

/* erro handling middleware*/
const errorHandler = (error, req, res, next) =>{
    console.log(error.message)

    if (error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).send({error: error.message})
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'Unknown endpoint'})
}
morgan.token('bodyData', function(req, res){return JSON.stringify(req['body'])})
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyData'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(p => {
        res.json(p)
    })
})

app.get('/api/info', (req, res) => {
    console.log("User requested", req.url)
    let data = `<p>Phonebook has info fo ${persons.length} people</p>`
    data += `<p>${new Date()}</p>`
    res.send(data)
})

//show specific data
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(p => {
        if(p){
            res.json(p)
        }else{
            res.status(400).end()
        }
    }).catch(error => next(error))
})

//remove specific data from server
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})

//add a new person
app.post('/api/persons', (req, res, next) =>{
    const bodyData = req.body
    const name = bodyData.name
    const number = bodyData.number

    const person = new Person({name, number})

    person.save().then(savedNote => {
        res.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})