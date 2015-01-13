"use strict";
function Todo(id, message, date, done, priority, ToDoListId, CreationDate, compDate ) {
	this.message = message;
	this.date = date;
	this.done = done;
	this.priority = parseInt(priority);
	this.id = id;
	
	this.CompletionDate = null;
	if(compDate !== undefined) {
		this.CompletionDate = compDate;
	}
	
	this.CreationDate = CreationDate;
	if(CreationDate == undefined) {
		this.CreationDate = new Date();
	}
	
	this.ToDoListId = 3;
	if(ToDoListId !== undefined) {
		this.ToDoListId = ToDoListId;
	}

	this.getDone = function() {
		return this.done;
	};

	this.getDueDate = function() {
		return this.date;
	};

	this.setDueDate = function(date) {
		this.date = date;
	};

	this.getMessage = function() {
		return this.message;
	};

	this.setMessage = function(message) {
		this.message = message;
	};

	this.getPriority = function() {
		return this.priority;
	};

	this.setPriority = function(priority) {
		this.priority = priority;
	};

	this.getId = function() {
		return this.id;
	};

	this.isOverDue = function() {
		return this.date.getTime() < new Date().getTime();
	};

	this.isDue = function() {
		return this.date.getTime() - new Date().getTime() < 43200000 && !this.isOverDue() && !this.isVeryDue();
	};

	this.isVeryDue = function() {
		return ((this.date.getTime() - new Date().getTime()) < (3*60*60*1000)) && !this.isOverDue();
	};

	this.insertData = function() {
		var insertToDoQuery = "INSERT INTO ToDoItem VALUES(";
		insertToDoQuery += this.id + ", ";
		insertToDoQuery += "null, '";
		insertToDoQuery += this.message + "', '";
		insertToDoQuery += this.CreationDate.sqlDateTime() + "', ";
		insertToDoQuery += (this.date != null?'"' + this.date.sqlDateTime() + '"':null) + ", ";
		insertToDoQuery += (this.done?1:0) + ", ";
		insertToDoQuery += (this.CompletionDate != null?'"' + this.CompletionDate.sqlDateTime() + '"':null) + ", ";
		insertToDoQuery += this.priority + ", ";
		insertToDoQuery += this.ToDoListId + ", ";
		insertToDoQuery += "null)";

		return insertToDoQuery;
	};

	this.updateData = function() {
		var updateQuery = "UPDATE ToDoItem ";
		updateQuery += "SET Text='" + this.message + "', ";
		updateQuery += "DueDate=" + (this.date != null?'"' + this.date.sqlDateTime() + '"':null) + ", ";
		updateQuery += "Completed=" + (this.done?1:0) + ", ";
		updateQuery += "Priority=" + this.priority;
		updateQuery += " WHERE Id=" + this.id;
		console.log(updateQuery);
		return updateQuery;
	};

}

module.exports.Todo = Todo;

