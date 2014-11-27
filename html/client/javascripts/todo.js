"use strict";
function Todo(message, date, done, priority ) {
	this.message = message;
	this.date = date;
	this.done = done;
	this.priority = parseInt(priority);
	
	this.id = new Date().getFullYear();
	this.id *= new Date().getMonth();
	this.id *= new Date().getDate();
	this.id *= new Date().getHours();
	this.id *= new Date().getMinutes();
	this.id -= new Date().getSeconds();
	this.id += new Date().getMilliseconds();
	
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
			todo += "<span class='duedate'>" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			
			if(date.getHours() !== 0 || date.getMinutes() !== 0)  {
				todo += " " + date.getHours() + ":" + date.getMinutes();
			}
			todo += "</span>";
		}
		

		todo += "</li>";
		
		return todo;
	}
	
	this.sendToServer = function() {
		$.getJSON("localhost:3000/addtodo?data=" + JSON.stringify(this), function(){console.log("Gelukt")});
	}
}

