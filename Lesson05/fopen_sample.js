
var fs = require('fs'),
    async = require('async');


function load_file_contents(path, callback) {
    var f;
    async.waterfall([
        function (cb) {
            fs.open(path, 'r', cb);
        },

        function (handle, cb) {
            f = handle;
            fs.fstat(f, cb);
        },

        function (stats, cb) {
            if (stats.isFile()) {
                var content = '';
                var b = new Buffer(10000);
                var bytes_read = -1;
                async.whilst(
                    function () { return bytes_read != 0; },
                    function (cb) {
                        fs.read(f, b, 0, 10000, null, function (err, br, buffer) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            bytes_read = br;
                            if (br > 0)
                                content += b.toString('utf8', 0, br);
                            cb(null);
                        });
                    },

                    function (err, results) {
                        cb(err, content);
                    }
                );
                    
            } else {
                cb(make_error("not_a_file", "can't read it"));
            }
        },

        function (file_contents, cb) {
            fs.close(f, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, file_contents);
                }
            });
        }
    ],
    function (err, results) {
        callback(err, results);
    });
}



load_file_contents(
    "test.txt", 
    function (err, contents) {
        if (err)
            console.log(err);
        else
            console.log(contents);
    }
);


function make_error(err, msg) {
    var e = new Error(msg);
    e.code = msg;
    return e;
}

