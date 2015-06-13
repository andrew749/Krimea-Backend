
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

  app.get("/login", passport.authenticate('local'), function(req, res){
    res.send({success: 1, user: req.user});
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

};
