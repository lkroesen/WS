var removeToDo = function (parent) {
	console.log("Starting to remove");
	var toDoItem = $(parent).parents('.todo');
	var id = $(toDoItem).attr('data-todoid');

	$(toDoItem).fadeOut(800, function () {
		$(toDoItem).off('#todolists', 'ul li.todo[data-todoid="' + id +'"');
		$(toDoItem).remove();
	});

	$.get('/deletetodo?id=' + id);
};

var addToDo = function(target) {

	var newTodo = $(target).parents('.todo');
	var message = $(newTodo).find('.toDoMessage').val();
	var toDoListId = $(newTodo).parents('.todolist').attr('data-listid');

	var year = $(newTodo).find(".year").val();
	var month = $(newTodo).find(".month").val() - 1;
	var day = $(newTodo).find(".day").val();
	var hours = $(newTodo).find(".hours").val();
	var minutes = $(newTodo).find(".minutes").val();

	var date = new Date(year, month, day, hours, minutes);

	var priority = $(newTodo).find('.prioritySelector').val();

	$(newTodo).find('.toDoMessage').val("");

	if (message !== "") {
		var todo = {};
		todo.message = message;
		todo.toDoListId = toDoListId;
		todo.date = date;
		todo.priority = priority;

		var data = JSON.stringify(todo);
		console.log(data);
		$.get('/addtodo?data=' + data, function(response) {
			$(newTodo).after(response);
		});
	}
};

var updateToDo = function(toDoItem) {
	var todoId = $(toDoItem).attr('data-todoid');

	var done = $(toDoItem).find('input[type="checkbox"]').is(':checked');
	var message = $(toDoItem).find('.message').text();
	var priority = $(toDoItem).find('.priority select').val();

	var day = $(toDoItem).find('.day').val();
	var month = $(toDoItem).find('.month').val() - 1;
	var year = $(toDoItem).find('.year').val();
	var hours = $(toDoItem).find('.hours').val();
	var minutes = $(toDoItem).find('.minutes').val();

	var date = new Date(year, month, day, hours, minutes);
	$(toDoItem).attr('data-duedate', date);

	evaluateToDo(toDoItem, date, done, priority);

	var todo = {};
	todo.toDoId = todoId;
	todo.message = message;
	todo.done = done;
	todo.priority = priority;
	todo.date = date;

	var data = JSON.stringify(todo);
	$.get('/updatetodo?data=' + data);

};


var addNewList = function() {
	$.get('addlist', function(response) {
		$('#todolists').append(response);
		var id = $(response).children('section').attr('data-listid');
		console.log("List id: " + id);
		var newList = $('section[data-listid="' + id + '"]').parent();

		$(newList).css("visibility", "hidden");

		var contentWidth = $('#content').width() + $(newList).width() + 40;
		$('#content').width(contentWidth);

		var offset = $(newList).offset().left;
		$('body').animate({
			scrollLeft:offset
		}, 1400, 'swing', function() {
			$(newList).css("visibility", "visible");
			$(newList).css("opacity", 0);
			$(newList).animate({
				opacity:1
			}, 300);
		});

	});
};

var updateList = function(listElement) {
	var list = {};
	list.name = $(listElement).find('h1').text();;
	list.id = $(listElement).attr('data-listid');

	var data = JSON.stringify(list);
	$.get("/updatelist?data=" + data);
};

var isOverDue = function(date) {
	return date.getTime() < (new Date()).getTime();
};


var isVeryDue = function(date) {
	return ((date.getTime() - (new Date()).getTime()) < (3*60*60*1000)) && !isOverDue(date);
};


var isDue = function(date) {
	return date.getTime() - new Date().getTime() < 43200000 && !isOverDue(date) && !isVeryDue(date);
};

var evaluateToDo = function(todo, date, done, priority) {
	console.log("Evaluating todo classes");
	$(todo).attr('class', 'todo');
	if(!date) {
		date = new Date($(todo).attr('data-duedate'));
		done = $(todo).find('input[type="checkbox"]').is(':checked');
		priority = $(todo).find('.priority select').val();
	}

	if(isOverDue(date)) {
		$(todo).addClass('overDue');
	}
	if(isVeryDue(date)) {
		$(todo).addClass('veryDue');
	}
	if(isDue(date)) {
		$(todo).addClass('due');
	}

	switch(parseInt(priority)) {
		case 1: $(todo).addClass('priority1'); break;
		case 2: $(todo).addClass('priority2'); break;
		case 3: $(todo).addClass('priority3'); break;
	}

	if(done) {
		$(todo).addClass('done');
	}
};

var setBackground = function(url) {
	if(url != '') {
		$('#backgroundURL input').css('background-color', 'rgba(255,0,0,0.7)');
		if(url.endsWith(".gif") || url.endsWith(".jpg") || url.endsWith(".png") ) {
			$.cookie('background_cookie', url, {expires:7, path:"/"});
			$('#backgroundURL input').css('background-color', 'rgba(0,0,0,0.7)');
			var cssUrl = "url('" + url + "')";
			$('body').css('background-image', cssUrl);
		}
	}
	if(url == 'default') {
		$('#backgroundURL input').css('background-color', 'rgba(0,0,0,0.7)');
		$('#backgroundURL input').val("");
		$.cookie('background_cookie', url, {expires:7, path:"/"});
		var cssUrl = "url('http://upload.wikimedia.org/wikipedia/commons/a/af/Flickr_-_…trialsanderrors_-_River_valley,_Montenegro,_ca._1895.jpg')";
		$('body').css('background-image', cssUrl);
	}
};