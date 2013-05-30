
var express = require('express'),
    https = require('https'),
    fs = require('fs');

var privateKey = fs.readFileSync("privkey.pem").toString();
var cert       = fs.readFileSync("newcert.pem").toString();

var options = { key: privateKey, cert: cert };

var app = express();
app.get("*", function (req, res) {
    res.end("THIS IS SECRET WOOO!\n");
});


https.createServer(options, app).listen(8443, function () {
    console.log("Listening for secure traffic\n");
});


