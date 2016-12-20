
var async = require('async');


async.auto({
  numbers: function (cb) {
    setTimeout(() => {
      cb(null, [ 1, 2, 3 ]);
    }, 1000);
  },
  letters: function (cb) {
    setTimeout(() => {
      cb(null, [ "a", "b", "c" ]);
    }, 2000);
  },
  assemble: [ 'numbers', 'letters', (thus_far, cb) => {
    cb(null, {
        numbers: thus_far.numbers.join(", "),
        letters: "'" + thus_far.letters.join("', '") + "'"
    });
  }],

}, function (err, results) {
  console.log(err);
  console.log(results);
});



var only_dirs = [];
async.forEachSeries(
  files,
  (element, cb) => {
    fs.stat("albums/" + files[index], (err, stats) => {
      if (stats.isDirectory()) {
        only_dirs.push(files[index]);
      }

      cb(null);
    });
  },

  function (err) {
    // check errors or pass back results.
  }
);
