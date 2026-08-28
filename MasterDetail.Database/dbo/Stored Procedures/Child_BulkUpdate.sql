
-- =============================================
-- Author:		Dennis Abraham
-- Create date: 24-02-2026
-- Description:	Update a batch of Child(s)
-- =============================================

  CREATE PROCEDURE [dbo].[Child_BulkUpdate]
    @EntityListIn Child_TVP READONLY
  AS
  BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
  
  SET NOCOUNT ON;

    -- BULK UPDATE statements for procedure here
    UPDATE T
       SET 
            T.[MasterId] = I.[MasterId], 
            T.[DetailId] = I.[DetailId], 
            T.[Name] = I.[Name], 
            T.[Description] = I.[Description], 
            T.[CreatedBy] = I.[CreatedBy], 
            T.[CreatedOn] = I.[CreatedOn], 
            T.[CreatedIP] = I.[CreatedIP], 
            T.[ModifiedBy] = I.[ModifiedBy], 
            T.[ModifiedOn] = I.[ModifiedOn], 
            T.[ModifiedIP] = I.[ModifiedIP]
      FROM [Child] T
    INNER JOIN @EntityListIn I
    ON 
            T.[ChildId] = I.[ChildId];
          
    SELECT IsNull(@@ROWCOUNT, 0);
 END
  