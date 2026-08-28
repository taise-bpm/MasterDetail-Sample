
    -- ==================================================
    -- Author:		  Dennis Abraham
    -- Create Date: 24-02-2026
    -- Description:	Proc to bulkdelete Detail(s)
    -- ==================================================

    CREATE PROCEDURE [dbo].[Detail_BulkDelete]
    (
        @EntityListIn Detail_TVP readonly
    )
    AS
    BEGIN

    DELETE T
      FROM [dbo].[Detail] T
     INNER JOIN @EntityListIn D
    ON 
                T.DetailId = D.DetailId;
               
	  SELECT IsNull(@@ROWCOUNT, 0);
  
        UPDATE H
           SET ModifiedBy = D.ModifiedBy,
               ModifiedOn = D.ModifiedOn,
               ModifiedIP = D.ModifiedIP
         FROM [History].[Detail] H
    INNER JOIN @EntityListIn D
    ON  
               H.DetailId = D.DetailId
        WHERE [Action] = 'DELETE';

    END
    GO
  