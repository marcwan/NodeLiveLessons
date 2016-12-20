var mysql = require('mysql'),
    async = require('async');

var host = "localhost";
var database = "PhotoAlbums";
var username = "root";
var password = "";

var dbpool;


var a1 = {
           name: "italy2012",
           title: "Visiting Italy in 2012",
           description: "This was a very nice trip ...",
           date: "2012-05-12" };

var a2 = {
           name: "australia2010",
           title: "Australia wedding!",
           description: "Lovely time there  ...",
           date: "2010-10-20" };

var a3 = {
           name: "japan2010",
           title: "A trip to Kyoto and Tokyo",
           description: "What a funcountry!",
           date: "2010-04-15" };

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
                 albumid: "japan2010",
                 description: "something nice",
                 date: "2010/06/14 12:21:40" },
               { filename: "photo_01.jpg",
                 albumid: "japan2010",
                 description: "tokyo tower!",
                 date: "2010/06/11 12:20:40" },
               { filename: "photo_06.jpg",
                 albumid: "japan2010",
                 description: "kitty cats",
                 date: "2010/06/14 12:23:40" },
               { filename: "photo_03.jpg",
                 albumid: "japan2010",
                 description: "kyoto is nice",
                 date: "2010/06/12 08:50:40" },
               { filename: "photo_04.jpg",
                 albumid: "japan2010",
                 description: "eating suhi",
                 date: "2010/06/12 08:34:40" },
               { filename: "photo_02.jpg",
                 albumid: "japan2010",
                 description: "osaka!",
                 date: "2010/06/12 07:44:40" },
               { filename: "photo_07.jpg",
                 albumid: "japan2010",
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


async.waterfall([
    function (cb) {
        dbpool = mysql.createPool({
          connectionLimit: 200,
          host: host,
          user: username,
          password: password,
          database: database,
        });
        cb(null);
    },

    function (cb) {
      dbpool.query(
        "INSERT INTO Albums VALUES (?, ?, ?, ?)",
        [ a1.name, a1.title, a1.date, a1.description ],
        cb);
    },

    function (results, fields, cb) {
      dbpool.query(
        "INSERT INTO Albums VALUES (?, ?, ?, ?)",
        [ a2.name, a2.title, a2.date, a2.description ],
        cb);
    },

    function (results, fields, cb) {
      dbpool.query(
        "INSERT INTO Albums VALUES (?, ?, ?, ?)",
        [ a3.name, a3.title, a3.date, a3.description ],
        cb);
    },

    function (results, fields, cb) {
      var q = "\
INSERT INTO Photos (filename, album_name, description, date) \
       VALUES (?, ?, ?, ?)";

       async.forEachSeries(
         pix,
         function (item, callbk) {
           dbpool.query(q,
             [ item.filename, item.albumid,
               item.description, item.date ],
             callbk);
         },
         cb
       )
    },

    function (cb) {
      dbpool.query(
        "UPDATE Photos SET description = ? \
        WHERE album_name = ? AND filename = ?",
        [ "Less Stupid Description", "australia2010", "photo_006.jpg" ],
        cb);
    },

    function (results, fields, cb) {
      dbpool.query(
        "DELETE FROM Photos WHERE album_name = ? \
        AND filename = ?",
        [ "australia2010", "photo_006.jpg"],
        cb);
    },

    function (results, fields, cb) {
      console.log(results);
      dbpool.query("SELECT * FROM Albums", [], cb);
    },

    function (rows, fields, cb) {
      for (var i = 0; i < rows.length; i++) {
        console.log(JSON.stringify(rows[i]));
      }
      cb(null);
    },

    function (cb) {
      var q = "\
SELECT * FROM Photos \
         WHERE album_name = ? AND filename LIKE ?";

      dbpool.query(q, [ "japan2010", '%01%' ], cb);
    },

    function (rows, fields, cb) {
      console.log("I got " + rows.length + " rows");
      for (var i = 0; i < rows.length; i++) {
        console.log(JSON.stringify(rows[i]));
      }
      cb(null);
    }
],

function (err, results) {
  console.log(err);
  console.log(results);
  console.log("WUPWUP!");
});
