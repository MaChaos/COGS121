exports.view = function (req, res) {
  var db = req.db
  // db.collection('test').find().toArray((err, result) => {
  //   if (err) return console.log(err)
  //   // renders index.ejs
    res.render('login')
}
