var express = require('express');

var app = express();
app.get("*", function (req, res) {
    res.end("THIS IS SECRET WOOO!\n");
});


app.listen(8080);
