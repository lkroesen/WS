'use strict';

//This method adds a to do and takes one vairable that is the message.
function addToDo() {

	var message = getToDoMessage();
	var date = getToDoDueDate();
	
	if(message !== "") {
		var todo = "<li class='todo'><input type='checkbox' /><span contenteditable='true' >";
		todo += message;
		todo += "</span><button class='delete'>||</button><br />";
		if(date !== null) {
			todo += "<span class='duedate'>" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			
			if(date.getHours() !== 0 || date.getMinutes() !== 0)  {
				todo += " " + date.getHours() + ":" + date.getMinutes();
			}
			todo += "</span>";
		}
		
		todo += "</li>";
		
		$("#todos ul").append(todo);
		$("#toDoMessage").val("");
		
		if ( ($('.dateInput input[type=date]').val() !== "" ) || ( $('.dateInput input[type=time]').val() !== "") ) 
			toggleDateEditor();
	}
	
};

function toggleDateEditor() {
	if($('.dateInput').is(':hidden')) {
			$('.dateInput').show();
		}
		else {
			$('.dateInput').hide();
			$('.dateInput input[type=date]').val("");
			$('.dateInput input[type=time]').val("");
		}
}

function getToDoMessage() {
	return $("#toDoMessage").val();
}

function getToDoDueDate() {
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
			$(this).parent().remove();
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
		} else {
			$(this).parent().css('text-decoration','none');
			$(this).parent().css('color','black');
			console.log("uncheck");
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
	
	//This method listens if the button to add a date is clicked.
	$('#newToDo #addDate').on('click', function() {
		toggleDateEditor();
	});
	
	//This method listens if the date is clicked. if so 
	$('ul').on('click', 'li .duedate', function() {
			   
			   
	});
		
	
});
