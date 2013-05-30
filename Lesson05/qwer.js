

async.parallel({
    'database': function (cb) {
        dbquery("SELECT * FROM Users WHere userid = ?", ...);
        cb(null, dbresults);
    },
    'file': function (cb) {
        file_get_contents(userid + "_profilepic.jpg",...);
        cb(null, fileresults);
    },
    'tag_memcache': function (cb) {
        mecached.get_tag_cloud(userid);
        cb(null, cachresults);
    }
},
function (err, results) {
    if (err)
        printerror();
    else {
        { database: /* db results */, file: /*file results */, tag_memcache: /* memcachresults */  }
    }
});

async.auto({
    'database': function (cb) {
        dbquery("SELECT * FROM Users WHere userid = ?", ...);
        cb(null, dbresults);
    },
    'file': function (cb) {
        file_get_contents(userid + "_profilepic.jpg",...);
        cb(null, fileresults);
    },
    'tag_memcache': [ 'database', 'file', function (cb, current_results_so_far) {
        mecached.get_tag_cloud(userid);
        cb(null, cachresults);
    }]
},
function (err, results) {
    if (err)
        printerror();
    else {
        { database: /* db results */, file: /*file results */, tag_memcache: /* memcachresults */  }
    }
});
