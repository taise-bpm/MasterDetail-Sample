
    CREATE TABLE [dbo].[Child]
    (
      
      [ChildId] int IDENTITY (1, 1) NOT NULL, 
      
      [MasterId] int NULL, 
      
      [DetailId] int NULL, 
      
      [Name] varchar(50)  NULL, 
      
      [Description] varchar(50)  NULL, 
      
      [CreatedBy] varchar(50)  NULL, 
      
      [CreatedOn] datetime NULL, 
      
      [CreatedIP] varchar(50)  NULL, 
      
      [ModifiedBy] varchar(50)  NULL, 
      
      [ModifiedOn] datetime NULL, 
      
      [ModifiedIP] varchar(50)  NULL, 
      
      CONSTRAINT [PK_Child] PRIMARY KEY CLUSTERED (
      [ChildId] ASC)
    );
  