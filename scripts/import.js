var mongoose = require("mongoose");
var Node = require("../models/node").Node;
var fs = require("fs");

if(mongoose.connection.db == undefined)
  mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/emt");

var rawJson = fs.readFileSync("data.json");
var json = JSON.parse(rawJson);
json["TABLA"]["REG"].forEach(function(reg){
  var loc = reg["Loc"];
  var locData = {type: "Point", coordinates: [loc["Longitude"], loc["Latitude"]]};
  var node = new Node({Node: reg["Node"], Name: reg["Name"],
    PosxNode: reg["PosxNode"], PosyNode: reg["PosyNode"],
  Lines: reg["Lines"], Loc: locData});

  node.save(function(e){});
});

