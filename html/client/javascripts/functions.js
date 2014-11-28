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
	$(parent).parent().off('blur');
	var id = $(parent).parent().attr('data-todoid');

	$(parent).parent().remove();
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
		var todo = new Todo(message, date, false, priority);
		var todoHTML = todo.toHTML();
		
		todoList[todoList.length] = todo;
		
		$("#todos ul").append(todoHTML);
		$("#toDoMessage").val("");
		
		if ( ($('.dateInput input[type=date]').val() !== "" ) || ( $('.dateInput input[type=time]').val() !== "") ) 
			toggleDateEditor();
		console.log(todoList);
		todoList[getArrayLocation(todo.id)].sendToServer();
	}
	
}

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
