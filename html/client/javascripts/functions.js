var getToDoMessage = function() {
	return $("#toDoMessage").val();
}

var getPriority = function() {
	return $('#newToDo select').val();
}

var getToDoDueDate = function() {
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