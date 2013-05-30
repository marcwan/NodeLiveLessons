
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    page_hdlr = require('./handlers/pages.js'),
    album_hdlr = require('./handlers/albums.js');


var app = express();

app.use(express.logger('dev'));
app.use(express.responseTime());
app.use(express.bodyParser({ keepExtensions: true }));
app.use(express.static(__dirname + "/../static"));

//     /v1/albums.json
//     /v1/albums/italy2012.json

//     /content/BLAH.html
//     /templates/BLAH.html
//     /pages/home
//     /pages/album/:album_name

app.get("/v1/albums.json", album_hdlr.list_albums);
app.put("/v1/albums.json", album_hdlr.create_album);
app.get("/v1/albums/:album_name.json", album_hdlr.get_album);

app.get("/v1/albums/:album_name/photos.json", album_hdlr.photos_for_album);
app.put("/v1/albums/:album_name/photos.json", album_hdlr.add_photo_to_album);



app.get("/pages/:page_name", page_hdlr.serve_page);
app.get("/pages/:page_name/:sub_page", page_hdlr.serve_page);



app.get("*", function (req, res) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "unknown_resource" }));
});



require('./data/db.js').init(function (err, results) {
    if (err) {
        console.error("FATAL ERROR INIT:");
        console.error(err);
        process.exit(-1);
    } else {
        app.listen(8080);
    }
});



