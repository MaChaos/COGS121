exports.view = function (req, res) {
  // console.log(req);
  // console.log("*********************************************")
  // console.log(res);
  res.render('index');
  // console.log(res.getHeader("Access-Control-Allow-Origin"));
  // res.header("Access-Control-Allow-Origin", "https://maps.googleapis.com/maps/api/");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "GET, POST");
  // res.render('index');
}
