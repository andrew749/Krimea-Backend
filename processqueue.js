
var mongoose = require("mongoose"),
  Event = mongoose.model("Event"),
  request = require("request");

var GOOGLE_API_KEY="AIzaSyCziJOPX6kThSjn7nlY36ZDjqTKbt-Sg4g";

var parseAddressFromTweet = function(text) {
  // We need to support these possibilities:
  // ... at King / University ..
  // ... at King/University ...
  // ... on King at University ...
  
  var ADDRESS_STARTERS = [
    "at",
    "on",
  ];
  
  for (var i=0; i<ADDRESS_STARTERS; i++) {
    var ADDRESS_STARTER = ADDRESS_STARTERS[i];
    
    if (text.indexOf(ADDRESS_STARTERS) > -1) {
      var address_parsing_regex = "/"+ADDRESS_STARTER+"/";
    }
  }
};

var processTweet = function(tweet) {
  var CRIME_TYPES=[
    "assault",
    "robbery",
    "collision",
    "stabbing",
    "homicide",
    "shooting",
    "shots fired",
    "rape",
  ];
    
  var text = tweet.text.toLowerCase();
  var address = parseAddressFromTweet(text);
  console.log("Address: %s", address);
  var crimeType = null;
  
  for (var i=0; i<CRIME_TYPES.length; i++) {
    var CRIME_TYPE = CRIME_TYPES[i];
    if (text.indexOf(CRIME_TYPE) > -1) {
      crimeType = CRIME_TYPE;
    }
  };
  
  if (crimeType == null || address == null) {
    return null;
  };
  
  return {
    crimeType: crimeType,
    address: address
  };
};

module.exports = function(queue) {
  queue.process("tweet", function(tweet, done){
    
    var tweetObj = processTweet(tweet);
    
    if (tweetObj == null || tweetObj == undefined) {
      console.log("Tweet %s wasn't a crime tweet", tweet.text)
      done();
      return;
    }
    
    var request_url = "";
    var event = Event({
      crimeType: tweetObj.crimeType,
      lat: 0,
      lon: 0,
      description: tweet.text,
      time: new Date(tweet.created_at),
    });
    
    event.save(function(err){
      done();
    });
    
  });
};