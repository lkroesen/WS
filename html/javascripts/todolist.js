"use strict";
var ToDoList = function(id, name, user) {
	this.id = id;
	this.name = name;
	this.todos = new Array();
	this.user = user;
	
	this.addToDo = function(todo) {
		this.todos.push(todo);
	};

	this.getId = function() {
		return this.id;
	};

	this.getName = function() {
		return this.name;
	};

	this.getTodos = function() {
		return this.todos;
	};

	this.insertData = function() {
		var query = "INSERT INTO ToDoList (Id, Name, Owner) VALUES(";
		query += this.id + ", '";
		query += this.name + "', ";
		query += this.user + ")";

		return query;
	};

	this.updateData = function() {
		var query = "UPDATE ToDoList SET Name = '" + this.name;
		query += "' WHERE Id = " + this.id;

		return query;
	}
};
module.exports.ToDoList = ToDoList;