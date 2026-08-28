
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description: Child TVP
    -- =============================================
    CREATE TYPE [dbo].[Child_TVP] AS TABLE(
        
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
  