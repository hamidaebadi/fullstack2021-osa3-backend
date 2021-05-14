const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const url = process.env.MONGODB_URL

//connect to database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('Connected to the ', url)
})
.catch((error) => {
    console.log('Connection failed', error.message)
})

const personSchema = mongoose.Schema({
    name: {type: String, unique: true, minlength: 3, required: true},
    number: {type: String, unique: true, minlength: 8, required: true}
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//add plugins
personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)