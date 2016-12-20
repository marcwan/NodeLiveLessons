var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    album_mgr = require("./handlers/album_mgr.js"),
    page_mgr = require("./handlers/page_mgr.js");
var responseTime = require('response-time');

var app = express();

app.use(require("morgan")("dev"));
app.use(responseTime());
app.use(express.static(__dirname + "/../static"));


// /v1/albums.json         -- return all albums
// /v1/albums/*NAME*.json  -- return list of photos in the albums.


// content/something.ext
// templates/some_file.html
// pages/some_page_name                  / /[optional_junk]

app.get("/v1/albums.json", album_mgr.album_list);
app.get("/v1/albums/:album_name.json", album_mgr.load_album);

// /pages/home
// /pages/albums/italy2012
app.get("/pages/:page_name", page_mgr.serve_page);
app.get("/pages/:page_name/:sub_page", page_mgr.serve_page);


app.get("*", function (req, res) {
  send_failure(res, 404, { code: "no_such_page", message: "No such page"});
});

app.listen(8080);




function make_resp_error (err) {
  return JSON.stringify({ code: (err.code) ? err.code : err.name,
                          message: err.message });
}

function send_failure(res, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  res.writeHead(server_code, { "Content-Type" : "application/json"});
  res.end(make_resp_error(err));
}
