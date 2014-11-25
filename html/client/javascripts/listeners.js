"use strict";



//This method adds a to do and takes one vairable that is the message.
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
	}
	
};

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

var todoList = [];

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
			}  else if($(this).text() === "X") {
				var id = $(this).parent().attr('data-todoid');
				$(this).parent().remove();
				todoList[id] = null;
			}
	
		
		//Als de gebruiker ergens anders klikt verandert de knop weer terug.
		$('ul').on('blur', 'li button.delete', function() {
			$(this).text("||");
		});
	});
	
	//This method handles the checkbox behaviour.
	$('ul').on('click', 'li input[type=checkbox]', function() {
		console.log("checkbox clicked");
		if($(this).is(':checked')) {
			console.log("check");
			$(this).parent().css('text-decoration','line-through');
			$(this).parent().css('color','grey');
			var id = $(this).parent().attr('data-todoid');
			todoList[id].done = true;
		} else {
			$(this).parent().css('text-decoration','none');
			$(this).parent().css('color','black');
			console.log("uncheck");
			var id = $(this).parent().attr('data-todoid');
			todoList[id].done = false;
		}
	});
		
	//This methode listens if the enter key is pressed when a to do is edited.
	$('ul').on('keypress', '.todo span', function(key) {
		if(key.which === 13) {
			console.log("BLUR IT!");
			$(this).blur();
			
			return false;
		}
	});
	
	$('ul').on('blur', '.todo', function() {
		var id = $(this).attr('data-todoid');
		if(id !== "newToDo") {
			console.log(id);
			todoList[id].message = $(this).children('.message').text();
			console.log(todoList);
		}
	});
	
	//This method listens if the button to add a date is clicked.
	$('#newToDo #addDate').on('click', function() {
		toggleDateEditor();
	});
	
	//This method listens if the date is clicked. if so 
	$('ul').on('click', 'li .duedate', function() {
			   
			   
	});
		
	
});
