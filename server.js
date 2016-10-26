var express = require("express"),
    app = express(),
    MBTiles = require('mbtiles'),
    p = require("path");

var fs = require('fs'); 
require('prototypes');
var path = require('path');

// path to the mbtiles: /../data/mbtiles
var tilesDir = path.join(__dirname, "/../data/mbtiles");
console.log("Serving files from " + tilesDir);

var result = [];
fs.readdir(tilesDir, function (err, files) {
  if (err) throw err;
  console.log("Serving following areas:");
  files.forEach(function(value){
    if (value.endsWith('.mbtiles'))
    {
       var extract = value.substringUpTo('.mbtiles');
       console.log(extract);
       // Don't show up the overlay
       if (extract.substring(0,7) !== 'bicycle')
       {
         result.push({country : extract});
       }
    }
   });
});

// Set return header
function getContentType(t) {
  var header = {};

  // CORS
  header["Access-Control-Allow-Origin"] = "*";
  header["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
//  header["Expires"] = new Date(Date.now() + 345600000).toUTCString();

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
  // console.log(req.params.s + "." + req.params.z + "." + req.params.x + "." + req.params.y);
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

// Stop the server via request
app.get('/4cede326-7166-4cbd-994f-699c6dc271e9', function(req, res) {
  console.log('Instruction for stopping received');
  res.set(getContentType("json"));
  result = '200OK'; // Confirmation 
  res.send(result);
  server.close();
  process.exit(100);
});

process.on( "SIGINT", function() {
  console.log('MBTSERVER CLOSING [SIGINT]');
  server.close();
  process.exit(200);
} );

// start up the server
console.log('Listening on port: ' + 3000);
var server = app.listen(3000);
