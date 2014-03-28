var mongoose = require('mongoose');
var crypto = require("crypto");

var Schema = mongoose.Schema;

var nodeSchema = new Schema({
  Node: String,
  // PosxNode: String,
  // PosyNode: String,
  Loc: {
    type: {type: String},
    coordinates: [],
  },
  Name: String,
  Lines: String
});

nodeSchema.index({Loc: "2dsphere"});
nodeSchema.index({Node: 1});

exports.Node = mongoose.model('Node', nodeSchema);
