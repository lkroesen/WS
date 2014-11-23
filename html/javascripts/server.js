var http = require('http');
var server;

server = http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("Test Succesful!");
  console.log("HTTP response sent");
});

server.listen(3000);
console.log("Server listening on port 3000");
