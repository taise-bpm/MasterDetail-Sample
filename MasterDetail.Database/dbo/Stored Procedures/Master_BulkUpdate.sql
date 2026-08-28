
-- =============================================
-- Author:		Dennis Abraham
-- Create date: 24-02-2026
-- Description:	Update a batch of Master(s)
-- =============================================

  CREATE PROCEDURE [dbo].[Master_BulkUpdate]
    @EntityListIn Master_TVP READONLY
  AS
  BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
  
  SET NOCOUNT ON;

    -- BULK UPDATE statements for procedure here
    UPDATE T
       SET 
            T.[Name] = I.[Name], 
            T.[Descritption] = I.[Descritption], 
            T.[CreatedBy] = I.[CreatedBy], 
            T.[CreatedOn] = I.[CreatedOn], 
            T.[CreatedIP] = I.[CreatedIP], 
            T.[ModifiedBy] = I.[ModifiedBy], 
            T.[ModifiedOn] = I.[ModifiedOn], 
            T.[ModifiedIP] = I.[ModifiedIP]
      FROM [Master] T
    INNER JOIN @EntityListIn I
    ON 
            T.[MasterId] = I.[MasterId];
          
    SELECT IsNull(@@ROWCOUNT, 0);
 END
  