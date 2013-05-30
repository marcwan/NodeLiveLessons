

exports.test1 = function (test) {
    setTimeout(function () {
        test.ok(true);
        test.done();
    }, 2000);
};

exports.test2 = function (test) {
    setTimeout(function () {
        test.ok(true);
        test.done();
    }, 1000);
};

