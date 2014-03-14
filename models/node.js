var mongoose = require('mongoose');
var crypto = require("crypto");

var Schema = mongoose.Schema;

var nodeSchema = new Schema({
  Node: String,
  PosxNode: String,
  PosyNode: String,
  Loc: {
    type: {type: String},
    coordinates: [],
  },
  Name: String,
  Lines: String
});

nodeSchema.index({Loc: "2dsphere"});

exports.Node = mongoose.model('Node', nodeSchema);
