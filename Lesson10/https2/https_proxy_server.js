var httpProxy = require("http-proxy"),
    https = require('https'),
    fs = require('fs');

var privateKey = fs.readFileSync("privkey.pem").toString();
var certificate = fs.readFileSync("newcert.pem").toString();

var options = {
  key: privateKey,
  cert: certificate,
};

var proxy_server = httpProxy.createProxyServer({});

var port_number = 8443;
https.createServer(options, function (req, res) {
  proxy_server.web(req, res, { target: "http://localhost:8081" });
}).listen(port_number);
