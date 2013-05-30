var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    async = require('async');

var host = 'localhost';
var port = Connection.DEFAULT_PORT;


var db = new Db('PhotoAlbums',
                new Server(host,
                           port,
                           { auto_reconnect: true, poolSize: 20}),
                { w: 1 });


var pix = [
    { filename: "picture_01.jpg",
      albumid: "italy2012",
      description: "rome!",
      date: "2012/02/15 16:20:40" },
    { filename: "picture_04.jpg",
      albumid: "italy2012",
      description: "fontana di trevi",
      date: "2012/02/19 16:20:40" },
    { filename: "picture_02.jpg",
      albumid: "italy2012",
      description: "it's the vatican!",
      date: "2012/02/17 16:35:04" },
    { filename: "picture_05.jpg",
      albumid: "italy2012",
      description: "rome!",
      date: "2012/02/19 16:20:40" },
    { filename: "picture_03.jpg",
      albumid: "italy2012",
      description: "spanish steps",
      date: "2012/02/18 16:20:40" },

    { filename: "photo_05.jpg",
      albumid: "toronto2009",
      description: "something nice",
      date: "2010/06/14 12:21:40" },
    { filename: "photo_01.jpg",
      albumid: "toronto2009",
      description: "cn tower!",
      date: "2010/06/11 12:20:40" },
    { filename: "photo_06.jpg",
      albumid: "toronto2009",
      description: "kitty cats",
      date: "2010/06/14 12:23:40" },
    { filename: "photo_03.jpg",
      albumid: "toronto2009",
      description: "brampton is nice",
      date: "2010/06/12 08:80:40" },
    { filename: "photo_04.jpg",
      albumid: "toronto2009",
      description: "eating poutine",
      date: "2010/06/12 08:34:40" },
    { filename: "photo_02.jpg",
      albumid: "toronto2009",
      description: "mississauga!",
      date: "2010/06/12 07:44:40" },
    { filename: "photo_07.jpg",
      albumid: "toronto2009",
      description: "moo cow oink pig woo!!",
      date: "2010/06/15 12:55:40" },

    { filename: "photo_001.jpg",
      albumid: "australia2010",
      description: "sydney!",
      date: "2010/10/20 07:44:40" },
    { filename: "photo_002.jpg",
      albumid: "australia2010",
      description: "asdfasdf!",
      date: "2010/10/20 08:24:40" },
    { filename: "photo_003.jpg",
      albumid: "australia2010",
      description: "qwerqwr!",
      date: "2010/10/20 08:55:40" },
    { filename: "photo_004.jpg",
      albumid: "australia2010",
      description: "zzzxcv zxcv",
      date: "2010/10/21 14:29:40" },
    { filename: "photo_005.jpg",
      albumid: "australia2010",
      description: "ipuoip",
      date: "2010/10/22 19:08:40" },
    { filename: "photo_006.jpg",
      albumid: "australia2010",
      description: "asdufio",
      date: "2010/10/22 22:15:40" }
];

var a1 = { _id: "italy2012",
           name: "italy2012",
           title: "Visiting Italy in 2012",
           description: "This was a very nice trip ...",
           date: "2012-05-12" };

var a2 = { _id: "australia2010",
           name: "australia2010",
           title: "Australia wedding!",
           description: "Lovely time there  ...",
           date: "2010-10-20" };

var a3 = { _id: "toronto2009",
           name: "toronto2009",
           tilte: "home sweet home",
           description: "you can never go home again.",
           date: "2009-04-15" };



var albums, photos;


async.waterfall([

    function (cb) {
        db.collection("Albums", cb);
    },

    function (albums_coll, cb) {
        albums = albums_coll;

        db.collection("Photos", cb);
    },

    function (photos_coll, cb) {
        photos = photos_coll;

        albums.insert(a1, { safe : true }, cb);
    },

    function (doc, cb) {
        albums.insert([ a2, a3 ], { safe: true}, cb);
    },

    function (docs, cb) {
        albums.update({ _id: "toronto2009" },
                      { $rename: { "tilte": "title" }},
                      { safe: true},
                      cb);
    },

    function (doc, stats, cb) {
        for (var i = 0; i < pix.length; i++) {
            pix[i]._id = pix[i].albumid + "_" + pix[i].filename;
        }

        photos.insert(pix, {safe: true }, cb);
    },

    function (docs, cb) {
        console.log(" --------------- ");

        var s = photos.find({ albumid: "italy2012" })
            .sort({ date: -1 })
            .skip(2)
            .limit(3)
            .stream();
        s.on(
            "data",
            function (item) {
                console.log(item);
            }
        );
        s.on(
            "end",
            function () {
                cb(null);
            }
        );
    },

],
// results function
function (err, results) {

    if (err && err.code == 11000) {
        console.log("Dupe _id!!!");
    }        
    db.close();
});

