
    -- ==================================================
    -- Author:		  Dennis Abraham
    -- Create Date: 24-02-2026
    -- Description:	Proc to bulkdelete Master(s)
    -- ==================================================

    CREATE PROCEDURE [dbo].[Master_BulkDelete]
    (
        @EntityListIn Master_TVP readonly
    )
    AS
    BEGIN

    DELETE T
      FROM [dbo].[Master] T
     INNER JOIN @EntityListIn D
    ON 
                T.MasterId = D.MasterId;
               
	  SELECT IsNull(@@ROWCOUNT, 0);
  
        UPDATE H
           SET ModifiedBy = D.ModifiedBy,
               ModifiedOn = D.ModifiedOn,
               ModifiedIP = D.ModifiedIP
         FROM [History].[Master] H
    INNER JOIN @EntityListIn D
    ON  
               H.MasterId = D.MasterId
        WHERE [Action] = 'DELETE';

    END
    GO
  