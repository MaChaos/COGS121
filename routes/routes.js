module.exports = function(app, passport) {
  app.get('/login', (req,res) => {
    res.render('login')
  })
}
