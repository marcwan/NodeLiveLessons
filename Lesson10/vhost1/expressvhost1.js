
var express = require('express');

var master_app = express();


var one = express();
one.get("*", function (req, res) {
    res.end("1\n");
});
var two = express();
two.get("*", function (req, res) {
    res.end("2\n");
});
var three = express();
three.get("*", function (req, res) {
    res.end("3\n");
});


master_app.use(express.logger('dev'));
master_app.use(express.vhost("app1", one));
master_app.use(express.vhost("app2", two));
master_app.use(express.vhost("app3", three));

master_app.listen(8080);
