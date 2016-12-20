var http = require('http'),
    fs = require('fs'),
    path = require('path');

// /content/* == static content and serve that up!
function handle_incoming_request(req, res) {
  if (req.method.toLowerCase() == 'get'
      && req.url.substring(0, 9) == '/content/') {
    serve_static_file(req.url.substring(9), res);
  } else {
    res.writeHead(404, { "Content-Type" : "application/json"});

    var out = { error: "not_found",
                message: "'" + req.url + "' not found."};
    res.end(JSON.stringify(out) + "\n");
  }
}

function serve_static_file (filename, res) {
  console.log(filename);

  var rs = fs.createReadStream(filename);
  var ct = content_type_for_path(filename);

  res.writeHead(200, { "Content-Type" : ct });

  rs.on(
    "error",
    (err) => {
      res.writeHead(404, { "Content-Type" : "application/json"});
      var out = { error: "not_found" ,
                  message: "'" + filename + "' was not found" };
      res.end(JSON.stringify(out) + "\n");
    }
  );

  rs.pipe(res);
}

function content_type_for_path (filename) {
  var ext = path.extname(filename);
  switch (ext.toLowerCase()) {
    case '.html': return "text/html";
    case '.css': return "text/css";
    case '.jpg': case '.jpeg': return 'image/jpeg';
    default: return "text/plain";
  }
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
