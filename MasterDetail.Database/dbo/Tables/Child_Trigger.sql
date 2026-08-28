
    CREATE TRIGGER Child_Trigger
    ON Child
    AFTER INSERT, UPDATE, DELETE  
    AS
    BEGIN
        IF EXISTS ( SELECT * FROM deleted )
          BEGIN
           IF EXISTS(SELECT * FROM inserted) 
           BEGIN
           
                INSERT [History].[Child]
                SELECT inserted.*, 'UPDATED' as "ACTION"
                  FROM INSERTED;
           END
           ELSE
              BEGIN
              INSERT [History].[Child]
                SELECT deleted.*, 'DELETED' as "ACTION"
                  FROM DELETED;
              END
          END;
        ELSE
          BEGIN
                  
              INSERT [History].[Child]
              SELECT inserted.*, 'INSERTED' as "ACTION"
                FROM INSERTED;
          END;
    END;
  