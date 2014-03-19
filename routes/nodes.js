var Node = require("../models/node").Node;

exports.index = function(req, res){
  var lon = parseFloat(req.query.lon);
  var lat = parseFloat(req.query.lat);
  var distance = parseFloat(req.query.distance);
  var point = { type : "Point", coordinates : [lon, lat] };
  Node.geoNear(point, {distanceMultiplier: 6371000, maxDistance: distance / 6371000, spherical: true}, function(e, rows){
    handleResponse(e, res, rows);
  });
};

function handleResponse(e, res, rows){
    if(e){
      console.log(e);
      res.end(500);
    }
    else{
      res.set("Content-Type", "text/xml");
      var output = "";
      output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
      output += "<TABLA>";
      output += "<RESULTADO>0</RESULTADO>";
      rows.forEach(function(row){
        var obj = row.obj;
        var loc = obj["Loc"]["coordinates"];
        output += "<REG><Name>"+obj["Name"]+"</Name><Node>"+obj["Node"]+"</Node>"+
        "<PosxNode>"+loc[0]+"</PosxNode><PosyNode>"+loc[1]+"</PosyNode><Lines>"+obj["Lines"]+"</Lines></REG>";
      });
      output += "</TABLA>";
      res.send(output);
    }
};
