
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description:	Get all Detail(s)
    -- =============================================

    CREATE PROCEDURE [dbo].[Detail_GetAll]
    AS
    BEGIN
      SET NOCOUNT ON;

      SELECT *
        FROM [Detail];
 
    END;
  