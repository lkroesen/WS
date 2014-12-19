$(document).ready(function(){
	$.get("/stats/finished", function(response) {
		$('#completed').append(response);
	});
	
	$.get("/stats/unfinished", function(response) {
		console.log(response);
		$('#todo').append(response);
	});
	
	$.get("/stats/total", function(response) {
		$('#total').append(response);
	});
	
});