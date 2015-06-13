
var express = require("express");
var mongoose = require("mongoose");
var dataHandler=require("./DataHandler.js");
var passport = require("passport");

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

};
