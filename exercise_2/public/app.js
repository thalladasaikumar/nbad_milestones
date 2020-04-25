var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  console.log('requested url: '+req.url);
  if(req.url === '/about'){
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.createReadStream(__dirname +'/views/about.html', 'utf8').pipe(res);
  } else if(req.url === '/contact'){
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.createReadStream(__dirname +'/views/contact.html', 'utf8').pipe(res);
  }
});

server.listen(8080, '127.0.0.1');
console.log('You\'re listening to port 8080');
