var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET'){
    if(req.url === '/' || req.url === '/styles.css'){
      http.serveAssets(res, req.url);
    }
    else if(req.url === '/www.google.com'){
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end('/google/');
    }
    else{
      res.writeHead(404,"NOT FOUND",{'Content-Type': 'text/html'});
      res.end();
    }
  }else if(req.method === 'POST'){
    res.writeHead(302, "OK", {'Content-Type': 'text/html'});
    // add to text file the url + '/n'
    archive.addUrlToList(req._postData.url,res.end);
  }

  // res.end(archive.paths.list);
};
