
var express = require("express");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var dataHandler=require("./DataHandler.js");
var passport = require("passport");
var bcrypt = require("bcrypt");
var promisify = require("./promisify");
var assert = require("assert");

module.exports = function(app, io) {
  app.get("/", function(req, res){
      console.log("got request");
      console.log(req.query.lat," ",req.query.lon);
      var location={lat:req.query.lat, lon:req.query.lon};
      var locations= dataHandler.getDataForLocation(location,res);
  });

  app.get("/login", passport.authenticate('basic', {session: false}), function(req, res){
    res.send({logged_in: 1, user: req.user});
  });

  app.post("/signup", function(req, res){
    promisify(bcrypt, 'hash', req.body.password, 10)
      .then(function(password){
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = password;
        return promisify(user, 'save');
      })
      .then(function(user){
        res.send({success: 1, user: user._id});
      });
  });

  app.get("/panic/:panic_id", function(req, res){
    res.sendFile(__dirname + '/webui/mapdisplay.html');
  });

  app.get("/panic/:panic_id/locations", function(req, res){
    var locations=[];
    promisify(User, 'find', {'panics._id':req.params.user_id})
      .then(function(result){
        if (result.length > 0) {
          result[0].location.forEach(function(e){
            locations.push(e);
          });
        }
        res.send({locations: locations});
      })
      .catch(function(err){
        console.log(err);
      });
  });

  var panic_router = express.Router();
  panic_router.use(passport.authenticate('basic', {session: false}));

  panic_router.post("/", function(req, res){
    req.user.panics.push({
      time: new Date(req.body.time),
      active: true
    });
    // get panic id
    var panic = null;

    req.user.panics.forEach(function(_panic){
      if (_panic.isNew) {
        panic = _panic;
      }
    });
    var id = panic._id;

    promisify(req.user, 'save')
      .then(function(user){
        res.send({success: 1, _id: id});
      });
  });

  panic_router.post("/:panic_id/update", function(req, res){
    var lat = req.body.lat,
      lon = req.body.lon;

    var location = {
      lat: req.body.lat,
      lon: req.body.lon,
      time: new Date()
    };
    console.log(lat,lon);
    req.user.location.push(location);

    var location = null;

    req.user.location.forEach(function(_location){
      if (_location.isNew) {
        location = _location;
      }
    });

    promisify(req.user, 'save')
      .then(function(user){
        res.send({success: 1});
        io.to(req.params.panic_id).emit('newlocation', {location: location});
      });
  });

  panic_router.post("/:panic_id/allclear", function(req, res){
    var panicIndex = null;

    req.user.panics.forEach(function(_panic, index){
      if (_panic._id == req.params.panic_id) {
        panicIndex = index;
      }
    });

    req.user.panics[panicIndex].active = false;

    promisify(req.user, 'save')
      .then(function(user){
        res.send({success: 1});
        io.to(req.params.panic_id).emit('allclear');
      });

  });

  app.use("/panic", panic_router);

  io.on('connection', function(socket){

    socket.join(socket.handshake.query.panic_id);
  });

};
