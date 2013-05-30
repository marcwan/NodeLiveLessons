
var http = require('http');


function handle_incoming_request (req, res) {
    console.log("Incoming request: (" + req.method + ") " + req.url);

    var json_data = "";

    req.on(
        "readable",
        function () {
            var d = req.read();
            if (typeof d == 'string')
                json_data += d;
            else if (typeof d == 'object' && d instanceof Buffer)
                json_data += d.toString("utf8");
        }
    );

    req.on(
        "end",
        function () {
            var out = '';
            if (!json_data)
                out = "I got no JSON";
            else {
                var json;
                try {
                    json = JSON.parse(json_data);
                } catch (e) {
                }
                if (!json)
                    out = "Invalid JSON";
                else
                    out = "Valid JSON Data: " + json_data;
            }

            res.end(out);
        }
    );
}



var s = http.createServer(handle_incoming_request);
s.listen(8080);

