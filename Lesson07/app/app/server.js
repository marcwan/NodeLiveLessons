
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    page_hdlr = require('./handlers/pages.js'),
    album_hdlr = require('./handlers/albums.js');


var app = express();

app.use(express.logger('dev'));
app.use(express.responseTime());
app.use(express.static(__dirname + "/../static"));

//     /v1/albums.json
//     /v1/albums/italy2012.json

//     /content/BLAH.html
//     /templates/BLAH.html
//     /pages/home
//     /pages/album/:album_name

app.get("/v1/albums.json", album_hdlr.list_albums);
app.get("/v1/albums/:album_name.json", album_hdlr.get_album);

app.get("/pages/:page_name", page_hdlr.serve_page);
app.get("/pages/:page_name/:sub_page", page_hdlr.serve_page);



app.get("*", function (req, res) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "unknown_resource" }));
});


app.listen(8080);

