var fs = require('fs'),
    helpers = require('./helpers.js');

exports.version = "0.1.0";

exports.serve_page = function (req, res) {
  var page = req.params.page_name;

  fs.readFile('basic.html', (err, contents) => {
    if (err) {
      helpers.send_failure(res, 500, err);
    } else {
      contents = contents.toString('utf8');
      contents = contents.replace('{{PAGE_NAME}}', page);
      res.writeHead(200, { "Content-Type" : "text/html" });
      res.end(contents);
    }
  });
}
