var PORT = 3000;

var express = require('express')
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var app = express()
// Print logs to the console and compress pages we send
app.set('views', path.join(__dirname, 'views'));


//db ACCESS
const MongoClient = require('mongodb').MongoClient
// var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/my_database');
// Start the server
var port = process.env.PORT || PORT; // 80 for web, 3000 for development
// var server = app.listen(port, function() {
// 	console.log("Node.js server running on port %s", port);
// });

var db
MongoClient.connect('mongodb://dbuser:dbpassword@ds127531.mlab.com:27531/td-db', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
app.use(function(req, res, next) {
  req.db = db;
  next();
})
// CORS ACCESS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://maps.googleapis.com/maps/api/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  // console.log("here we are");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));

app.get('/', index.view);
// app.get('/', (req, res) => {
//   db.collection('test').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     // renders index.ejs
//     res.render('index', {quotes: result})
//   })
// })

app.get("/edit", (req, res) => {
  db.collection('test').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('edit', {quotes: result})
  })
})

app.post('/add', (req, res) => {
    db.collection('test').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

app.post('/save', (req, res) => {
    var blog = req.body;
    console.log(blog.name);
    console.log(req.body);
    db.collection('test').update(
      {id: blog.id},
      {
        name: blog.name,
        quote: blog.quote
      },
      (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});
