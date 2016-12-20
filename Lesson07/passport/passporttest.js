var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    bodyParser = require("body-parser"),
    flash = require("express-flash");

var app = express();

app.use(flash());
app.use(session({
    secret: "cat_on_keyboard",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }         // development only
}));
app.use(cookieParser("cat_on_keyboard"));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 1. store user names and passwords
var users = {
  "id123" : { id: 123, username: "marcwan", password: "boo" },
  "id1" : { id: 1, username: "admin", password: "admin" }
};

// 2. configure passport-local to validate an incoming username + pw
passport.use(new LocalStrategy(
  function (username, password, done) {
    for (userid in users) {
      var user = users[userid];
      if (user.username.toLowerCase() == username.toLowerCase()) {
        if (user.password == password) {
          return done(null, user);
        }
      }
    }

    return done(null, false, { message: "Incorrect credentials." });
  }
));

// 3. serialise users
passport.serializeUser(function (user, done) {
  if (users["id" + user.id]) {
    done(null, "id" + user.id);
  } else {
    done(new Error("CANT_SERIALIZE_THIS_USER"));
  }
});

// 4. de-serialise users.
passport.deserializeUser(function (userid, done) {
    if (users[userid]) {
      done(null, users[userid]);
    } else {
      done(new Error("THAT_USER_DOESNT_EXIST"));
    }
});




app.get('/', function (req, res) {
    console.log(req.flash());
    res.send('<a href="/login">Login Here</a>');
});

app.get("/login", function (req, res) {
    var error = req.flash("error");
    var form = '<form action="/login" method="post">' +
        '    <div>' +
        '        <label>Username:</label>' +
        '        <input type="text" name="username"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Password:</label>' +
        '        <input type="password" name="password"/>' +
        '    </div>' +
        '    <div>' +
        '        <input type="submit" value="Log In"/>' +
        '    </div>' +
        '</form>';

    if (error && error.length) {
        form = "<b> " + error[0] + "</b><br/>" + form;
    }

    res.send(form);
});

app.post("/login", passport.authenticate('local', {
    successRedirect: "/members",
    failureRedirect: "/login",
    successFlash: { message: "welcome back!" },
    failureFlash: true
}));

app.get("/members", authenticatedOrNot, function (req, res) {
  console.log(req.flash("success"));
  res.end("Secret members area only!");
});

function authenticatedOrNot (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.listen(8080);
