
var Twit = require("Twit");

var T = new Twit({
    consumer_key:         'kR0Fl1ODDg7ERB8jxie55qDHi'
  , consumer_secret:      'JisSteYQx2LileFDe0DuBaJ8rT0q9rl8oQxZFXWQFtsVg3aSAT'
  , access_token:         '176364951-SunYnyX8FKIkzgIl75QoSf7OKwVnYDeKw14yhGve'
  , access_token_secret:  'CBxXikBbL5qSgdAR84qWrpJGClwVRm6Zw12REMDWvMyAr'
});

var kue = require("kue"),
  queue = kue.createQueue();

var TWITTER_ACCOUNT="TorontoPolice";
var TWITTER_CITY = "Toronto";

var addJob = function(tweet){
  var job = queue.create("tweet", {
    account: TWITTER_ACCOUNT,
    text: tweet.text,
    created_at: tweet.created_at,
  });
    
  job.save();
}

if (process.argv.indexOf("--initial") > -1) {
  // Do an initial setup by populating kue jobs with the last 100 tweets
  
  T.get("statuses/user_timeline", {user_id: TWITTER_ACCOUNT,count: 100}, function(err, data, response){
    data.forEach(addJob);
  });
}


var stream = T.stream('statuses/filter', {track: TWITTER_ACCOUNT});

stream.on('tweet', function(tweet){
  addJob(tweet);
});

require("./processqueue")(queue);

