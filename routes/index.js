exports.view = function (req, res) {
  console.log(req.user);
  var db = req.db
  db.collection('test').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index')
  })
}
exports.test = function (req, res) {
  console.log(req.user);
  var db = req.db
  db.collection('test').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('login')
  })
}
