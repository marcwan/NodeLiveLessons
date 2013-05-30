
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    page_hdlr = require('./handlers/pages.js'),
    user_hdlr = require('./handlers/users.js'),
    album_hdlr = require('./handlers/albums.js');


var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true }));
app.use(express.static(__dirname + "/../static"));
app.use(express.cookieParser());
app.use(express.session({
    secret: "it's very secretivie",
    cookie: { maxAge: 86400000 },
    store: new express.session.MemoryStore()
 }));


//     /v1/albums.json
//     /v1/albums/italy2012.json

//     /content/BLAH.html
//     /templates/BLAH.html
//     /pages/home
//     /pages/album/:album_name

app.get("/v1/albums.json", album_hdlr.list_albums);
app.put("/v1/albums.json", requireAPILogin, album_hdlr.create_album);
app.get("/v1/albums/:album_name.json", album_hdlr.get_album);
app.get("/v1/albums/:album_name/photos.json", album_hdlr.photos_for_album);
app.put("/v1/albums/:album_name/photos.json", requireAPILogin, album_hdlr.add_photo_to_album);

app.put("/v1/users.json", user_hdlr.register);


app.get("/pages/:page_name", requirePageLogin, page_hdlr.serve_page);
app.get("/pages/:page_name/:sub_page", requirePageLogin, page_hdlr.serve_page);
app.post("/service/login", user_hdlr.login);


app.get("*", function (req, res) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "unknown_resource" }));
});





function requirePageLogin(req, res, next) {
    if (req.params && req.params.page_name == 'admin') {
        if (req.session && req.session.logged_in) {
            next();
        } else {
            res.redirect("/pages/login");
        }
    } else
        next();
}


// Authorization: Basic AFJuadhh0872h38hfasdZDFDSJFk==

function requireAPILogin(req, res, next) {
    // if they're using the API from the browser, then they'll be auth'd
    if (req.session && req.session.logged_in) {
        next();
        return;
    }
    var rha = req.headers.authorization;
    if (rha && rha.search('Basic ') === 0) {
        var creds = new Buffer(rha.split(' ')[1], 'base64').toString();
        var parts = creds.split(":");
        user_hdlr.authenticate_API(
            parts[0],
            parts[1],
            function (err, resp) {
                if (!err && resp) {
                    next();
                } else
                    need_auth(req, res);
            }
        );
    } else
        need_auth(req, res);
}

function need_auth(req, res) {
    res.header('WWW-Authenticate',
               'Basic realm="Authorization required"');
    if (req.headers.authorization) {
        // no more than 1 failure / 5s
        setTimeout(function () {
            res.send('Authentication required\n', 401);
        }, 5000);
    } else {
        res.send('Authentication required\n', 401);
    }
}







require('./data/db.js').init(function (err, results) {
    if (err) {
        console.error(err);
        console.error("FATAL DYING");
        process.exit(-1);
    } else {
        app.listen(8080);
    }
});




