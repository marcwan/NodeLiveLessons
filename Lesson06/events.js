var events = require('events');

function Downloader () {
}

Downloader.prototype = new events.EventEmitter();
Downloader.prototype.__proto__ = events.EventEmitter.prototype;
Downloader.prototype.url = null;
Downloader.prototype.download = function (path) {
  var self = this;
  self.url = path;
  self.emit('start', path);
  setTimeout(function () {
    self.emit('end', "simulated_contentsyaaay!");
  }, 2000);
}

var d = new Downloader();
d.on(
  "start",
  (path) => {
    console.log("Started downloading: " + path);
  }
);

d.on(
  "end",
  (contents) => {
    console.log("I downloaded the file and got: \n" + contents);
  }
);

d.download("http://example.org");
