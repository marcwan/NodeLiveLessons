var fs = require('fs');

function FileObject() {
  this.filename = '';

  // callback: (err, boolean)
  this.file_exists = function (callback) {
    console.log("About to open: " + this.filename);
    fs.open(this.filename, 'r', (err, handle) => {
      if (err) {
        console.log("Can't open: " + this.filename);
        callback(err);
        return;
      }

      fs.close(handle);
      callback(null, true);
    });
  }
}

var fo = new FileObject();
fo.filename = "something thiopahst ioahsdf poiasdjfoasd";
fo.file_exists((err, exists) => {
  if (err) {
    console.log("error opening file: " + JSON.stringify(err));
    return;
  }
});
