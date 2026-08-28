
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description: Master TVP
    -- =============================================
    CREATE TYPE [dbo].[Master_TVP] AS TABLE(
        
           [MasterId] int , 
           [Name] varchar(50)  , 
           [Descritption] varchar(50)  , 
           [CreatedBy] varchar(50)  , 
           [CreatedOn] datetime , 
           [CreatedIP] varchar(50)  , 
           [ModifiedBy] varchar(50)  , 
           [ModifiedOn] datetime , 
           [ModifiedIP] varchar(50)  
      );
  