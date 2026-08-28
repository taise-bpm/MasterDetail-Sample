
    -- ==================================================
    -- Author:		  Dennis Abraham
    -- Create Date: 24-02-2026
    -- Description:	Proc to bulkdelete Child(s)
    -- ==================================================

    CREATE PROCEDURE [dbo].[Child_BulkDelete]
    (
        @EntityListIn Child_TVP readonly
    )
    AS
    BEGIN

    DELETE T
      FROM [dbo].[Child] T
     INNER JOIN @EntityListIn D
    ON 
                T.ChildId = D.ChildId;
               
	  SELECT IsNull(@@ROWCOUNT, 0);
  
        UPDATE H
           SET ModifiedBy = D.ModifiedBy,
               ModifiedOn = D.ModifiedOn,
               ModifiedIP = D.ModifiedIP
         FROM [History].[Child] H
    INNER JOIN @EntityListIn D
    ON  
               H.ChildId = D.ChildId
        WHERE [Action] = 'DELETE';

    END
    GO
  