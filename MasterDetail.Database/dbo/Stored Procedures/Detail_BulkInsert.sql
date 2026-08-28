
-- =============================================
-- Author:		Dennis Abraham
-- Create date: 24-02-2026
-- Description:	bulk insert Detail(s)
-- =============================================

CREATE PROCEDURE [dbo].[Detail_BulkInsert]
    @EntityListIn Detail_TVP READONLY
    AS
    BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @InsertedRecords Table (
        
          [DetailId] int , 
          [MasterId] int , 
          [Name] varchar(50)  , 
          [Descritpion] varchar(50)  , 
          [CreatedBy] varchar(50)  , 
          [CreatedOn] datetime , 
          [CreatedIP] varchar(50)  , 
          [ModifiedBy] varchar(50)  , 
          [ModifiedOn] datetime , 
          [ModifiedIP] varchar(50)      
      );

    INSERT INTO dbo.[Detail](
                                                    
                                                      [MasterId] , 
                                                      [Name] , 
                                                      [Descritpion] , 
                                                      [CreatedBy] , 
                                                      [CreatedOn] , 
                                                      [CreatedIP] , 
                                                      [ModifiedBy] , 
                                                      [ModifiedOn] , 
                                                      [ModifiedIP] 
                                                  )
	  OUTPUT inserted.* INTO @InsertedRecords    
	  SELECT 
            [MasterId] , 
            [Name] , 
            [Descritpion] , 
            [CreatedBy] , 
            [CreatedOn] , 
            [CreatedIP] , 
            [ModifiedBy] , 
            [ModifiedOn] , 
            [ModifiedIP] 
    FROM @EntityListIn;

    SELECT *
    FROM @InsertedRecords;

    END;
  