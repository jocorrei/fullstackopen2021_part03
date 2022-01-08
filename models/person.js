require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI
console.log('conecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connectiong to MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  },
  date: Date
})
personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)