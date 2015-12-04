var http = require('http');
var static = require('node-static');
var file = new static.Server('.');
var fs = require('fs');
var qs = require('querystring');

http.createServer(function(req, res) {
  file.serve(req, res);
  
  if (req.url == '/form') {
    var body = '';

    req.on('data', function (data) {
      body += data;
      fs.writeFile('data.json', body);
    });

    res.end();
  };

  if (req.url == '/data.json') {
    file.serve(req, res);
  };

}).listen(1337);

console.log('Server running on http://127.0.0.1:1337/');
console.log('url http://127.0.0.1:1337/index.html');