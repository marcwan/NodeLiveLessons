var http = require("http");

function process_request(req, res) {
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);

  res.writeHead(200, { 'Content-Type' : 'application/json' });

  res.end(JSON.stringify({ error: null, data: {} }));
}

var s = http.createServer(process_request);
s.listen(8080);
