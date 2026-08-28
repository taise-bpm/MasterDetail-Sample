
    CREATE TRIGGER Master_Trigger
    ON Master
    AFTER INSERT, UPDATE, DELETE  
    AS
    BEGIN
        IF EXISTS ( SELECT * FROM deleted )
          BEGIN
           IF EXISTS(SELECT * FROM inserted) 
           BEGIN
           
                INSERT [History].[Master]
                SELECT inserted.*, 'UPDATED' as "ACTION"
                  FROM INSERTED;
           END
           ELSE
              BEGIN
              INSERT [History].[Master]
                SELECT deleted.*, 'DELETED' as "ACTION"
                  FROM DELETED;
              END
          END;
        ELSE
          BEGIN
                  
              INSERT [History].[Master]
              SELECT inserted.*, 'INSERTED' as "ACTION"
                FROM INSERTED;
          END;
    END;
  