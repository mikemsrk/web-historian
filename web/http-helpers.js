var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpreq = require('http-request');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, origin, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var opt = '';
  opt = asset === '/' ? 'index.html' : '';
  if(asset === '/'){
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  }else if(asset === '/styles.css'){
    res.writeHead(200, "OK", {'Content-Type': 'text/css'});
  }

  if(origin !== 'local'){
    console.log(archive.paths.archivedSites + asset + opt + '.html');
    fs.readFile(archive.paths.archivedSites + asset + opt + '.html',function read(err,data){
      res.write(data);
      res.end();
    });
  }else{
    console.log(archive.paths.siteAssets + asset + opt);
    fs.readFile(archive.paths.siteAssets + asset + opt,function read(err,data){
      res.write(data);
      res.end();
    });
  }

};



// As you progress, keep thinking about what helper functions you can put here!
