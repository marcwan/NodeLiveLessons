var http = require("http"),
    fs = require('fs'),
    url = require('url')
    path = require('path');

// albums.json         -- return all albums
// albums/*NAME*.json  -- return list of photos in the albums.
// content/something.ext
// templates/some_file.html
// pages/some_page_name                  / /[optional_junk]

function load_album_list (callback) {
  fs.readdir("albums", (err, files) => {
    if (err) {
      callback(err);
    } else {
      var only_dirs = [];

      var iterator = (index) => {
        if (index == files.length) {
          callback(null, only_dirs);
          return;
        }

        fs.stat("albums/" + files[index], (err, stats) => {
          if (stats.isDirectory()) {
            only_dirs.push({ album_name: files[index],
                             title: files[index] });
          }

          iterator(index + 1);
        });
      };

      iterator(0);
    }
  });
}

function load_album(album_name, page, page_size, callback) {
  fs.readdir("albums/" + album_name, (err, files) => {
    if (err) {
      if (err.code == "ENOENT") {
        callback(make_error("no_such_album", "That album doesn't exist."));
      } else {
        callback(make_error("cant_load_photos", "The server is broken."));
      }
    } else {
      var only_files = [];

      var path = `albums/${album_name}/`;

      var iterator = (index) => {
        if (index == files.length) {
          var start = page * page_size;
          var output = only_files.slice(start, start + page_size);
          var obj = { short_name : album_name,
                      photos : output };
          callback(null, obj);
          return;
        }

        fs.stat(path + files[index], (err, stats) => {
          if (!err && stats.isFile()) {
            only_files.push(files[index]);
          }

          iterator(index + 1);
        });
      };

      iterator(0);
    }
  });
}


function handle_incoming_request(req, res) {

  req.parsed_url = url.parse(req.url, true);
  var core_url = req.parsed_url.pathname;
  console.log("INCOMING REQUEST: " + req.method + " " + core_url);

// don't forget /pages/home
  if (core_url.substring(0, 7) == '/pages/') {
    serve_page(req, res);
  } else if (core_url.substring(0, 9) == '/content/') {
    serve_static_file("content/" + core_url.substring(9), res);
  } else if (core_url.substring(0, 11) == '/templates/') {
    serve_static_file("templates/" + core_url.substring(11), res);
  } else if (core_url == '/albums.json') {
    handle_load_album_list(req, res);
  } else if (core_url.substr(0, 7) == '/albums'
             && core_url.substr(core_url.length - 5) == '.json') {
    handle_load_album(req, res);
  } else {
    send_failure(res, 404, { code: "no_such_page", message: "No such page"});
  }
}

function handle_load_album_list (req, res) {
  load_album_list((err, albums) => {
    if (err) {
      send_failure(res, 500, { code: "cant_load_albums",
                               message: err.message });
    } else {
      send_success(res, { albums: albums });
    }
  });
}

function handle_load_album (req, res) {

  var getp = req.parsed_url.query;
  var page_num = getp.page ? parseInt(getp.page) - 1 : 0;
  var page_size = getp.page_size ? parseInt(getp.page_size) : 1000;

  if (isNaN(page_num)) page_num = 0;
  if (isNaN(page_size)) page_size = 1000;

  var core_url = req.parsed_url.pathname;

  // user is requesting contents of an album
  load_album(core_url.substr(7, core_url.length - 12), page_num, page_size, (err, photos) => {
    if (err) {
      send_failure(res, 500, err);
    } else {
      send_success(res, photos);
    }
  });
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);





function serve_static_file (filename, res) {
  console.log(filename);

  var rs = fs.createReadStream(filename);
  var ct = content_type_for_path(filename);

  res.writeHead(200, { "Content-Type" : ct });

  rs.on(
    "error",
    (err) => {
      res.writeHead(404, { "Content-Type" : "application/json"});
      var out = { error: "not_found" ,
                  message: "'" + filename + "' was not found" };
      res.end(JSON.stringify(out) + "\n");
    }
  );

  rs.pipe(res);
}

function serve_page(req, res) {
  var page = get_page_name(req);

  fs.readFile('basic.html', (err, contents) => {
    if (err) {
      send_failure(res, 500, err);
    } else {
      contents = contents.toString('utf8');
      contents = contents.replace('{{PAGE_NAME}}', page);
      res.writeHead(200, { "Content-Type" : "text/html" });
      res.end(contents);

    }
  });
}

function content_type_for_path (filename) {
  var ext = path.extname(filename);
  switch (ext.toLowerCase()) {
    case '.js': return "application/json";
    case '.html': return "text/html";
    case '.css': return "text/css";
    case '.jpg': case '.jpeg': return 'image/jpeg';
    default: return "text/plain";
  }
}


function make_error(code, msg) {
  var e = new Error(msg);
  e.code = code;
  return e;
}

function make_resp_error (err) {
  return JSON.stringify({ code: (err.code) ? err.code : err.name,
                          message: err.message });
}

function send_success(res, data) {
  res.writeHead(200, { "Content-Type" : "application/json"});
  var output = { error: null, data: data };
  res.end(JSON.stringify(output) + "\n");
}

function send_failure(res, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  res.writeHead(server_code, { "Content-Type" : "application/json"});
  res.end(make_resp_error(err));
}

function get_page_name(req) {
  var core_url = req.parsed_url.pathname;
  var parts = core_url.split('/');
  return parts[2];
}
