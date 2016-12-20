var fs = require('fs');


var contents = '';

var rs = fs.createReadStream("test.txt");

rs.on(
  "readable",
  () => {
    var str;
    var d = rs.read();
    if (d) {
      if (typeof d == 'string') {
        str = d;
      } else if (typeof d == 'object' && d instanceof Buffer) {
        str = d.toString('utf8', 0, d.length);
      }

      if (str) {
        contents += str;
      }
    }
  }
);

rs.on(
  "end",
  () => {
    console.log("Read in the file contents: ");
    console.log(contents.toString("utf8"));
  }
);

rs.on(
  "error",
  (err) => {
    console.log("I got an error reading the stream: " + JSON.stringif(err));
  }
);
