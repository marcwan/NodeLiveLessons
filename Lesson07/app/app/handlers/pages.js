
var fs = require('fs');

exports.version = "0.1.0";

exports.serve_page = function (req, res) {
    var page_name = req.params.page_name;
    fs.readFile('basic.html', 'utf8', function (err, contents) {
        if (err) {
            res.writeHead(503, { "Content-Type": "text/html" });
            res.end("OH noes, server is very unhappy, cant' load stub");
            return;
        }

        res.writeHead(200, {"Content-Type": "text/html" });
        res.end(contents.replace("{{PAGE_NAME}}", page_name));
    });
}

