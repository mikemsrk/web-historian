var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET'){
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    if(req.url === '/'){
      res.end('/<input/');
    }
    if(req.url === '/www.google.com'){
      // matching content of the text file.
      res.end('/google/');
    }
  }else if(req.method === 'POST'){
    res.writeHead(302, "OK", {'Content-Type': 'text/html'});
    // add to text file the url + '/n'
    archive.addUrlToList(req._postData.url,res.end);
  }

  res.end(archive.paths.list);
};
