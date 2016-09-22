var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('Starting server');
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

        
    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;

    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(404 , {'ContentType' :'text/plain'});
          response.end("PAGE NOT FOUND");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content);
        }
    });


}).listen(8081);
console.log('Server running at http://127.0.0.1:8081/');
