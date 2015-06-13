
var mongoose = require("mongoose");

module.exports = function() {
  var User = {
    name: String,
    email: String,
    password: String,
    location: [
      {
        lat: Number,
        lon: Number,
        time: Date,
      }
    ],
    panics: [
      {
        time: Date,
        active: Boolean,
      }
    ]
  };

  mongoose.model("User", User);
}
