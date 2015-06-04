var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET'){
    if(req.url === '/' || req.url === '/styles.css' || req.url === '/loading.html'){
      http.serveAssets(res,'local',req.url);
    }else{
      archive.isURLArchived(req.url,function(inArchive){
        if(inArchive){
          http.serveAssets(res,'pub',req.url);
        }else{
          res.writeHead(404, "ERROR", {'Content-Type': 'text/html'});
          res.end();
        }
      });
    }
  }else if(req.method === 'POST'){
    res.writeHead(302, "OK", {'Content-Type': 'text/html'});

    // Check if it is inside the list
    archive.isUrlInList(req.url,function(inList){
      if(inList){
        // check to see if archived page.
        archive.isURLArchived(req.url,function(inArchive){
          // if archived, serve the file.
          if(inArchive){
            console.log('FOUND IN ARCHIVE, SERVING PAGE');
            res.writeHead(302, {'Location': req.url}, {'Content-Type': 'text/html'});
            res.end();
          }else{
          // else, continue to loading page.
            console.log('FOUND IN LIST, BUT NOT ARCHIVED - DOWNLOADING NOW');
            archive.downloadUrls();
          }
        });
      }else{
        console.log('NOT FOUND, ADDING NEW URL AND DOWNLOADING');
        // give the loading page.
        res.writeHead(302, {'Location': '/loading.html'}, {'Content-Type': 'text/html'});
        // add to the list to download
        archive.addUrlToList(req.url,res,function(){
          archive.downloadUrls(function(){
            res.end();
          });
        });
      }
    });
  }
  // res.end(archive.paths.list);
};
