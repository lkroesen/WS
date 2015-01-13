delimiter //
DROP TRIGGER IF EXISTS Create_ToDo_CreationDate//
CREATE TRIGGER Create_ToDo_CreationDate BEFORE INSERT ON ToDoItem
FOR EACH ROW
BEGIN
	SET NEW.CreationDate = NOW();
END;//
delimiter ;