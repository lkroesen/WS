var express = require('express');
var http = require('http');
var url = require('url');
var app;
var highestQueryID = "SELECT id FROM ToDoItem ORDER BY id DESC LIMIT 1";

app = express();

var compareToSent = function(rows) {
	var newTodo = [];
	for(var i = 0; i < rows.length; i++) {
		var seen = false;
		for(var x = 0; x < sentTodos.length; x++) {
			if(rows[i].id == sentTodos[x].id) {
				seen = true;
			}
		}
		if(!seen) newTodo.push(rows[i]);
	}
	return newTodo;
}

var sentTodos = [];
var newTodos = [];

 
app.use(express.static(__dirname + "/client"));

var mysql = require('mysql');
var db = mysql.createConnection({
	host:	'localhost',
	user:	'root',
password:	'',
database:	'todo'
});

//Makes the connection with the db.
db.connect(function(err){
	if (err)
		console.log(err);
	else {
		console.log("DB CONNECTION ACTIVE");
	}
});

//Sends the index page.
app.get("/", function(req, res) {
	console.log("SENT REINFORCEMENTS");
	res.send("index.html");
		
});

//This function sends the new todos to the user that requests them.
app.get("/todos", function(req, res) {
	console.log("Sending todos to the user.");
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts['query'];
	
	if(query['time'] == "first") {
		res.send(JSON.stringify(sentTodos));
	} else {
		res.send(JSON.stringify(newTodos));
		if(newTodos.length != 0) {
			for(var i = 0; i < newTodos.length; i++) {
				sentTodos.push(newTodos[i]);
			}
			newTodos = [];
		}
	}
	
	
	
});

//This function checks every 1 second with the database if there are new todos.
setInterval(function() {
	console.log("Checking database for new to do's");
	db.query("SELECT * FROM todo.ToDoItem WHERE ToDoListID IN (SELECT id FROM todo.ToDoList WHERE Owner='2')", function(err, rows, fields) {
		if(err) {
			console.log(err);
		}
		if(rows) {
			newTodos = compareToSent(rows);
		}
	});
	
}, 1000);

//This function lets the user add a todos to the database.
app.get("/addtodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	db.query(highestQueryID, function(err, rows, fields){
		if(query['data'] !== undefined) {
			var todo = JSON.parse(query['data']);
			var id = todo['id'];
			var highestid = parseInt(rows[0].id) +1;
			//if(id < highestid) {
			//}
			var location = getArrayLocation(todo.id);
			if(location == -1) {
				sentTodos[sentTodos.length] = todo;	
				var err = addToDoToDB(todo);
				res.send(err);
				console.log("The user added a to do to his list.");
			}	
		}
	});
	
	res.end("Todo added");
	
});

var deleteQuery = "DELETE FROM ToDoItem WHERE Id = ";
app.get("/deletetodo", function(req, res) {
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log("Delete: " + query['id']);
	if(query['id'] !== undefined) {
		var id = query['id'];
		console.log("User deleted todo " + id);
		sentTodos.splice(getArrayLocation(id), 1);
		db.query(deleteQuery + id, function(err, rows, fields) {
			if(err) {console.log(err);}
		});
		res.end("Deleted!");
	}
});

//Responds with a new id for a to do.
app.get("/newid", function(req, res) {
	console.log("Client has requested an id for a new to do.");
	db.query(highestQueryID, function(err, rows, fields) {
		if(err) { console.log(err);}
		else{
			var id = parseInt(rows[0].id) + 1;
			console.log(id);
			var response = id.toString();
			res.send(response);
		}
	});
});

//Responds with the number of finished to dos
app.get("/stats/finished", function(req, res) {
	console.log("User wants to know the number of finished todos.");
	db.query("SELECT COUNT(*) AS Completed FROM ToDoItem INNER JOIN ToDoList ON ToDoItem.ToDoListID = ToDoList.id WHERE Owner=2 AND Completed=1", function(err, rows, fields) {
		res.send(rows[0].Completed.toString());
	});
});

//Responds with the number of unfinished to dos.
app.get("/stats/unfinished", function(req, res) {
	console.log("User wants to know the number of unfinished todos.");
	db.query("SELECT COUNT(*) AS Unfinished FROM ToDoItem INNER JOIN ToDoList ON ToDoItem.ToDoListID = ToDoList.id WHERE Owner=2 AND Completed=0", function(err, rows, fields) {
		res.send(rows[0].Unfinished.toString());
	});
});

//Responds with the total number of to dos.
app.get("/stats/total", function(req, res) {
	console.log("User wants to know the total number of todos.");
	db.query("SELECT COUNT(*) AS Total FROM ToDoItem INNER JOIN ToDoList ON ToDoItem.ToDoListID = ToDoList.id WHERE Owner=2", function(err, rows, fields) {
		res.send(rows[0].Total.toString());
	});
});

console.log("Server listening on port 3000");
http.createServer(app).listen(3000);

var getArrayLocation= function(id) {
	for(var x = 0; x < sentTodos.length; x++) {
		if(sentTodos[x].id == id) {
			return parseInt(x);
		}
	}
	return -1;
}

var addToDoToDB = function(todo) {
	db.query(highestQueryID, function(err, rows, fields) {
		if(err) {console.log(err); return err;}
		else {
			var id = rows[0].id + 1;
			console.log(id);
			
			var insertToDoQuery = "INSERT INTO ToDoItem VALUES(";
			insertToDoQuery += id + ", ";
			insertToDoQuery += "null, '";
			insertToDoQuery += todo.message + "', '";
			insertToDoQuery += todo.CreationDate + "', ";
			insertToDoQuery += (todo.date != null?'"' + todo.date + '"':null) + ", ";
			insertToDoQuery += todo.done + ", ";
			insertToDoQuery += (todo.CompletionDate != null?'"' + todo.CompletionDate + '"':null) + ", ";
			insertToDoQuery += todo.priority + ", ";
			insertToDoQuery += "3, ";
			insertToDoQuery += "null)";

			console.log(insertToDoQuery);
			db.query(insertToDoQuery, function(err, rows, fields){
				if(err) {console.log(err); return err;}
			});
			
		}
	});
	
	
	
}

