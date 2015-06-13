
var express = require("express");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var dataHandler=require("./DataHandler.js");
var passport = require("passport");
var bcrypt = require("bcrypt");
var promisify = require("./promisify");

module.exports = function(app) {
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

  app.get("/user/:user_id/panic/:panic_id", function(req, res){
      var events=[];
      Event.find(function(err,result){
          for (x in result){
            events.push(result[x]);
          }
          res.render('mapdisplay.html',events);
      }).where('_id':req.param.panic_id);
  });

  var panic_router = express.Router();
  panic_router.use(passport.authenticate('basic', {session: false}));

  panic_router.post("/", function(req, res){
    req.user.panics.push({
      time: new Date(req.body.time),
      active: false
    });

    promisify(req.user, 'save')
      .then(function(user){
        res.send({success: 1});
      });
  });

  panic_router.post("/:panic_id/update", function(req, res){
    var lat = req.body.lat,
      lon = req.body.lon;

    var location = {
      lat: req.body.lat,
      lon: req.body.lon,
      date: new Date()
    };

    req.user.location.push(location);

    promisify(req.user, 'save')
      .then(function(user){
        res.send({success: 1});
      });
  });

  app.use("/panic", panic_router);

};
