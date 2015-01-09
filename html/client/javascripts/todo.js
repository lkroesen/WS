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

	this.setMessage = function(message) {
		this.message = message;
	};

	this.getPriority = function() {
		return this.priority;
	};

	this.setPriority = function(priority) {
		this.priority = priority;
	};
	
	this.setDone = function(done) {
		if(!this.done) {
			if(done) {
				this.CompletionDate = new Date();
			}
		} else {
			if(!done) {
				this.CompletionDate = undefined;
			}
		}
		this.done = done;
	};

	this.isOverDue = function() {
		return this.date < new Date();
	};

	this.isDue = function() {
		return this.date - new Date() < 43200000;
	};
	
	
	/*
	 * This method builds an html node based on this to do item.
	 */ 
	this.toHTML = function() {
		
		var todo = $("<li></li>", {
			"data-todoid": this.id
		}).addClass("todo");
		
		if(this.done) {
			todo.addClass("done");
		}
		
		if(this.date != null) {
			var now = new Date();
			if((this.date - now) < 604800000 & (this.date - now) > 0) {
				todo.addClass("due");
			} else if((this.date - now) < 0) {
				todo.addClass("overDue");
			}
		}
		
		switch(this.priority) {
				case 1: todo.addClass("priority1"); break;
				case 2: todo.addClass("priority2"); break;
				case 3: todo.addClass("priority3"); break;
		}
		
		var innerTodo = $("<div></div>");
		
		innerTodo.append("<div class='priorityIndicator'><div><div /><div /><div /></div></div>");
		
		var content = $("<div></div>").addClass("content");
		
		content.append("<input type='checkbox' " + (this.done?"checked ":"") + "/>");
		var mess = $("<span></span>", {
			contenteditable:true,
			text:this.message
		}).addClass("message");
		content.append(mess);
		
		var buttons = $("<span></span>").addClass("buttons");
		
		var deleteButton = $("<button />", {
			text:"||"
		}).addClass("delete");
		buttons.append(deleteButton);
		
		var prioritySelection = $("<span></span>").addClass("priority");
		
		var select = $("<select></select>");
		switch(this.priority){
				case 1: select.append("<option value='1' selected>!</option><option value='2'>!!</option><option value='3'>!!!</option>"); break;
				case 2: select.append("<option value='1'>!</option><option value='2' selected>!!</option><option value='3'>!!!</option>"); break;
				case 3: select.append("<option value='1'>!</option><option value='2'>!!</option><option value='3' selected>!!!</option>"); break;
		}
		prioritySelection.append(select);
		buttons.append(prioritySelection);
		content.append(buttons);
		
			
		var dateInput = $("<span></span>").addClass("duedate");

		var dayInput = $("<select></select>").addClass("day");
		for(var i = 1; i < 32; i++) {
			var text = i.toString();
			if(i < 10) {
				text = "0" +  i.toString();
			}
			var option = $("<option></option>", {
				value:i,
				text:text
			});
			if(this.date !== null && i == this.date.getDate()) {
				option.attr("selected", "true");
			}
			dayInput.append(option);
		}

		dateInput.append(dayInput);

		var monthInput = $("<select></select>").addClass("month");
		for(var i = 1; i < 13; i++) {
			var text = i.toString();
			if(i < 10) {
				text = "0" +  i.toString();
			}
			var option = $("<option></option>", {
				value:i,
				text:text
			});
			if(this.date !== null && i == this.date.getMonth()) {
				option.attr("selected", "true");
			}
			monthInput.append(option);
		}
		dateInput.append(monthInput);

		var yearInput = $("<select></select>").addClass("year");
		for(var i = (new Date().getFullYear() - 10); i < (new Date().getFullYear() + 10); i++) {
			var option = $("<option></option>", {
				value:i,
				text:i
			});
			if(this.date !== null && i == this.date.getFullYear()) {
				option.attr("selected", "true");
			}
			yearInput.append(option);
		}
		dateInput.append(yearInput);
		
		var hoursInput = $("<select></select>").addClass("hours");
		for(var i = 0; i < 24; i++) {
			var text = i.toString();
			if(i < 10) {
				text = "0" +  i.toString();
			}
			var option = $("<option></option>", {
				value:i,
				text:text
			});
			if(this.date !== null && i == this.date.getHours()) {
				option.attr("selected", "true");
			}
			hoursInput.append(option);
		}
		dateInput.append(hoursInput);
		
		var minutesInput = $("<select></select>").addClass("minutes");
		for(var i = 0; i < 60; i++) {
			var text = i.toString();
			if(i < 10) {
				text = "0" +  i.toString();
			}
			var option = $("<option></option>", {
				value:i,
				text:text
			});
			if(this.date !== null && i == this.date.getMinutes()) {
				option.attr("selected", "true");
			}
			minutesInput.append(option);
		}
		dateInput.append(minutesInput);
		
		content.append(dateInput);
		
		innerTodo.append(content);
		todo.append(innerTodo);
		
		return todo;
	};
	
	/*
	 * This method sends the method from the server.
	 */ 
	this.sendToServer = function(update) {
		
		var data = JSON.stringify(this.toJSON());
		
		if(update) {
			$.getJSON("/updatetodo?data=" + data, function() {console.log("Update todo")});
		} else {
			$.getJSON("/addtodo?data=" + data, function(){console.log("Gelukt")});
		}
	};
	
	this.toJSON = function() {
		var data = '{"message":"' + this.message;
		data += '","CreationDate":"' + this.CreationDate.sqlDateTime();
		data += '","date":' + (this.date != null?'"'+this.date.sqlDateTime()+'"':"null");
		data += ', "CompletionDate":' +  (this.CompletionDate != null?'"' + this.CompletionDate.sqlDateTime()+ '"':"null");
		data += ', "ToDoListId":' + (this.ToDoListId != null?'"' + this.ToDoListId + '"':null);
		data += ', "done":"' + (this.done?1:0).toString();
		data += '", "priority":"' + this.priority.toString();
		data += '", "id":"' + this.id + '"}';
		
		return JSON.parse(data);
	};
	
	/*
	 * This method removes the method from the server.
	 */ 
	this.removeFromServer = function() {
		$.get("/deletetodo?id=" + this.id, function() {console.log("removed from server");});
	};
	
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
		
	};
}

module.exports.Todo = Todo;

