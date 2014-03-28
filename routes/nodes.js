var Node = require("../models/node").Node;

exports.index = function(req, res){
  
  var lon = parseFloat(req.query.lon);
  var lat = parseFloat(req.query.lat);
  var distance = parseFloat(req.query.distance);
  if(isNaN(lon * lat * distance)){
    res.end(500);
  }else{
    var point = { type : "Point", coordinates : [lon, lat] };
    Node.geoNear(point, {distanceMultiplier: 6371000, maxDistance: distance / 6371000, spherical: true}, function(e, rows){
      handleResponse(e, res, rows);
    });
  }
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

exports.show = function(req, res){
  var id = req.params.id;
  if(isNaN(parseFloat(id))){
    res.send({}, 500);
  }else{
    Node.findOne({Node: id}, function(err, doc){
      if(err || doc == null){
        res.send({}, 500);
      }else{
        res.send({id: doc.Node, name: doc.Name,
          latitude: doc.Loc.coordinates[1], longitude: doc.Loc.coordinates[0]});
        res.end(200);
      }
    });
  }
};
