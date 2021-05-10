const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


let persons = [
    {
        id: 1,
        name: 'Hamid Aebadi',
        number: '0465460500'
    },
    {
        id: 2,
        name: 'Taj bibi',
        number: '056476343'
    },
    {
        id: 3,
        name: 'Sakhi dad',
        number: '057648783'
    },
    {
        id: 4,
        name: 'Saeed Gholami',
        number: '045654633'
    },
]

morgan.token('bodyData', function(req, res){return JSON.stringify(req['body'])})
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyData'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    console.log("User requested", req.url)
    let data = `<p>Phonebook has info fo ${persons.length} people</p>`
    data += `<p>${new Date()}</p>`
    res.send(data)
})

//show specific data
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const founded = persons.find(p => p.id === id)
    if(founded){
        res.json(founded)
    }else{
        res.sendStatus(404).end
    }
})

//remove specific data from server
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.sendStatus(204).end()
})

//add a new person
app.post('/api/persons', (req, res) =>{
    const id = Math.floor(Math.random()*1000)
    const bodyData = req.body
    const name = bodyData.name
    const number = bodyData.number
    if(persons.find(p=>p.name === name)){
        return res.status(400).json({
            error: 'name is already in phonebook'
        })
    }

    if(!name || !number){
        return res.status(400).json({
            error: 'phone or name missing'
        })
    }

    const newPerson = {id, name, number}
    persons = persons.concat(newPerson)
    res.json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})