var express = require("express"),
    https = require("https"),
    fs = require('fs');

var privateKey = fs.readFileSync("privkey.pem").toString();
var certificate = fs.readFileSync("newcert.pem").toString();

var options = {
  key: privateKey,
  cert: certificate
};

var app = express();
app.get("*", function (req, res) {
    res.end("Thanks for calling (securely!)!!!\n");
});

var port_number = 8443;
https.createServer(options, app).listen(port_number, function () {
  console.log("Express server now listening on port " + port_number);
});
