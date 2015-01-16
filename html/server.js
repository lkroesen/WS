var defaultPort = 3000;
var credentials = require('./javascripts/credentials.js');
var User = require('./javascripts/user.js');
var Todo = require('./javascripts/todo.js').Todo;
var ToDoList = require('./javascripts/todolist.js').ToDoList;
require('./client/javascripts/prototypeFunctions.js');

var express = require('express');
var cookies = require('cookie-parser');
var http = require('http');
var url = require('url');
var ejs = require('ejs');
var mysql = require('mysql');
var $ = require('jquery');
var session = require('express-session');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var validator = require('validator');

var app = express();

var port = process.argv[2];
if(!port) {
	port = defaultPort;
	console.log("No port defined. Default port: " + defaultPort);
}

var newToDoId = 0;
var newListId = 0;
var requests = 0;


app.use(express.static(__dirname + "/client"));
app.use(cookies(credentials.cookies.secret));
app.use(session(credentials.cookies.secret));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

passport.use(new TwitterStrategy({
	consumerKey: credentials.twitter.CONSUMER_KEY,
	consumerSecret: credentials.twitter.CONSUMER_SECRET_KEY,
	callbackURL: "http://127.0.0.1:4000/todo.html"
}, function(token, tokenSecret, profile, done) {
	User.findOrCreate(profile, function(err, user) {
		if(err) {return done(err);}
		done(null, user);
	}, db);

}));

passport.serializeUser(function(user, done) {
	done(null, user.getId());
});

passport.deserializeUser(function(userId, done) {
	User.deserializeUser(userId, db, function(err, user) {
		done(err, user);
	});
});

var db = mysql.createConnection(credentials.database);


var getDataFromDatabase = function(userId, callback) {
	console.log("Getting todos from database");

	var updateQueryTemplate = "SELECT * FROM MostDueTodos WHERE User=<%= userId %>";
	var updateQuery = ejs.render(updateQueryTemplate, {'userId':userId});

	var todoLists = [];
	db.query(updateQuery, function(err, rows, fields) {
		if(err) {
			console.log(err);
		}
		if(rows) {
			console.log("Todos for user" + userId);
			console.log(rows);
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
			callback(todoLists);
			return todoLists;
		}
	});


};

//Makes the connection with the db.
db.connect(function(err){
	if (err) {
		console.log(err);
		process.exit(1);
	} else {
		console.log("DB CONNECTION ACTIVE");
		console.log("Ready!");
	}
});

var highestIds = function() {
	db.query('SELECT Id FROM ToDoItem ORDER BY Id DESC LIMIT 1', function(err, rows, fields) {
		if(err) {console.log(err);}
		if(rows) {
			newToDoId = rows[0].Id + 1;
		}
	});

	db.query('SELECT Id FROM ToDoList ORDER BY Id DESC LIMIT 1', function(err, rows, fields) {
		if(err) {console.log(err);}
		if(rows) {
			newListId = rows[0].Id + 1;
		}
	});
}


//This function checks every 1 second with the database if there are new todos.
setInterval(function() {
	highestIds();
}, 500);

app.get("/todo.html", passport.authenticate('twitter'), function(req, res) {
	if(req.user) {
		var user = req.user;
		requests++;
		console.log("Request number: #" + requests);
		getDataFromDatabase(user.id, function(todoLists) {
			res.render('todoPage.ejs', {'todoLists':todoLists, 'user':user, 'url':'/todo.html'});
		});
	} else {
		res.redirect('/auth/twitter');
	}
});

//Sends the index page.
app.get("/", function(req, res) {
	res.send("index.html");
});


//This function lets the user add a todos to the database.
app.get("/addtodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['data']) {
		var data = JSON.parse(query['data']);
		var todo = new Todo(newToDoId, data.message, new Date(data.date),false, data.priority, data.toDoListId, new Date());
		highestIds();
		db.query(todo.insertData(), function(err, rows, fields) {
			if(err) {res.sendStatus(500); console.log(err);}
			else{
				res.render('ToDo.ejs', {'todo':todo});
				console.log("New to do added! " + todo.getId() + ", " + todo.getMessage());
			}
		});
	}
});

//This function updates the todo in the database and in the array.
app.get("/updatetodo", function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['data']) {
		var data = JSON.parse(query['data']);
		var todo = new Todo(data.toDoId, data.message, new Date(data.date),data.done, data.priority, data.toDoListId);

		db.query(todo.updateData(), function(err, rows, fields) {
			if(err) {res.sendStatus(500); console.log(err);}
			else{
				console.log("  To do updated: " + todo.getId() + ", " + todo.getMessage());
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(400);
	}
});

//this function add a to do list to the database.
app.get('/addlist', function(req, res) {
	console.log(req.user);
	var list = new ToDoList(newListId, "New list, click to edit!",req.user.id );
	highestIds();
	db.query(list.insertData(), function(err, rows, fields) {
		if(err) {res.sendStatus(500); console.log(err);}
		else {
			res.render('ToDoList.ejs', {'list':list});
			console.log("Added new list: " + list.getId() + ", " + list.getName());
		}
	});
});

//This function updates the list in the database and in the array
app.get("/updatelist", function(req, res) {
	console.log("Update list");
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['data']) {
		var data = JSON.parse(query['data']);
		var list = new ToDoList(data.id, data.name);

		db.query(list.updateData(), function(err, rows, fields) {
			if(err) {res.sendStatus(500); console.log(err);}
			else {
				res.sendStatus(200); console.log("  Updated todolist " + list.getId() + ", " + list.getName());
			}
		});
	} else {
		res.sendStatus(400);
	}
});

var deleteQuery = "DELETE FROM ToDoItem WHERE Id = ";
app.get("/deletetodo", function(req, res) {
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query['id']) {
		var id = parseInt(query['id']);

		db.query(deleteQuery + id, function(err, rows, fields) {
			if(err) {res.sendStatus(500); console.log(err);}
			else {
				res.sendStatus(200);
				console.log("Deleted todo: " + id);
			}
		});
	} else {
		res.sendStatus(400);
	}
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
	passport.authenticate('twitter', { successRedirect: '/authorized.html',
										failureRedirect: '/'})
);

app.get('/authorized.html', passport.authenticate('twitter'), function(req, res) {
	if(req.user) {
		res.render('authorized.ejs', {'user':req.user});
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