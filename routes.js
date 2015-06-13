
var express = require("express");
var mongoose = require("mongoose");
var dataHandler=require("./DataHandler.js");
module.exports = function(app) {
  app.get("/", function(req, res){
      console.log("got request");
      console.log(req.query.lat," ",req.query.lon);
      var location={lat:req.query.lat, lon:req.query.lon};
      var locations= dataHandler.getDataForLocation(location,res);
  });

};