

//This method adds a to do and takes one vairable that is the message.
var addToDo = function(message) {
	if(message !== "") {
		var todo = "<li class='todo'><input type='checkbox' />";
		todo += message;
		todo += "<button>EDIT</button><br /><button class='delete'>| |</button></li>";
		$("#todos ul").append(todo);
		$("#toDoMessage").val("");
	}
	
};

$(document).ready(function() {
	//This method checks if the enterkey is pressed to add a to do to the list.
	
	$('#toDoMessage').on('keypress', function(e) {
		//Check if enter was pressed. If so, continue.
		if(e.which === 13) {
			
			var foo = $("#toDoMessage").val();
			
			addToDo(foo);	
			
			console.log("Enter pressed");	
			return false;
		}
		
		
	});
	
	
	//This method checks if the + button is pressed to add a to do to the list.
	$('#addButton').on('click', function() {
		
		var foo = $("#toDoMessage").val();	
		addToDo(foo);
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
	
	$('ul').on('click', 'li input[type="checkbox"]', function() {
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
		
		
	
});
