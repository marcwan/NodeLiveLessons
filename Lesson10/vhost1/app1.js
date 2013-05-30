
var express = require('express');


var app = express();


app.use(function (req, res) {
    res.end("This is app one \n");
});

app.listen(8081);