
var express = require('express');


var app = express();


app.use(function (req, res) {
    res.end("This is app THREE \n");
});

app.listen(8083);