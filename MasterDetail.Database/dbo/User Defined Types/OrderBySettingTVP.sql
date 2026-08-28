
    -- =============================================
    -- Author:		  Dennis Abraham
    -- Create date: 24-02-2026
    -- Description: OrderBySetting_TVP
    -- =============================================
    CREATE TYPE [dbo].[OrderBySetting_TVP] AS TABLE(
    [OrderByOrd] [int] NULL,
    [OrderByClause] [varchar](8000) NULL
    )
  