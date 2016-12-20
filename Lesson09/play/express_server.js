var express = require('express');

var app = express();

// app.method(url_regex, optional funcs, handler_function);

// /users/10000 >  new function
// /users/id < 1000, legacy function
// /users/
app.get("/user[s]?/:userid.json", function (req, res, next) {
  // new function !!!
  if (parseInt(req.params.userid) < 10000) {
    next();
  } else {
    res.end("You asked for user: " + req.params.userid + "\n");
  }
});

app.get("/user[s]?/:userid.json", function (req, res) {
  // legacy !!!
  res.end("LEGACY USER ID !!!\n");
});

// /albums/budapest2015/photos/photo123.json
app.get("/albums/:album_name/photos/:photoid.json", function (req, res) {
});

app.get("*", function (req, res) {
  res.end("Hello world, EXPRESS-STYLE!");
});


app.listen(8080);
