var PORT = 3000;

var express = require('express')
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

var index = require('./routes/index');
var app = express()
// Print logs to the console and compress pages we send
app.set('views', path.join(__dirname, 'views'));

// CORS ACCESS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://maps.googleapis.com/maps/api/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  // console.log("here we are");

  next();
});

app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));

app.get('/', index.view);

// Start the server
var port = process.env.PORT || PORT; // 80 for web, 3000 for development
var server = app.listen(port, function() {
	console.log("Node.js server running on port %s", port);
});
