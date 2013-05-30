
var http_proxy = require("http-proxy"),
    fs = require('fs');

var servers = JSON.parse(fs.readFileSync('server_list.json')).servers;


var s = http_proxy.createServer(function (req, res, proxy) {
    var target = servers.shift();
    proxy.proxyRequest(req, res, target);
    servers.push(target);
});

s.listen(8080);