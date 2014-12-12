"use strict";
function Todo(message, date, done, priority, id, compDate, ToDoListId ) {
	this.message = message;
	this.CreationDate = new Date();
	this.date = date;
	console.log(date);
	if(compDate != undefined) {
		this.CompletionDate = compDate;
	} else {
		this.CompletionDate = null;
	}
	
	if(ToDoListId != undefined) {
		this.ToDoListId = ToDoListId;
	} else {
		this.ToDoListId = null;
	}
	
	this.done = done;
	this.priority = parseInt(priority);
	
	if(id === null) {
		var idGenerator = new Date();

		this.id = idGenerator.getMonth();
		this.id *= idGenerator.getDate();
		this.id *= idGenerator.getHours();
		this.id *= idGenerator.getMinutes();
		this.id -= idGenerator.getSeconds();
		this.id += idGenerator.getMilliseconds();
		this.id = this.id.toString();
	} else {
		this.id = id;
	}
	
	if(this.done) {
		this.CompletionDate = new Date();
	}
	
	
	this.toHTML = function() {
		var todo = "<li class='todo' data-todoid='" + this.id;
		todo += "'><input type='checkbox' ";
		if(this.done) {
			todo+= "checked";
		}
		todo += "/><span class='message' contenteditable='true' >";
		todo += message;
		todo += "</span><button class='delete'>||</button>";
		
		switch(this.priority){
				case 1: todo += "<span class='priority'><select><option value='1' selected>!</option><option value='2'>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 2: todo += "<span class='priority'><select><option value='1'>!</option><option value='2' selected>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 3: todo += "<span class='priority'><select><option value='1'>!</option><option value='2'>!!</option><option value='3' selected>!!!</option></select></span>"; break;
		}
		
		if(this.date !== null) {
			todo += "<span class='duedate'><input type='date' value='"; 
			todo += this.date.getFullYear() + "-";
			if((this.date.getMonth() + 1) < 10) {
				todo += "0";
			}
			
			todo += (this.date.getMonth() + 1) + "-";
			
			if(this.date.getDate() < 10) {
				todo += "0";
			} 
			todo += this.date.getDate();
			todo += "' placeholder='dd-mm-yyyy'/><input type='time' value='";
			todo += this.date.getHours() + ":" + this.date.getMinutes() + "' placeholder='hh:mm'/>";
			todo += "</span>";
		} else {
			todo += "<span class='duedate'><input type='date'/><input type='time'/></span>";
		}
		

		todo += "</li>";
		
		return todo;
	}
	
	this.sendToServer = function() {
		console.log("Starting...");
		$.getJSON("/addtodo?data=" + JSON.stringify(this), function(){console.log("Gelukt")});
		console.log("Ended.");
	}
	
	this.removeFromServer = function() {
		$.get("/deletetodo?id=" + this.id, function() {console.log("removed from server");});
	}
}

