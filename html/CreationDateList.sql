delimiter //
DROP TRIGGER IF EXISTS Create_List_CreationDate//
CREATE TRIGGER Create_List_CreationDate BEFORE INSERT ON ToDoList
FOR EACH ROW
BEGIN
	SET NEW.CreationDate = NOW();
    SET NEW.IsPublic = 0;
END;//
delimiter ;