
var mongoose = require("mongoose");
module.exports = function(){
  var Event = {
    lat: Number,
    lon: Number,
    type: String,
    description: String,
    link: String,
    time: Date,
  };

  mongoose.model("Event", Event);
}
