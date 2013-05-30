
var exec = require('child_process').exec;

if (process.argv.length != 3) {
    console.log("What am I supposed to do?");
    process.exit(-1);
}

var cmd = process.platform == 'win32' ? 'type' : 'cat';

exec(cmd + " " + process.argv[2], function (error, stdout, stderr) {

    console.log(stdout.toString("utf8"));
    console.log(stderr.toString("utf8"));

    if (error) {
        console.log("ERROR:");
        console.log(error);
    }
});

