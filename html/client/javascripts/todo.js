"use strict";
function Todo(message, date, done, priority ) {
	this.message = message;
	this.date = date;
	this.done = done;
	this.priority = priority;
	
	this.id = new Date().getFullYear();
	this.id *= new Date().getMonth();
	this.id *= new Date().getDate();
	this.id *= new Date().getHours();
	this.id *= new Date().getMinutes();
	this.id -= new Date().getSeconds();
	this.id += new Date().getMilliseconds();
	
	this.toHTML = function() {
		var todo = "<li class='todo' data-todoid='" + this.id;
		todo += "'><input type='checkbox' /><span class='message' contenteditable='true' >";
		todo += message;
		todo += "</span><button class='delete'>||</button><br />";
		if(date !== null) {
			todo += "<span class='duedate'>" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			
			if(date.getHours() !== 0 || date.getMinutes() !== 0)  {
				todo += " " + date.getHours() + ":" + date.getMinutes();
			}
			todo += "</span>";
			todo += "<span class='priority'><select><option value='1'>!</option><option value='2'>!!</option><option value='3'>!!!</option></select></span>"
		}
		
		todo += "</li>";
		
		return todo;
	}
}

