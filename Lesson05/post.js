var http = require("http"),
    qs = require('querystring');


function handle_incoming_request (req, res) {
  console.log("Incoming request: (" + req.method + ") " + req.url);

  var form_data = '';

  req.on(
    "readable",
    () => {
      var d = req.read();
      if (typeof d == 'string') {
        form_data += d;
      } else if (typeof d == 'object' && d instanceof Buffer) {
        form_data += d.toString('utf8');
      }
    }
  );

  req.on(
    "end",
    () => {
      var output = '';
      if (!form_data || form_data.length == 0) {
        output = "I don't have any form data";
      } else {
        var obj = qs.parse(form_data);
        if (!obj) {
          output = "Awww, no valid form data";
        } else {
          output = "I got valid form data: " + JSON.stringify(obj);
        }
      }

      res.end(output);
    }
  );
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
