delimiter //
DROP TRIGGER IF EXISTS Update_CompletionDate//
CREATE TRIGGER Update_CompletionDate BEFORE UPDATE ON ToDoItem
FOR EACH ROW
BEGIN
	IF OLD.Completed = 0 AND NEW.Completed = 1 THEN
		SET NEW.CompletionDate = NOW();
	ELSEIF OLD.Completed = 1 AND NEW.Completed = 0 THEN
		SET NEW.CompletionDate = null;
	ELSEIF OLD.Completed = NEW.Completed THEN
		SET NEW.CompletionDate = OLD.CompletionDate;
	END IF;
END;//
delimiter ;