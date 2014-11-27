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
		todo += "'><input type='checkbox' /><span class='message' contenteditable='true' >";
		todo += message;
		todo += "</span><button class='delete'>||</button>";
		//<select>
		todo += "<span class='priority'><select id='select" + this.id + "'>";
		todo += "<option selected='selected'>" 

		console.log(priority);

		if (priority === 1)
		{todo += "!" + "</option>";}

		if (priority === 2)
		{todo += "!!" + "</option>";}

		if (priority === 3)
		{todo += "!!!" + "</option>";}

		todo += "<option value='1'>!</option><option value='2'>!!</option><option value='3'>!!!</option></select></span><br />";
		
		if(date !== null) {
			todo += "<span class='duedate'>" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			
			if(date.getHours() !== 0 || date.getMinutes() !== 0)  {
				todo += " " + date.getHours() + ":" + date.getMinutes();
			}
			todo += "</span>";
		}
		
		switch(this.priority){
				case 1: todo += "<span class='priority'><select><option value='1' selected='selected'>!</option><option value='2'>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 2: todo += "<span class='priority'><select><option value='1'>!</option><option value='2' selected='selected'>!!</option><option value='3'>!!!</option></select></span>"; break;
				case 3: todo += "<span class='priority'><select><option value='1'>!</option><option value='2'>!!</option><option value='3' selected='selected'>!!!</option></select></span>"; break;
		}
		todo += "</li>";
		
		return todo;
	}
}

