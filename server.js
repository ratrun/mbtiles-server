var express = require("express"),
    app = express(),
    MBTiles = require('mbtiles'),
    p = require("path");

var fs = require('fs'); 
require('prototypes');

// path to the mbtiles; default is the server.js directory
var tilesDir = __dirname;

var result = [];
fs.readdir(".", function (err, files) {
  if (err) throw err;
  console.log("Serving following areas:");
  files.forEach(function(value){
    if (value.endsWith('.mbtiles'))
    {
       var extract = value.substringUpTo('.mbtiles');
       result.push({country : extract});
       console.log(extract);
    }
   });
});

// Set return header
function getContentType(t) {
  var header = {};

  // CORS
  header["Access-Control-Allow-Origin"] = "*";
  header["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

  // Cache
  //header["Cache-Control"] = "public, max-age=2592000";

  // request specific headers
  if (t === "png") {
    header["Content-Type"] = "image/png";
  }
  if (t === "jpg") {
    header["Content-Type"] = "image/jpeg";
  }
  if (t === "pbf") {
    header["Content-Type"] = "application/x-protobuf";
    header["Content-Encoding"] = "gzip";
  }
  if (t === "json") {
     header["Content-Type"] = "application/json";
  }

  return header;
}

// tile cannon
app.get('/:s/:z/:x/:y.:t', function(req, res) {
  new MBTiles(p.join(tilesDir, req.params.s + '.mbtiles'), function(err, mbtiles) {
    mbtiles.getTile(req.params.z, req.params.x, req.params.y, function(err, tile, headers) {
      if (err) {
        res.set({"Content-Type": "text/plain"});
        res.status(404).send('Tile rendering error: ' + err + '\n');
      } else {
        res.set(getContentType(req.params.t));
        res.send(tile);
      }
    });
    if (err) console.log("error opening database");
  });
});

// Provide a list of served mbtilesareas
app.get('/mbtilesareas.json', function(req, res) {
  res.set(getContentType("json"));
  res.send(result);
});

// start up the server
console.log('Listening on port: ' + 3000);
app.listen(3000);
