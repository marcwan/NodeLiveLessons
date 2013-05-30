
process.stdin.on(
    "readable",
    function () {
        var d = process.stdin.read();
        if (d) {
            console.log("You hit: " + d + " RawMode is: " + process.stdin.isRaw);
        }
    }
);

process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);
process.stdin.resume();
