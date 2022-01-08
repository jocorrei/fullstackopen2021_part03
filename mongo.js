const mongoose = require('mongoose')
const len = process.argv.length


console.log(len);

if (len < 3) {
	console.log('please provide password as an argument or if you want to add a new person to the data base provide the name and the number: node mongo.js <password> <name> <number>');
	process.exit(1)
}

const password = process.argv[2]

const url = 
	`mongodb://joaunsz:${password}@cluster0-shard-00-00.didk1.mongodb.net:27017,cluster0-shard-00-01.didk1.mongodb.net:27017,cluster0-shard-00-02.didk1.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-139sqe-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	content: String,
	number: String,
	date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (len === 3) {
	
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person);
		})
		mongoose.connection.close()
	})
}

if (len === 5) {
	const personName = process.argv[3]
	const personNumber = process.argv[4]
	
	const person = new Person({
		content: personName,
		number: personNumber,
		date: new Date(),
	})

	person.save().then(result => {
		console.log(`added ${personName} number ${personNumber} to phonebook`)
		mongoose.connection.close()
	})
}
