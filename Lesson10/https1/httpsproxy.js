
var http_proxy = require('http-proxy'),
    https = require('https'),
    fs = require('fs');

var privateKey = fs.readFileSync("privkey.pem").toString();
var cert       = fs.readFileSync("newcert.pem").toString();

var options = { key: privateKey, cert: cert };

var proxy = new http_proxy.HttpProxy({
    target: {
        host: "localhost",
        port: 8080
    }
});

var s = https.createServer(options, function (req, res) {
    console.log("proxying!");
    proxy.proxyRequest(req, res);
});

s.listen(8443);
