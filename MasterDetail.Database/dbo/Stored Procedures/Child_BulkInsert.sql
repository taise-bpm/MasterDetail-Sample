
-- =============================================
-- Author:		Dennis Abraham
-- Create date: 24-02-2026
-- Description:	bulk insert Child(s)
-- =============================================

CREATE PROCEDURE [dbo].[Child_BulkInsert]
    @EntityListIn Child_TVP READONLY
    AS
    BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @InsertedRecords Table (
        
          [ChildId] int , 
          [MasterId] int , 
          [DetailId] int , 
          [Name] varchar(50)  , 
          [Description] varchar(50)  , 
          [CreatedBy] varchar(50)  , 
          [CreatedOn] datetime , 
          [CreatedIP] varchar(50)  , 
          [ModifiedBy] varchar(50)  , 
          [ModifiedOn] datetime , 
          [ModifiedIP] varchar(50)      
      );

    INSERT INTO dbo.[Child](
                                                    
                                                      [MasterId] , 
                                                      [DetailId] , 
                                                      [Name] , 
                                                      [Description] , 
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
            [DetailId] , 
            [Name] , 
            [Description] , 
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
  