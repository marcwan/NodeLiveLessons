
var express = require('express'),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    MemcachedStore = require("connect-memcached")(session);

var port_number = process.argv[2];

var app = express()
    .use(cookieParser())
    .use(session({
      secret: "cat on keyboard",
      cookie: {maxAge: 1800000 },
      resave: false,
      saveUninitialized: true,
      store: new MemcachedStore({ host: "localhost:12321" })
    }))
    .use(function (req, res) {
      console.log("Got a request on port: " + port_number);
        var x = req.session.last_access;
        req.session.last_access = new Date();
        res.end("You last asked for this page (" + port_number + ") at: " + x);
    })
    .listen(port_number);
