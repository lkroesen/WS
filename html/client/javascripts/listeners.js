"use strict";

var todoLists = [];

$(document).ready(function () {

	if($.cookie('background_cookie')) {
		var url = $.cookie('background_cookie');
		setBackground(url);
	}

	$('#preferences').hide();

	$('#backgroundURL input').on('blur', function() {
		var url = $(this).val();
		setBackground(url);
	});

	$('#defaultBackground button').on('click', function()  {
		setBackground("default");
	});

	setInterval(function() {
		var todos = $('.todo:not(.newToDo)');
		for(var i = 0; i < todos.length; i++) {
			evaluateToDo(todos[i]);
		}
	}, 30000);

	$('#preferencesB').on('click', function() {
		$('#preferences').toggle();
		return false;
	});

	//This method checks if the enterkey is pressed to add a to do to the list.
	$('#todolists').on('keypress', '.newToDo .toDoMessage', function (key) {
		//Check if enter was pressed. If so, continue.
		if (key.which === 13) {
			addToDo(this);
			console.log("Enter pressed");
			return false;
		}
	});
	
	//This method checks if the + button is pressed to add a to do to the list.
	$('#todolists').on('click', '.addButton', function() {
		addToDo(this);
		console.log("Pressed the add to do button");
		return false;
	});
	
	$('#todolists').on('keypress', '.todolist h1', function(key) {
		if(key.which === 13) {
			$(this).blur();
			console.log("Updating list name");
			updateList($(this).parents('.todolist'));
			return false;
		}
	});

	//This method listens if the button to add a new list is clicked.
	$("#newlist").on('click', function() {
		console.log("Pressed the add list button");
		addNewList();
	});
	
	//This method removes a to do.
	$('#todolists').on('click', 'ul li.todo button.delete', function() {
		console.log("Remove button clicked.");
		
		//Er moet twee keer geklikt worden om het item echt te verwijderen.
		if($(this).text() == "||") {
			$(this).text("X");
			console.log(this);
			$(this).focus();
		} else if($(this).text() == "X") {
			removeToDo(this);
		}
	});

	//Als de gebruiker ergens anders klikt verandert de knop weer terug.
	$('#todolists').on('blur', 'ul li.todo button.delete', function() {
		console.log("Lost focus on button delete");
		$(this).text('||');
	});
	
	//This method handles the checkbox behaviour.
	$('ul').on('change', '.todo:not(#newToDo) input[type=checkbox]', function() {
		console.log("checkbox clicked");
		var todoElement = $(this).parents('.todo');
		updateToDo(todoElement);
	});
		
	//This methode listens if the enter key is pressed when a to do is edited.
	$('ul').on('keypress', '.todo span', function(key) {
		if(key.which === 13) {
			console.log("BLUR IT!");
			$(this).blur();
			updateToDo($(this).parents('.todo'));
			return false;
		}
	});
	
	//This method updates the to do on blur.
	$('#todolists').on('blur', 'li:not(#newToDo)', function() {
		console.log("Lost focus on ");
		console.log($(this));
		updateToDo(this);
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
			todoLists.sort(function(a, b) {
				return a.date - b.date;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoLists.sort(function(a,b) {
				return b.date - a.date;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var i=0; i < todoLists.length; i++) {
			$('ul').append(todoLists[i].toHTML());
		}
	});
	
	$('#urgencySort').on('click', function(){
		var sort = $(this).attr('data-sort');
		if(sort == 'down') {
			$(this).attr('data-sort', 'up');
			todoLists.sort(function(a,b) {
				return a.priority - b.priority;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoLists.sort(function(a, b) {
				return b.priority - a.priority;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var i=0; i < todoLists.length; i++) {
			$('ul').append(todoLists[i].toHTML());
		}
	});
	
	$('#doneSort').on('click', function(){
		var sort = $(this).attr('data-sort');
		if(sort == 'down') {
			$(this).attr('data-sort', 'up');
			todoLists.sort(function(a,b) {
				return a.done - b.done;
			});
		} else if(sort == 'up') {
			$(this).attr('data-sort', 'down');
			todoLists.sort(function(a, b) {
				return b.done - a.done;
			});
		}
		
		$('ul').find('li:not(#newToDo)').remove();
		for(var i=0; i < todoLists.length; i++) {
			$('ul').append(todoLists[i].toHTML());
		}
	});
		
});
