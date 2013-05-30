
var http = require("http");

var s = http.createServer(function (req, res) {
    console.log("Listening on: " + process.argv[2]);
    res.end("I am listening on port: " + process.argv[2]);
});

s.listen(process.argv[2]);
