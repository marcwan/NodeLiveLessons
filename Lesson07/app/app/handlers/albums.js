
var fs = require('fs'),
    helpers = require('./helpers.js');

exports.version = "0.1.0";

exports.list_albums = function (req, res) {
    load_album_list(function (err, albums) {
        if (err != null) {
            helpers.send_failure(res, 503, err);
            return;
        }

        helpers.send_success(res, { albums: albums });
    });
}

exports.get_album = function (req, res) {

    var album_name = req.params.album_name;

    var page = req.query.page;
    var page_size = req.query.page_size;

    if (isNaN(page) || page <= 0) page = 0;
    if (isNaN(page_size) || page_size <= 0) page_size = 250;

    load_album(album_name, page, page_size, function (err, photos) {
        if (err != null) {
            helpers.send_failure(res, 503, err);
            return;
        }

        helpers.send_success(res, { album: { album_name: album_name, photos: photos }});
    });
}



function load_album_list (callback) {
    fs.readdir('../static/albums/', function (err, file_list) {
        if (err) {
            callback(err);
            return;
        }

        var dirs_only = [];
        (function iterator(i) {
            if (i >= file_list.length) {
                callback(null, dirs_only);
                return;
            }

            fs.stat("../static/albums/" + file_list[i], function (err, stats) {
                if (err) {
                    callback(err);
                    return;
                }

                if (stats.isDirectory())
                    dirs_only.push( { album_name: file_list[i],
                                      title: file_list[i] } );

                iterator(i + 1);
            });
        })(0);
    });
}





function load_album (album_name, page, page_size, callback) {
    fs.readdir('../static/albums/' + album_name, function (err, file_list) {
        if (err) {
            callback(err);
            return;
        }

        var files_only = [];
        (function iterator(i) {
            if (i >= file_list.length) {
                var phots = files_only.splice(page * page_size, page_size);
                callback(null, phots);
                return;
            }

            fs.stat("../static/albums/" + album_name + "/" + file_list[i], function (err, stats) {
                if (err) {
                    callback(err);
                    return;
                }

                if (stats.isFile())
                    files_only.push(file_list[i]);

                iterator(i + 1);
            });
        })(0);
    });
}


