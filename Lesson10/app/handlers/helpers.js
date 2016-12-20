
exports.version = "0.1.0";

exports.make_error = function (code, msg) {
  var e = new Error(msg);
  e.code = code;
  return e;
}

exports.make_resp_error = function (err) {
  return JSON.stringify({ code: (err.code) ? err.code : err.name,
                          message: err.message });
}

exports.send_success = function (res, data) {
  res.writeHead(200, { "Content-Type" : "application/json"});
  var output = { error: null, data: data };
  res.end(JSON.stringify(output) + "\n");
}

exports.send_failure = function (res, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  res.writeHead(server_code, { "Content-Type" : "application/json"});
  res.end(make_resp_error(err));
}
