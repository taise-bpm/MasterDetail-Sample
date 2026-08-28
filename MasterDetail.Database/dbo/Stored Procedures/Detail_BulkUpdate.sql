
-- =============================================
-- Author:		Dennis Abraham
-- Create date: 24-02-2026
-- Description:	Update a batch of Detail(s)
-- =============================================

  CREATE PROCEDURE [dbo].[Detail_BulkUpdate]
    @EntityListIn Detail_TVP READONLY
  AS
  BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
  
  SET NOCOUNT ON;

    -- BULK UPDATE statements for procedure here
    UPDATE T
       SET 
            T.[MasterId] = I.[MasterId], 
            T.[Name] = I.[Name], 
            T.[Descritpion] = I.[Descritpion], 
            T.[CreatedBy] = I.[CreatedBy], 
            T.[CreatedOn] = I.[CreatedOn], 
            T.[CreatedIP] = I.[CreatedIP], 
            T.[ModifiedBy] = I.[ModifiedBy], 
            T.[ModifiedOn] = I.[ModifiedOn], 
            T.[ModifiedIP] = I.[ModifiedIP]
      FROM [Detail] T
    INNER JOIN @EntityListIn I
    ON 
            T.[DetailId] = I.[DetailId];
          
    SELECT IsNull(@@ROWCOUNT, 0);
 END
  