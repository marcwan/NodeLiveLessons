
var request = require('request');


var h = "http://localhost:8080";


exports.test1 = function (test) {

    request.get(h + "/v1/albums.json", function (err, resp, body) {
        test.expect(5);

        test.equals(err, null);
        test.equals(resp.statusCode, 200);
        var b = JSON.parse(body);
        test.equals(b.error, null);
        test.notEqual(b.data.albums, undefined);
        test.equals(b.data.albums.length, 0);

        test.done();
    });
};