
exports.version = "0.5.0";


exports.send_failure = function (res, http_code, err) {
    var code = err.code ? err.code : err.name;
    res.writeHead(http_code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
};

exports.send_success = function (res, data) {
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: null, data: data }) + "\n");
};
