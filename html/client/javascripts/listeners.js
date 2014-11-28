"use strict";

var todoList = [];

var dueDateSelector = "<span class='dateInput'><input type='date' /><input type='time' /></span>"

$(document).ready(function () {

	$('.dateInput').hide();
	
	//This method checks if the enterkey is pressed to add a to do to the list.
	$('#newToDo form').on('keypress', function (key) {
		//Check if enter was pressed. If so, continue.
		if (key.which === 13) {
			addToDo();
			console.log("Enter pressed");
			return false;
		}
	});
	
	//This method checks if the + button is pressed to add a to do to the list.
	$('#addButton').on('click', function() {
		addToDo();
		console.log("Pressed the + button");
		return false;
	});
	
	//This method removes a to do.
	$('ul').on('click', 'li button.delete', function() {
		
		console.log("Remove button clicked.");

		//Er moet twee keer geklikt worden om het item echt te verwijderen.
		if($(this).text() === "||") {
			$(this).text("X")
			$(this).focusin();
		} else if($(this).text() === "X") {
			var id = $(this).parent().attr('data-todoid');
			$(this).parent().remove();
			todoList.splice(getArrayLocation(id),1);
			console.log(todoList);
		}
		
		//Als de gebruiker ergens anders klikt verandert de knop weer terug.
		$('ul').on('blur', 'li button.delete', function() {
			$(this).text("||");
		});
	});
	
	//This method handles the checkbox behaviour.
	$('ul').on('change', 'li input[type=checkbox]', function() {
		console.log("checkbox clicked");
		if($(this).is(':checked')) {
			console.log("check");
			$(this).parent().css('text-decoration','line-through');
			$(this).parent().css('color','grey');
			var id = $(this).parent().attr('data-todoid');
			todoList[getArrayLocation(id)].done = true;
		} else {
			$(this).parent().css('text-decoration','none');
			$(this).parent().css('color','black');
			console.log("uncheck");
			var id = $(this).parent().attr('data-todoid');
			todoList[getArrayLocation(id)].done = false;
		}
	});
		
	//This methode listens if the enter key is pressed when a to do is edited.
	$('ul').on('keypress', '.todo span', function(key) {
		if(key.which === 13) {
			console.log("BLUR IT!");
			$(this).parent().blur();
			return false;
		}
	});
	
	//This method updates the to do on blur.
	$('ul').on('blur', 'li:not(#newToDo)', function() {
		var message = $(this).find('.message').text();
		var done = $(this).find('input[type=checkbox]').is(':checked')
		var priority = $(this).find('.priority select').val();
		
		var dateString = $(this).find('.duedate input[type="date"]').val();
		var time = $(this).find('.duedate input[type=time]').val();
		var date = getToDoDueDate(dateString, time);
		var id = $(this).attr('data-todoid');
		
		var location = getArrayLocation(id);
		todoList[location].message = message;
		todoList[location].date = date;
		todoList[location].priority = priority;
		todoList[location].done = done;
		console.log("Changed the todo");
		todoList[location].sendToServer();
	});
	
	//This method listens if the button to add a date is clicked.
	$('#newToDo #addDate').on('click', function() {
		toggleDateEditor();
	});
	
	/////////////////////////////////////////////////////
	/*
		The sort listeners.
	*/
	//This method listens to the dateSort button.
	$('#dateSort').on('click', function(){
		var sort = $(this).attr('data-sort');
		if(sort == 'down') {
			$(this).attr('data-sort', 'up');
			todoList.sort(function(a, b) {
				return a.date - b.date;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoList.sort(function(a,b) {
				return b.date - a.date;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var todo in todoList) {
			$('ul').append(todoList[todo].toHTML());
		}
	});
	
	$('#urgencySort').on('click', function(){
		var sort = $(this).attr('data-sort');
		if(sort == 'down') {
			$(this).attr('data-sort', 'up');
			todoList.sort(function(a,b) {
				return a.priority - b.priority;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoList.sort(function(a, b) {
				return b.priority - a.priority;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var todo in todoList) {
			$('ul').append(todoList[todo].toHTML());
		}
	});
	
	$('#doneSort').on('click', function(){
		var sort = $(this).attr('data-sort');
		if(sort == 'down') {
			$(this).attr('data-sort', 'up');
			todoList.sort(function(a,b) {
				return a.done - b.done;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoList.sort(function(a, b) {
				return b.done - a.done;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var todo in todoList) {
			$('ul').append(todoList[todo].toHTML());
		}
	});
		
});
