"use strict";
function Todo(message, date, done, priority ) {
	this.message = message;
	this.date = date;
	this.done = done;
	this.priority = parseInt(priority);
	
	var idGenerator = new Date();
	
	this.id = idGenerator.getMonth();
	this.id *= idGenerator.getDate();
	this.id *= idGenerator.getHours();
	this.id *= idGenerator.getMinutes();
	this.id -= idGenerator.getSeconds();
	this.id += idGenerator.getMilliseconds();
	this.id = this.id.toString();
	
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
		
		if(date !== null) {
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
			todo += "'/><input type='time' value='";
			todo += this.date.getHours() + ":" + this.date.getMinutes() + "'/>";
			todo += "</span>";
		} else {
			todo += "<span class='duedate'><input type='date'/><input type='time'/></span>";
		}
		

		todo += "</li>";
		
		return todo;
	}
	
	this.sendToServer = function() {
		console.log("Starting...");
		$.getJSON("localhost:3000/addtodo?data=" + JSON.stringify(this), function(){console.log("Gelukt")});
		console.log("Ended.");
	}
}

