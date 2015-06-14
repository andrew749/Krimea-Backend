
var passport = require("passport"),
  BasicStrategy = require('passport-http').BasicStrategy;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var bcrypt = require("bcrypt");

passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, function(err, res){
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));


module.exports = function(app) {
  app.use(passport.initialize());
}
