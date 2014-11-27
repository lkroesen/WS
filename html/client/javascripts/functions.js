var getToDoMessage = function() {
	return $("#toDoMessage").val();
}

var getPriority = function() {
	return $('#newToDo select').val();
}

var getToDoDueDate = function(id) {
	
	var date = $('.dateInput input[type=date]').val();
	var time = $('.dateInput input[type=time]').val();

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

var addToDo = function() {

	var message = getToDoMessage();
	var date = getToDoDueDate();
	var priority = getPriority();	
	if(message !== "") {
		var todo = new Todo(message, date, false, priority);
		var todoHTML = todo.toHTML();
		
		todoList[todo.id] = todo;
		
		$("#todos ul").append(todoHTML);
		$("#toDoMessage").val("");
		
		if ( ($('.dateInput input[type=date]').val() !== "" ) || ( $('.dateInput input[type=time]').val() !== "") ) 
			toggleDateEditor();
		console.log(todoList);
		todoList[todo.id].sendToServer();
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
