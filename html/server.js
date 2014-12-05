var express = require('express');
var http = require('http');
var url = require('url');
var app;

app = express();

http.createServer(app).listen(3000);

var todos = [];

app.use(express.static(__dirname + "/client"));

var mysql = require('mysql')
var db = mysql.createConnection({

	host:	'localhost',
	user:	'root',
password:	'root',
database:	'todo'

})

db.connect(function(err){
	if (err)
	console.log(err);
	else
	console.log("DB CONNECTION ACTIVE");
});

app.get("/", function(req, res) {
	
	res.send("/html/index.html");
	console.log("SENT REINFORMENTS");
	
});

app.get("/todos", function(req, res) {
	res.json(todos);
	res.end("Thank you!");
});

app.get("/addtodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['data'] !== undefined) {
		var todo = JSON.parse(query['data']);
		console.log(todos);
		
		var location = getArrayLocation(todo.id);
		if(location == -1) {
			todos[todos.length] = todo;	
		} else {
			todos[location] = todo;
		}
		
		console.log("add to do");
		
	}
	res.send("Todo added");
	res.end("Todo added");
	console.log(todos);
});

app.get("/deletetodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log("Delete: " + query['id']);
	if(query['id'] !== undefined) {
		var id = query['id'];
		todos.splice(getArrayLocation(id), 1);
		res.end("Deleted!");
	}
});



console.log("Server listening on port 3000");

var getArrayLocation= function(id) {
	for(var x = 0; x < todos.length; x++) {
		if(todos[x].id == id) {
			return parseInt(x);
		}
	}
	return -1;
}
/*
server = http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type":"text/html"});
	res.send("index.html");
  res.end("Test Succesful!");
  console.log("HTTP response sent");
	
});

server.listen(3000);

*/