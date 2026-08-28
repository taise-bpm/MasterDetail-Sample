
    -- =============================================
    -- Author:		Dennis Abraham
    -- Create date: 24-02-2026
    -- Description: Detail TVP
    -- =============================================
    CREATE TYPE [dbo].[Detail_TVP] AS TABLE(
        
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
  