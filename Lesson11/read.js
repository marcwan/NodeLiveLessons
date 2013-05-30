
var crypto = require('crypto');


process.stdout.write("> ");

process.stdin.on(
    "readable",
    function () {
        var d  = process.stdin.read();
        if (d && d == "\n") {
            process.stdin.pause();
        } else if (d) {
            var h = crypto.createHash("md5");
            var s = h.update(d).digest('hex');
            console.log(s);
            process.stdout.write("> ");
        }
    }
);


process.stdin.setEncoding("utf8");
process.stdin.resume();
