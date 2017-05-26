var PORT = 3000;

var express = require('express')
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var mongoose = require('mongoose');

var index = require('./routes/index');
var login = require('./routes/login');
var app = express()


var blogModel = require('./models/blog');
// Print logs to the console and compress pages we send
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(configDB.url);
require('./config/passport')(passport);

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
  // app.listen(3000, () => {
  //   console.log('listening on 3000')
  // })
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
// log every request to the console
// app.use(morgan('dev'));
// get info from html forms
app.use(bodyParser());
// read cookies for auth
app.use(cookieParser());

// required for passport
app.use(session({secret: 'icanttellyou'}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));

// require('./routes/routes.js')(app, passport);

app.get('/', index.test);
app.get('/index', index.view);

app.get('/login', (req, res) => {
  res.render('login', {message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/signup', (req, res) => {
  res.render('signup', {message: req.flash('signupMessage')});
})
// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}))

// app.get('/profile', isLoggedIn, (req, res) => {
//   // console.log(req);
//   res.render('profile', {
//     user: req.user
//   });
// })
app.get('/profile', isLoggedIn, (req, res) => {
  console.log(req.user.local.username);
  res.redirect('/' + req.user.local.username);
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}
// function isOwner(req, res, next) {
//   if (req.isAuthenticated() && req.params.username = req.user.local.username)
//     return next();
//   res.red
// }
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
app.get('/newblog', isLoggedIn, (req, res) => {
  // console.log(req.params);
  res.render('newblog');
})
// app.get('/:username/:title', (req, res) => {
//   // console.log(req.params);
//   console.log(req.params);
//   // blogModel.findOne()
//   res.render('newblog', {
//     'username': req.params.username,
//     'title': req.params.title
//   });
// })
app.post('/place', isLoggedIn, (req, res) => {
  // console.log(req.body);
  // console.log(req.data);
  console.log(req);
})
app.post('/post', isLoggedIn, (req, res, next) => {
  console.log("this is the first step")
  next()
}, (req, res) => {
  console.log(req.places);
  var blog = req.body;
  var user = req.user;
  var date = new Date();
  var title = blog.title;
  console.log(blog);
  console.log(user);
  // console.log( );
  var newBlog = new blogModel();
  newBlog.owner.id = user._id;
  newBlog.owner.username = user.local.username;
  newBlog.title = blog.title;
  newBlog.time = date.toString();
  newBlog.content = blog.content;
  newBlog.places = req.body.places;
  newBlog.save(function(err) {
    if (err) throw err;
  })
  res.send({redirect: '/'+ user.local.username + '/' + title});
})


// after post, will direct to /:username/:title
app.get('/:username/:title', (req, res) => {
  var owner = req.params.username;
  var title = req.params.title;
  var loggedIn = false;
  var isOwner = false;
  blogModel.findOne({
    'owner.username' : owner,
    'title' : title
  }, function(err, result) {
    if (err) return handleError(err);
    if (req.isAuthenticated()) {
      var currentUser = req.user.local.username
      loggedIn = true;
      if (owner = currentUser)
        isOwner = true;
    }
    res.render('blog', {
      loggedIn,
      isOwner,
      currentUser,
      blog : result,
      places : result.places
    });
  }
  )
})

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

app.get('/:username', (req, res) => {
  var owner = req.params.username;
  var loggedIn = false;
  var isOwner = false;
  blogModel.find({
    'owner.username' : owner,
  }, function(err, result) {
    if (err) return handleError(err);
    if (req.isAuthenticated()) {
      var currentUser = req.user.local.username
      loggedIn = true;
      if (owner = currentUser)
        isOwner = true;
    }
    res.render('profile', {
      user: req.user,
      username: req.params.username,
      loggedIn,
      isOwner,
      currentUser,
      blogs : result
    });
  }
  )
  // res.render('profile', {
    // user: req.user,
    // username: req.params.username
  // });

})

app.listen(3000, () => {
  console.log('listening on 3000')
})
