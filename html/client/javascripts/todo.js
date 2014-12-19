"use strict";
function Todo(message, date, done, priority, id, compDate, ToDoListId ) {
	this.message = message;
	this.CreationDate = new Date();
	this.date = date;
	this.id = id;
	
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
	
	
	if(this.done) {
		this.CompletionDate = new Date();
	}
	
	
	this.toHTML = function() {
		var todo = "<li class='todo " + (this.done?"done ":"");
		if(this.date != null) {
			var now = new Date();
			if((this.date - now) < 604800000 & (this.date - now) > 0) {
				todo += "due "
			} else if((this.date - now) < 0) {
				todo += "overDue ";
			}
		}
		switch(this.priority) {
				case 1: todo += "priority1 "; break;
				case 2: todo += "priority2 "; break;
				case 3: todo += "priority3 "; break;
		}
		
		todo += "' data-todoid='" + this.id;
		todo += "'><div><div class='priorityIndicator'></div><span class='content'><input type='checkbox' ";
		if(this.done) {
			todo+= "checked";
		}
		todo += "/><span class='message' contenteditable='true' >";
		todo += this.message;
		todo += "</span><span class='buttons'><button class='delete'>||</button>";
		
		switch(this.priority){
				case 1: todo += "<span class='priority'><select><option value='1' selected>!</option><option value='2'>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 2: todo += "<span class='priority'><select><option value='1'>!</option><option value='2' selected>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 3: todo += "<span class='priority'><select><option value='1'>!</option><option value='2'>!!</option><option value='3' selected>!!!</option></select></span>"; break;
		}
		
		if(this.date !== null) {
			todo += "</span><span class='duedate'><input type='date' value='"; 
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
		

		todo += "</span></div></li>";
		
		return todo;
	}
	
	this.sendToServer = function() {
		console.log("Starting...");
		var data = '{"message":"' + this.message;
		data += '","CreationDate":"' + this.CreationDate.sqlDateTime();
		data += '","date":' + (this.date != null?'"'+this.date.sqlDateTime()+'"':"null");
		data += ', "CompletionDate":' +  (this.CompletionDate != null?'"' + this.CompletionDate.sqlDateTime()+ '"':"null");
		data += ', "ToDoListId":' + (this.ToDoListId != null?'"' + this.ToDoListId + '"':null);
		data += ', "done":"' + (this.done?1:0).toString();
		data += '", "priority":"' + this.priority.toString();
		data += '", "id":"' + this.id + '"}';
		$.getJSON("/addtodo?data=" + data, function(){console.log("Gelukt")});
		console.log("Ended.");
	}
	
	this.removeFromServer = function() {
		$.get("/deletetodo?id=" + this.id, function() {console.log("removed from server");});
	}
	
	/*
	 * This method compares two objects.
	 */
	this.equals = function(other) {
		if(this.message !== other.message) {
			return false;
		}
		
		if(this.CreationDate !== other.CreationDate) {
			return false;
		}
		
		if(this.date !== other.date) {
			return false;
		}
		
		if(this.CompletionDate !== other.CompletionDate) {
			return false;
		}
		
		if(this.done !== other.done) {
			return false;
		}
		
		return true;
		
	}
}

