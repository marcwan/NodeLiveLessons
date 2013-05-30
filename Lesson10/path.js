

var path = require('path');



var components = [ '..', '..', 'static', 'images', 'thumbnails' ];

console.log(components.join(path.sep));


if (process.platform == 'win32') {
// do something
} else {
// dom sething
}

