Date.prototype.sqlDateTime = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd  = this.getDate().toString();
	var hh = this.getHours().toString();
	var m = this.getMinutes().toString();
	var ss = this.getSeconds().toString();
	
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + " " + (hh[1]?hh:"0"+hh[0]) + ":" + (m[1]?m:"0"+mm[0]) + ":" + (ss[1]?ss:"0"+ss[0]) ;
  };


var getToDoMessage = function() {
	return $("#toDoMessage").val();
}

var getPriority = function() {
	return $('#newToDo select').val();
}

var getToDoDueDate = function(date, time) {
	if(date !== "") {
		var year = date.slice(0,4);
		var month = date.slice(5, 7) - 1;
		var day = date.slice(8,10);

		var hours = 0;
		var minutes = 0;
		if(time !== "") {
			hours = time.slice(0,2);
			minutes = time.slice(3, 5);
		}

		var newDate = new Date(year, month, day, hours, minutes);
		console.log(newDate);
		return newDate;
	}

	
	return null;
}


var getArrayLocation= function(id) {
	for(var x = 0; x < todoList.length; x++) {
		if(todoList[x].id == id) {
			return x;
		}
	}
	return -1;
}

var removeToDo = function(parent) {
	console.log("Starting to remove");
	var toDoItem = getToDoElement(parent);
	$(toDoItem).blur();
	var id = $(toDoItem).attr('data-todoid');
	$(toDoItem).animate({
		left:-500,
		opacity: 0
	}, 500, function() {
		$(toDoItem).remove();
	});
	
	console.log(getArrayLocation(id));
	todoList[getArrayLocation(id)].removeFromServer();
	
	todoList.splice(getArrayLocation(id),1);
	console.log(todoList);
}

var addToDo = function() {

	var message = getToDoMessage();
	
	var dateString = $('.dateInput input[type=date]').val();
	var time = $('.dateInput input[type=time]').val();
	var date = getToDoDueDate(dateString, time);
	
	var priority = getPriority();	
	if(message !== "") {
		$.get("/newid", function(response) {
			var id = parseInt(response);
			var todo = new Todo(message, date, false, priority, id);
			var todoHTML = todo.toHTML();

			todoList[todoList.length] = todo;

			$("#todos ul").append(todoHTML);
			$("#toDoMessage").val("");

			if ( ($('.dateInput input[type=date]').val() !== "" ) || ( $('.dateInput input[type=time]').val() !== "") ) 
				toggleDateEditor();
			todoList[getArrayLocation(todo.id)].sendToServer();
			
		});
		
	}
	
}

//Toggles the date editor in a new to do.
var toggleDateEditor = function() {
	if($('.dateInput').is(':hidden')) {
			$('.dateInput').show();
	}
	else {
		$('.dateInput').hide();
		$('.dateInput input[type=date]').val("");
		$('.dateInput input[type=time]').val("");
	}
}

//This method gets the todos from the database.
var getTodosFromServer = function(time) {
	$.getJSON('/todos?time=' + time, function(response) {

		for(var i = 0; i < response.length; i++) {
			var todo = new Todo(response[i].Text, new Date(response[i].DueDate), response[i].Completed, response[i].Priority, response[i].Id, response[i].CompletionDate, response[i].ToDoListId);
			
			todoList.push(todo);

			$('ul').append(todo.toHTML());
		}
		
		console.log(todoList);
	
	});
}

var contains = function(other) {
	for(var i = 0; todoList.length; i++) {
		if(todoList[i].id == other.id) {
			return true;
		}
	}
	return false;
}

var getToDoElement = function(parent) {
	if(!$(parent).hasClass("todo")) {
		return getToDoElement($(parent).parent());
	}
	return parent;
}

