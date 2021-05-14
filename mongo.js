const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("Give password as argument")
    process.exit()
}

const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.pwhrk.mongodb.net/person_app?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

if(nameArg && numberArg){
    const newPerson = new Person({
        name: nameArg,
        number: numberArg
    })
    
    newPerson.save().then(result => {
        console.log(`added ${nameArg} number ${numberArg} to phonebook`)
        mongoose.connection.close()
    })
}else{
    //find all persons
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(p => {
            console.log(p.name,' ', p.number)
        })
        mongoose.connection.close()
    })
}
