var express = require('express');
var MemcachedStore = require('connect-memcached')(express);

var app = express()
    .use(express.logger('dev'))
    .use(express.cookieParser())
    .use(express.session({ secret: "cat on keyboard",
                           // see what happens for value of maybe 3000
                           cookie: { maxAge: 1800000 },
                           store: new MemcachedStore({ host: "localhost:12321" })}))
    .use(function (req, res, next){
        var x = req.session.last_access;  // undefined when cookie not set
        req.session.last_access = new Date();
        res.end("You last asked for this page at: " + x);
    })
    .listen(8080);

