
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description:	Get all Master(s)
    -- =============================================

    CREATE PROCEDURE [dbo].[Master_GetAll]
    AS
    BEGIN
      SET NOCOUNT ON;

      SELECT *
        FROM [Master];
 
    END;
  