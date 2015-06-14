
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyparser = require('body-parser');
var io = require("socket.io")(server);

mongoose.connect('mongodb://localhost/krimea');

//app.set('view engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use('/static', express.static(__dirname + '/static'));

mongoose.connection.once('open', function(){
  require("./models")();
  require("./auth")(app);
  require("./routes")(app, io);
});

server.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
