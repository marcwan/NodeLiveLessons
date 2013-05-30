
var fs = require('fs');

function load_file_contents(filename, callback) {

    var rs = fs.createReadStream(filename);

    var file_contents = '';

    rs.on(
        'readable',
        function (d) {
/            var d = rs.read();
            if (d) {
                if (typeof d == 'string') {
                    file_contents += d;
                } else if (typeof d == 'object' && d instanceof Buffer) {
                    file_contents += d.toString('utf8');
                }
            }
        }
    );

    rs.on(
        'end',
        function () {
            callback(null, file_contents);
        }
    );

    rs.on(
        'error',
        function (err) {
            console.log("whoops");
            callback(err);
        }
    );
}


load_file_contents('test.doc', function (err, results) {
    if (err)
        console.log(err);
    else
        console.log(results);
});

