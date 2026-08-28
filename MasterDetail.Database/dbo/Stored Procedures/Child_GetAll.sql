
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description:	Get all Child(s)
    -- =============================================

    CREATE PROCEDURE [dbo].[Child_GetAll]
    AS
    BEGIN
      SET NOCOUNT ON;

      SELECT *
        FROM [Child];
 
    END;
  