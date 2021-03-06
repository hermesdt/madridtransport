
/**
 * Module dependencies.
 */

var mongoose = require("mongoose");
if(mongoose.connection.db == undefined)
  mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/emt");
  
var express = require('express');
var http = require('http');
var path = require('path');
var nodes = require("./routes/nodes");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(app.router);
app.get("/nodes", nodes.index)
app.get("/nodes/:id", nodes.show);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
