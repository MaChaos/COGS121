const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

/* -------- for team documentation --------
intiializing setup for mongodb below

for future reference:
our db name: td-db (traveldiaries-db)
user: dbuser
password: dbpassword
------------------------------------------------ */ 
var db

MongoClient.connect('mongodb://dbuser:dbpassword@ds127531.mlab.com:27531/td-db', (err, database) => {
	if (err) return console.log(err)
	db = database

	app.listen(3000, () => {
		console.log('connected to mongoDB successfully. now listening on port 3000 ')
	})

})

/* -------- for team documentation --------
BODYPARSER makes it possible to handle reading data from form element in index.html.  URLENCODED method within body-parser tells body-parser to extract data from form element and add them to the body element property in request object.
------------------------------------------------ */ 
app.use(bodyParser.urlencoded({extended: true}))

// makes public folder accessible to the public 
app.use(express.static('public'))

//tell server to read JSON data
app.use(bodyParser.json())

//set 'ejs' template engine, and default extension is ejs
app.set('view engine', 'ejs')

/* -------- for team documentation --------
=> = replacement for function

app.get hand a GET request (read operation)
------------------------------------------------ */
app.get('/', (req, res) => {
	//serves index.html back to browser
	//res.sendFile(__dirname + '/index.html')

	//gets list of trips from mlab.com
	var cursor = db.collection('trips').find()

	//retrieves list of trips retrieved from mlab
	db.collection('trips').find().toArray(function(err, results) {
		if(err) return console.log(err)

		//renders index.ejs
		res.render('index.ejs', {trips:results})
	})
})



/* app.post handles a create request */
app.post('/trips', (req, res) => {
	db.collection('trips').save(req.body, (err, result) =>{
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/') //causes browser to reload
	})
})

/* put method replaces the last entry in the db with an already preset one from vegas*/
app.put('/trips', (req, res) => 
{
  // db.collection('trips')
  // .findOneAndUpdate({}, 
  // {
  //   $set: {
  //     trip: req.body.trip,
  //     location: req.body.location
  //   }
  // }, 
  // {
  //   sort: {_id: -1}, //updates last entry
  //   upsert: true //forcecreate new entry if no entries found 
  // }, 
  // (err, result) => 
  // {
  //   if (err) return res.send(err)
  //   res.send(result)
db.collection('trips')
  .find().limit(1).sort({$natural: -1}).toArray(function(err, lastObject){
  	lastObject = lastObject[0]
  	lastObject.trip = 'My Wild Night Out'
  	lastObject.location = 'LV'
  	db.collection('trips').update({_id: lastObject._id}, lastObject, () => {
  				
  		setTimeout(function(){
  			console.log("after sleep");
  			res.redirect('/')
  		}, 10000)
  	})
  })
})