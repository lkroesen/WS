var express = require('express');
var http = require('http');
var url = require('url');
var app;

app = express();

http.createServer(app).listen(3000);

var todo1 = {id : 1, message : "First todo", done : false, priority : 3};
var todo2 = {id : 2, message : "Second todo", done : true, priority : 1};
var todos = [];
todos[todo1.id] = todo1;
todos[todo2.id] = todo2;

app.use(express.static(__dirname + "/client"));
app.get("/", function(req, res) {
	
	res.send("/html/index.html");
	console.log("SENT REINFORMENTS");
	
});

app.get("/todos", function(req, res) {
	res.json(todos);
	res.end("Thank you!");
	console.log("SENDING JSON BITCH");
});

app.get("/addtodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['todo'] !== undefined) {
		var todo = JSON.parse(query['todo']);
		console.log(todos);
		
		todos[todo.id] = todo;
		console.log("gelukt");
		
	}
	res.send("Todo added");
	res.end("Todo added");
	
});

app.get("/deletetodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	if(query['id'] !== undefined) {
		var id = query['id'];
		todos[id] = null;
		console.log(todos);
		res.end("Deleted!");
		todos = todos.filter(function(element) {
			if(element === null || element === "") {
				return false;
			}
			return true;
		});
	}
});

console.log("Server listening on port 3000");
/*
server = http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type":"text/html"});
	res.send("index.html");
  res.end("Test Succesful!");
  console.log("HTTP response sent");
	
});

server.listen(3000);

*/