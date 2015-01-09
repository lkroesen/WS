/**
 * Created by larsstegman on 09/01/15.
 */
Date.prototype.sqlDateTime = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd  = this.getDate().toString();
    var hh = this.getHours().toString();
    var m = this.getMinutes().toString();
    var ss = this.getSeconds().toString();

    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + " " + (hh[1]?hh:"0"+hh[0]) + ":" + (m[1]?m:"0"+mm[0]) + ":" + (ss[1]?ss:"0"+ss[0]) ;
};

/*
 Can be used to find a todo or a list in an array.
 */
Array.prototype.findById = function(listId) {
    for(var i = 0; i < this.length; i++) {
        if(this[i].id == listId) {
            return this[i];
        }
    }
    return undefined;
};

/*
 * Can be used to find a to do item by using the list id and an to do id.
 */
Array.prototype.findToDoItem = function(listId, todoId) {
    var list = this.findById(listId);
    var todos = list.todos;
    for(var i = 0; i < todos.length; i++) {
        if(todos[i].id == todoId){
            return todos[i];
        }
    }
    return undefined;
};
