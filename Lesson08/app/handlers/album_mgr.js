var fs = require('fs'),
    helpers = require("./helpers.js");

exports.version = "0.1.0";

exports.album_list = function (req, res) {
  load_album_list((err, albums) => {
    if (err) {
      helpers.send_failure(res, 500, { code: "cant_load_albums",
                                       message: err.message });
    } else {
      helpers.send_success(res, { albums: albums });
    }
  });
}

exports.load_album = function (req, res) {
  var getp = req.query;
  var page_num = getp.page ? parseInt(getp.page) - 1 : 0;
  var page_size = getp.page_size ? parseInt(getp.page_size) : 1000;

  if (isNaN(page_num)) page_num = 0;
  if (isNaN(page_size)) page_size = 1000;

  var album_name = req.params.album_name;

  // user is requesting contents of an album
  load_album(album_name, page_num, page_size, (err, photos) => {
    if (err) {
      helpers.send_failure(res, 500, err);
    } else {
      helpers.send_success(res, photos);
    }
  });
}


function load_album_list (callback) {
  fs.readdir("albums", (err, files) => {
    if (err) {
      callback(err);
    } else {
      var only_dirs = [];

      var iterator = (index) => {
        if (index == files.length) {
          callback(null, only_dirs);
          return;
        }

        fs.stat("albums/" + files[index], (err, stats) => {
          if (stats.isDirectory()) {
            only_dirs.push({ album_name: files[index],
                             title: files[index] });
          }

          iterator(index + 1);
        });
      };

      iterator(0);
    }
  });
}

function load_album(album_name, page, page_size, callback) {
  fs.readdir("albums/" + album_name, (err, files) => {
    if (err) {
      if (err.code == "ENOENT") {
        callback(helpers.make_error("no_such_album", "That album doesn't exist."));
      } else {
        callback(helpers.make_error("cant_load_photos", "The server is broken."));
      }
    } else {
      var only_files = [];

      var path = `albums/${album_name}/`;

      var iterator = (index) => {
        if (index == files.length) {
          var start = page * page_size;
          var output = only_files.slice(start, start + page_size);
          var obj = { short_name : album_name,
                      photos : output };
          callback(null, obj);
          return;
        }

        fs.stat(path + files[index], (err, stats) => {
          if (!err && stats.isFile()) {
            only_files.push(files[index]);
          }

          iterator(index + 1);
        });
      };

      iterator(0);
    }
  });
}
