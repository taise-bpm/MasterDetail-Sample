
    CREATE TABLE [dbo].[Detail]
    (
      
      [DetailId] int IDENTITY (1, 1) NOT NULL, 
      
      [MasterId] int NULL, 
      
      [Name] varchar(50)  NULL, 
      
      [Descritpion] varchar(50)  NULL, 
      
      [CreatedBy] varchar(50)  NULL, 
      
      [CreatedOn] datetime NULL, 
      
      [CreatedIP] varchar(50)  NULL, 
      
      [ModifiedBy] varchar(50)  NULL, 
      
      [ModifiedOn] datetime NULL, 
      
      [ModifiedIP] varchar(50)  NULL, 
      
      CONSTRAINT [PK_Detail] PRIMARY KEY CLUSTERED (
      [DetailId] ASC)
    );
  