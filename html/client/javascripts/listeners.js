"use strict";

var todoList = [];

var dueDateSelector = "<span class='dateInput'><input type='date' /><input type='time' /></span>"

$(document).ready(function () {

	$('.dateInput').hide();
	
	$.getJSON('/todos', function(response) {
		
		console.log(response);
		
		for(var i = 0; i < response.length; i++) {
			console.log("Response: " + response);
			var todo = new Todo(response[i].Text, new Date(response[i].DueDate), response[i].Completed, response[i].Priority);
			todoList[i] = todo;
			$('ul').find('li:not(#newToDo)').remove();
			$('ul').append(todo.toHTML());
		}
	});
	
	setInterval(function () {
    	console.log("Fetching the todo list from the server.");
    	$.getJSON("/todos", function(response) {
			console.log("Not Entered loop");
			for(var i = 0; i<response.length; i++) {
				console.log("Entered loop");
				
				if(response[i].DueDate !== null) {
					var datest = JSON.parse(response[i].DueDate);
					var date = new Date(datest);
				} else {
					var date = null;
				}
				console.log(date);
				var todo = new Todo(response[i].message, date, response[i].done, response[i].priority, response[i].id);	
				
				if( !($.inArray(todo, todoList)) ) {
					
					$('ul').append(todo.toHTML());
					
					todoList.push(todo);
				}
			}
		});
    }, 2000);
	

	
	
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
			removeToDo(this);
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
		for(var i=0; i < todoList.length; i++) {
			$('ul').append(todoList[i].toHTML());
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
		for(var i=0; i < todoList.length; i++) {
			$('ul').append(todoList[i].toHTML());
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
		for(var i=0; i < todoList.length; i++) {
			$('ul').append(todoList[i].toHTML());
		}
	});
		
});
