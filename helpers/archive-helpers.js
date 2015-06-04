var fs = require('fs');
var http = require('http');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, function read(err, data){
    cb(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url,cb){
  // check our list
  exports.readListOfUrls(function(data){
    var found = false;
    for (var i = 0; i < data.length; i++) {
      if(data[i].indexOf(url) > -1) found = true;
    }
    cb(found);
  });
};

exports.addUrlToList = function(url,res,callback){
  fs.appendFile(exports.paths.list, url + ', 0'+'\n');
  callback();
};

exports.isURLArchived = function(url,cb){
  // check to see if sites folder contains the url.
  exports.readListOfUrls(function(data){
    var found = false;
    for (var i = 0; i < data.length; i++) {
      var str = data[i];
      if(str.indexOf(url) > -1 && str[str.length-1] === '1'){
        found = true;
      }
    };
    cb(found);
  });
};

exports.downloadUrls = function(callback){
  console.log('CHECKING ALL URLS FOR DOWNLOAD.....');
  // check the list of the urls
  exports.readListOfUrls(function(data){
    var temp = [];
    var archived = [];

    for (var i = 0; i < data.length; i++) {
      var url = data[i];
      if(url[url.length-1] === '1'){
        archived.push(url);
      }
      if(url[url.length-1] === '0'){
        // download the url & archive
        exports.downloadUrl(url,function(path,data){
          console.log('COMPLETED DOWNLOAD, ' + path + ' IS NOW ARCHIVED');
          temp.push(path + ', 1' + '\n');
          fs.writeFile(exports.paths.list,archived.concat(temp).join("\n")); // rewrite the whoel file.
          // create the html archive file
          exports.makeFile(path,data);
        });
      }
    }
  });
  if(callback)callback();
};

exports.downloadUrl = function(url,callback){

  url = 'http://' + url.slice(1,url.length-3);

  console.log('STARTING DOWNLOAD in downloadUrl for ' + url);

  var req = http.get(url,function(res){
    console.log('DOWNLOADING SINGLE PAGE...from ' + url);
    var str = '';
    res.on('data',function(chunk){
      str += chunk; 
    });
    res.on('end',function(){
      // save the chunked data into html file into archives.
      callback(url,str);
    });
  });

  req.on('error',function(err){console.log(err);})
};

exports.makeFile = function(url,file){
  fs.writeFile(exports.paths.archivedSites + '/' + url.slice(7) + '.html', file);
};
