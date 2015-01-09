"use strict";
var ToDoList = function(id, name, user) {
	this.id = id;
	this.name = name;
	this.todos = new Array();
	this.user = user;
	this.CreationDate = new Date();
	
	this.addToDo = function(todo) {
		this.todos.push(todo);
	};

	this.getTodos = function() {
		return this.todos;
	};
	
	this.removeToDoById = function(toDoId) {
		this.todos = this.todos.filter(function(element) {
			return element.id != toDoId;
		});
	};
	
	this.removeToDo = function(todo) {
		this.todos = this.todos.filter(function(element) {
			return element != todo;
		});
	};
	
	this.toHTML = function() {
		var container = $("<div></div>").addClass("listContainer");
		
		var ToDoList = $("<section></section>", {
			"data-listid":this.id
		}).addClass("todolist");
		
		var name = $("<h1></h1>", {
			"text":this.name,
			"contenteditable":true
		});
		ToDoList.append(name);
		
		var sortButtons = $("<div></div>").addClass("sortButtons");
		
		var dateButton = $("<button></button>", {
			"data-sort":"down",
			text:"Time"
		}).addClass("dateSort");
		sortButtons.append(dateButton);
		
		var prioritySort = $("<button></button>", {
			"data-sort":"down",
			text:"!!!"
		}).addClass("prioritySort");
		sortButtons.append(prioritySort);
		
		var doneSort = $("<button></button>", {
			"data-sort":"down",
			text:"✔"
		}).addClass("doneSort");
		sortButtons.append(doneSort);
		
		ToDoList.append(sortButtons);
		
		var todoItems = $("<div></div>").addClass('listItemsContainer');
		var list = $("<ul></ul>");
		
		list.append(newToDoBuilder());
		
		for(var i = 0; i < this.todos.length; i++) {
			list.append(this.todos[i].toHTML());
		}
		
		todoItems.append(list);
		ToDoList.append(todoItems);
		container.append(ToDoList);
		
		return container;	
	};
	
	this.sendToServer = function(update) {
		var data = this.toJSON();
		
		if(update) {
			$.getJSON("/updatelist?data=" + data, function() {
				console.log("Update list");
			});
		} else {
			$.getJSON("/addlist?data=" + data, function() {
				console.log("Sent list");
			});
		}
	};
	
	this.toJSON = function() {
		var data = '{"id":"' + this.id + '"';
		data += ', "name":"' + this.name + '"';
		data += ', "CreationDate":"' + this.CreationDate.sqlDateTime() + '"}';
		
		return JSON.parse(data);
	}
};

var newToDoBuilder = function() {
	var newToDo = $("<li></li>").addClass("newToDo todo");
		
	var form = $("<form></form>", {
		"onsubmit":"return false;"
	});

	var check = $("<input />", {
		"disabled":true,
		"type":"checkbox"
	});
	form.append(check);

	var textInput = $("<input />", {
		"placeholder":"New to do",
		"type":"text"
	}).addClass("toDoMessage");
	form.append(textInput);

	var prioritySelect = $("<select></select>").addClass('prioritySelector');

	for(i = 1; i<4; i++) {
		var option = $("<option></option>", {
			"value":i
		});
		var text = "";
		for(var j = 0; j < i; j++) {
			text += "!";
		}
		option.text(text);
		prioritySelect.append(option);
	}
	form.append(prioritySelect);

	var addButton  =$("<button></button>", {
		"text":"+"
	}).addClass("addButton");
	form.append(addButton);
	form.append("<br/>");

	var dateInput = $("<span></span>").addClass("duedate");
	var tomorrow = new Date(new Date().getTime() + 24*60*60*1000);
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
		if(i==tomorrow.getDate()) {
			option.attr('selected', 'selected');
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
		if(i==tomorrow.getMonth()) {
			option.attr('selected', 'selected');
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
		if(i==tomorrow.getFullYear()) {
			option.attr('selected', 'selected');
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
		if(i == 9) {
			option.attr('selected', 'selected');
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
		if(i == 0) {
			option.attr('selected', 'selected');
		}
		minutesInput.append(option);
	}
	dateInput.append(minutesInput);

	form.append(dateInput);

	newToDo.append(form);

	return newToDo;
};

module.exports.ToDoList = ToDoList;