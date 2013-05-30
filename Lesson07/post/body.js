
var express = require('express');

var app = express();



app.get("/users", function (req, res) {
    res.end("users");
});
app.get("/albums", function (req, res) {
    res.end("albums");
});
app.get("/albums/:album_name/photos", function (req, res) {
    res.end("photos");
});
app.get("/admin", express.basicAuth("username", "secret"), function (req, res) {
    res.end("secret admin page");
});





app.listen(8080);
