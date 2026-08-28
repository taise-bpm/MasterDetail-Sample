
    CREATE TABLE [dbo].[Master]
    (
      
      [MasterId] int IDENTITY (1, 1) NOT NULL, 
      
      [Name] varchar(50)  NULL, 
      
      [Descritption] varchar(50)  NULL, 
      
      [CreatedBy] varchar(50)  NULL, 
      
      [CreatedOn] datetime NULL, 
      
      [CreatedIP] varchar(50)  NULL, 
      
      [ModifiedBy] varchar(50)  NULL, 
      
      [ModifiedOn] datetime NULL, 
      
      [ModifiedIP] varchar(50)  NULL, 
      
      CONSTRAINT [PK_Master] PRIMARY KEY CLUSTERED (
      [MasterId] ASC)
    );
  