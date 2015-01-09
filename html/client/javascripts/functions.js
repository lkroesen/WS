var getArrayLocation = function(id) {
	for(var x = 0; x < todoLists.length; x++) {
		if(todoLists[x].id == id) {
			return x;
		}
	}
	return -1;
}

var removeToDo = function (parent) {
	console.log("Starting to remove");
	var toDoItem = $(parent).parents('.todo');
	console.log(toDoItem);
	var id = $(toDoItem).attr('data-todoid');
	var listid = $(toDoItem).parents('.todolist').attr('data-listid');
	console.log("ToDo: " + id + " List: " + listid);
	$(toDoItem).fadeOut(800, function () {
		$(toDoItem).off('blur');
		$(toDoItem).remove();
	});

	var todo = todoLists.findToDoItem(listid, id);
	todo.removeFromServer();
	todoLists.findById(listid).removeToDo(todo);
};

var addToDo = function(target) {

	var newTodo = $(target).parents('.todo');
	var message = $(newTodo).find('.toDoMessage').val();
	var toDoListId = $(newTodo).parents('.todolist').attr('data-listid');

	var year = $(newTodo).find(".year").val();
	var month = $(newTodo).find(".month").val() - 1;
	var day = $(newTodo).find(".day").val();
	var hours = $(newTodo).find(".hours").val();
	var minutes = $(newTodo).find(".minutes").val();

	var date = new Date(year, month, day, hours, minutes);

	var priority = $(newTodo).find('.prioritySelector').val();
	if (message !== "") {
		$.get("/newid?type=todo", function (response) {
			var id = parseInt(response);
			var todo = new Todo(id, message, date, false, priority, toDoListId);
			var todoHTML = todo.toHTML();

			todoLists.findById(todo.ToDoListId).addToDo(todo);
			$(newTodo).after(todoHTML);
			$(newTodo).find('.toDoMessage').val("");

			todo.sendToServer(false);
		});
	}
};

var updateToDo = function(toDoItem) {
	var todoId = $(toDoItem).attr('data-todoid');
	var listId = $(toDoItem).parents('.todolist').attr('data-listid');

	var done = $(toDoItem).find('input[type="checkbox"]').is(':checked');
	var message = $(toDoItem).find('.message').text();
	var priority = $(toDoItem).find('.priority').val();

	var day = $(toDoItem).find('.day').val();
	var month = $(toDoItem).find('.month').val();
	var year = $(toDoItem).find('.year').val();
	var hours = $(toDoItem).find('.hours').val();
	var minutes = $(toDoItem).find('.minutes').val();

	var date = new Date(year, month, day, hours, minutes);

	var todo = todoLists.findToDoItem(listId, todoId);
	todo.message = message;
	todo.priority = priority;
	todo.date = date;
	todo.setDone(done);



	todo.sendToServer(true);


};


var addNewList = function() {
	$.get("/newid?type=list", function(response) {
			var id = parseInt(response);
			var newList = new ToDoList(id, "New list, click to edit");
			todoLists.push(newList);
		
			addList(newList);
	});
};

//This method gets the todos from the database.
var getTodosFromServer = function(time) {
	$.getJSON('/todos?time=' + time, function(response) {
		for(var i = 0; i < response.length; i++) {	
			if(!todoLists.findById(response[i].ListId)) {
				todoLists.push(new ToDoList(response[i].ListId, response[i].List));
			}
			
			var todo = new Todo(response[i].ToDoId, response[i].Message, new Date(response[i].DueDate), response[i].Completed, response[i].Priority, response[i].ListId,  new Date(response[i].CreationDate), new Date(response[i].CompletionDate)); 

			todoLists.findById(todo.ToDoListId).todos.push(todo);
		}
		if(time != undefined){
			for(var i = 0; i < todoLists.length; i++) {
				addList(todoLists[i]);
			}
		}
	});
};

var contains = function(other) {
	for(var i = 0; todoLists.length; i++) {
		if(todoLists[i].id == other.id) {
			return true;
		}
	}
	return false;
};

var addList = function(list) {
	var listHTML = list.toHTML().hide();
	$('#todolists').append(listHTML);
	listHTML.fadeIn(1200);
	var selector = '*[data-listid="' + list.id + '"]';
	var width = $('#content').width() + $(selector).width();
	$('#content').width(width);
};

var newDateInput = function() {
	var dateInput = $("<span></span>").addClass("dateInput");

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
		monthInput.append(option);
	}
	dateInput.append(monthInput);

	var yearInput = $("<select></select>").addClass("year");
	for(var i = (new Date().getFullYear() - 10); i < (new Date().getFullYear() + 10); i++) {
		var option = $("<option></option>", {
			value:i,
			text:i
		});
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
		minutesInput.append(option);
	}
	dateInput.append(minutesInput);
	
	return dateInput;
};