
var express = require('express');

var app = express();

// app.method(url regex, optional functions, handler function )


app.all("/user[s]?/:username", function (req, res) {
    res.end("You asked to see " + req.params.username + "\n");
});

app.get("*", function (req, res) {
    res.end("Hello World EXPRESS-STYLE!");
});

app.listen(8080);

