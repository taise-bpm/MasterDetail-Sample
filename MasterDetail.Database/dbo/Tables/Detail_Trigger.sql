
    CREATE TRIGGER Detail_Trigger
    ON Detail
    AFTER INSERT, UPDATE, DELETE  
    AS
    BEGIN
        IF EXISTS ( SELECT * FROM deleted )
          BEGIN
           IF EXISTS(SELECT * FROM inserted) 
           BEGIN
           
                INSERT [History].[Detail]
                SELECT inserted.*, 'UPDATED' as "ACTION"
                  FROM INSERTED;
           END
           ELSE
              BEGIN
              INSERT [History].[Detail]
                SELECT deleted.*, 'DELETED' as "ACTION"
                  FROM DELETED;
              END
          END;
        ELSE
          BEGIN
                  
              INSERT [History].[Detail]
              SELECT inserted.*, 'INSERTED' as "ACTION"
                FROM INSERTED;
          END;
    END;
  