mbtiles-server
==============

This is a fork of Christopher Helm's original awesome [mbtiles-server](https://github.com/chelm/mbtiles-server), which was extended by [tobinbradley](https://github.com/tobinbradley/mbtiles-server) and a little extended again by ratrun. All credit should be flung at Christopher Helm and tobinbradley. The changes in this fork compared to Christopher Helm's original are:

* The first path argument is the mbtiles file, so multiple mbtiles tile sets can be served with the same service.
* Vector tiles are supported.
* Some niceties on the return header (CORS, expiration, etc.).
* The server provides the served vector tile sets in a JSON file.

To get it cranking, drop a mbtiles file in the server folder and:

``` bash
npm install
node server.js
```

Requests look like this:

``` text
http://localhost:3000/mbtilesareas.json
http://localhost:3000/<mbtiles-name>/3/1/2.png.
```
