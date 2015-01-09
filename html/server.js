var defaultPort = 3000;
var express = require('express');
var http = require('http');
var url = require('url');
var ejs = require('ejs');
var ToDoList = require('./client/javascripts/todolist.js').ToDoList;
var Todo = require('./client/javascripts/todo.js').Todo;
require('./client/javascripts/prototypeFunctions.js');
var mysql = require('mysql');
var $ = require('jquery');
var app = express();

var highestQueryID = "SELECT id FROM ToDoItem ORDER BY id DESC LIMIT 1";

var port = process.argv[2];
if(port == undefined) {
	port = defaultPort;
	console.log("No port defined. Default port: " + defaultPort);
}

var todoLists = [];
 
app.use(express.static(__dirname + "/client"));
app.set('view engine', 'ejs');

var db = mysql.createConnection({
	host:	'localhost',
	user:	'root',
password:	'',
database:	'todo'
});

var updateQuery = "SELECT ToDoItem.Id AS ToDoId, ToDoItem.Text AS Message, ToDoItem.CreationDate, ToDoItem.DueDate, ToDoItem.Completed, ToDoItem.CompletionDate, ToDoItem.Priority, ToDoItem.ToDoListId AS ListId, ToDoList.Name AS ListName, ToDoList.CreationDate, ToDoList.Owner AS User FROM ToDoItem INNER JOIN ToDoList ON ToDoListID = ToDoList.Id WHERE ToDoList.Owner = 2 ORDER BY ToDoItem.DueDate ASC";
var serverUpdate = function() {
	console.log("Checking database for new to do's");
	db.query(updateQuery, function(err, rows, fields) {
		if(err) {
			console.log(err);
		}
		if(rows) {
			for(var i = 0; i < rows.length; i++) {
				var list  = todoLists.findById(rows[i].ListId);
				if(!list) {
					list = new ToDoList(rows[i].ListId, rows[i].ListName, rows[i].User);
					list.new = true;
					todoLists.push(list);
				}
				if(!todoLists.findToDoItem(rows[i].ListId, rows[i].ToDoId)) {
					var todo = new Todo(rows[i].ToDoId, rows[i].Message, rows[i].DueDate, rows[i].Completed, rows[i].Priority, rows[i].ListId, rows[i].CreationDate, rows[i].CompletionDate);
					todo.new = true;
					list.addToDo(todo);
				}
			}
		}
	});
}

//Makes the connection with the db.
db.connect(function(err){
	if (err) {
		console.log(err);
		process.exit(1);
	} else {
		console.log("DB CONNECTION ACTIVE");
	}
});


//This function checks every 1 second with the database if there are new todos.
setInterval(function() {
	serverUpdate();
}, 1000);

app.get("/todo.html", function(req, res) {

	console.log("Sending to do page.");
	res.render('todo.ejs', {'todoLists':todoLists});

	for(var i = 0; i < todoLists.length; i++) {
		for(var j = 0; j < todoLists[i].getTodos().length; j++) {
			todoLists[i].getTodos()[j].new = false;
		}
		todoLists[i].new = false;
	}

});

//Sends the index page.
app.get("/", function(req, res) {
	res.send("index.html");
});

app.get("/lists", function(req, res) {
	var toSend = [];
	for(var i = 0; i < todoLists.length; i++) {
		if(todoLists[i].new) {
			toSend.push(todoLists[i]);
			todoLists[i].new = false;
		}
	}

	if(toSend.isEmpty) {
		console.log("No new todo lists to send to user");
	} else {
		console.log("Sending new todo lists to user");
	}

	res.send(toSend);
});

//This function sends the new todos to the user that requests them.
app.get("/todos", function(req, res) {
	var toSend = [];
	for(var i = 0; i < todoLists; i++) {
		for(var j = 0; j< todoLists[i].todos.length; j++) {
			if(todoLists[i].todos[j].new) {
				toSend.push(todoLists[i].todos[j]);
				todoLists[i].todos[j].new = false;
			}
		}
	}

	if(toSend.isEmpty) {
		console.log("No new todos to send to user.");
	} else {
		console.log("Sending new todos to user.");
	}
	res.send(toSend);
});


//This function lets the user add a todos to the database.
app.get("/addtodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	db.query(highestQueryID, function(err, rows, fields){
		if(query['data'] !== undefined) {
			var todo = JSON.parse(query['data']);
			var location = getArrayLocation(todo.id);
			if(location == -1) {
				sentTodos[sentTodos.length] = todo;	
				var err = addToDoToDB(todo);
			}	
			if(err) {
				res.send(err);
			} else {
				res.sendStatus(200);
			}
		}
	});
	
});

//This function updates the todo in the database and in the array.
app.get("/updatetodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['data'] !== undefined) {
		var todo = JSON.parse(query['data']);
		console.log("\n User has updated todo " + todo.id + "\n");
		
		var location = getArrayLocation(todo.id);
		if(location != -1) {
			sentTodos[location] = todo;
			var err = updateToDoDB(todo);
			res.send(err);
		}
	}
	res.end(200);
	
});

//This function add the list in the database and the array.
app.get("/addlist", function(req, res) {
	console.log("Add list");
});

//This function updates the list in the database and in the array
app.get("/updatelist", function(req, res) {
	console.log("Update list");
});

var deleteQuery = "DELETE FROM ToDoItem WHERE Id = ";
app.get("/deletetodo", function(req, res) {
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['id'] !== undefined) {
		var id = query['id'];
		console.log("\n User deleted todo " + id + "\n");
		sentTodos.splice(getArrayLocation(id), 1);
		db.query(deleteQuery + id, function(err, rows, fields) {
			if(err) {console.log(err);}
		});
		res.end("Deleted to do!");
	}
	res.end(500);
});

//Responds with a new id for a to do or to do list.
app.get("/newid", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	if(query['type'] !== undefined) {
		var type = query['type'];
		if(type == 'todo') {
			db.query(highestQueryID, function(err, rows, fields) {
				if(err) { console.log(err);}
				else {
					var id = parseInt(rows[0].id) + 1;
					var response = id.toString();
					res.send(response);
					console.log("\n New ToDoId: " + id + "\n");
				}
			});
		} else if(type == 'list') {
			db.query("SELECT Id FROM ToDoList ORDER BY Id DESC LIMIT 1", function(err, rows, fields) {
				if(err) { console.log(err);}
				else {
					var id = parseInt(rows[0].Id) + 1;
					var response = id.toString();
					res.send(response);
					console.log("\n New List id: " + id + "\n");
				}
			});
		}
	}
	
	
	
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



console.log("Server listening on port " + port);
http.createServer(app).listen(port);

var getArrayLocation= function(id) {
	for(var x = 0; x < sentTodos.length; x++) {
		if(sentTodos[x].ToDoId == id) {
			return parseInt(x);
		}
	}
	return -1;
}

var updateToDoDB = function(todo) {
	var updateQuery = "UPDATE ToDoItem ";
	updateQuery += "SET Text='" + todo.message + "', ";
	updateQuery += "DueDate=" + (todo.date != null?'"' + todo.date + '"':null) + ", ";
	updateQuery += "Completed=" + todo.done + ", ";
	updateQuery += "CompletionDate=" + (todo.CompletionDate != null?'"' + todo.CompletionDate + '"':null) + ", ";
	updateQuery += "Priority=" + todo.priority;
	updateQuery += " WHERE Id=" + todo.id;
	
	db.query(updateQuery, function(err, rows, fields) {
		if(err) {console.log(err); return err;}
	});
}

var addToDoToDB = function(todo) {
	
	console.log(todo);
	var insertToDoQuery = "INSERT INTO ToDoItem VALUES(";
	insertToDoQuery += todo.id + ", ";
	insertToDoQuery += "null, '";
	insertToDoQuery += todo.message + "', '";
	insertToDoQuery += todo.CreationDate + "', ";
	insertToDoQuery += (todo.date != null?'"' + todo.date + '"':null) + ", ";
	insertToDoQuery += todo.done + ", ";
	insertToDoQuery += (todo.CompletionDate != null?'"' + todo.CompletionDate + '"':null) + ", ";
	insertToDoQuery += todo.priority + ", ";
	insertToDoQuery += todo.ToDoListId + ", ";
	insertToDoQuery += "null)";
	console.log(insertToDoQuery);
	console.log("\n User added a new todo: " + todo.id + ", " + todo.message + "\n");
	db.query(insertToDoQuery, function(err, rows, fields){
		if(err) {console.log(err); return err;}
	});
}

