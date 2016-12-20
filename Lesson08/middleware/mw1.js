var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require("cookie-parser"),
    session = require('express-session');

var app = express();

app.use(morgan("dev"));

app.use(cookieParser());
app.use(session({
    secret: "cats on the keyboard",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 }
}));

// how do i set a cookie?

app.use(function (req, res) {
  var x = req.session.last_access;
  req.session.last_access = new Date();
  res.end("You last asked for this page at: " + x);
});



app.listen(8080);
