
    -- =============================================
    -- Author:		  Dennis Abraham
    -- Create date: 24-02-2026
    -- Description:	Get from table Master by PageOrderFilter conditions
    -- =============================================
    CREATE PROCEDURE [dbo].[Master_GetByPageSortFilter]
        @Skip	                BIGINT = 0,
        @Take	                BIGINT = 0x7ffffff,
        @IncludeTotalCount    INT    = 0,
        @IncludeFilteredCount INT    = 0,
        @OrderBySettings  [dbo].[OrderBySetting_TVP]	ReadOnly,
        @FilterBySettings [dbo].[FilterBySetting_TVP] ReadOnly
    AS
    BEGIN
      SET NOCOUNT ON;
      DECLARE @OrderCount   INT = 0;
      DECLARE @FilterCount  INT = 0;
      DECLARE @DynamicSQL nvarchar(4000) = '';
      DECLARE @OrderSQL   nvarchar(2000);
      DECLARE @WhereSQL   nvarchar(2000);
      DECLARE @SelectSQL  nvarchar(1000) = ' SELECT * ';
      DECLARE @SelectCountSQL nvarchar(1000) = ' SELECT Count(*) ';


        IF (@IncludeTotalCount = 1) BEGIN
          Declare @SelectCountDataSourceSql nvarchar(1000) = ' SELECT Count(*) from [dbo].[Master]';
          execute sp_executesql @SelectCountDataSourceSql;
        END

        SELECT @OrderCount = Count(*)
          FROM @OrderBySettings
         WHERE OrderByOrd > 0
           AND OrderByClause is not null;

        SELECT @FilterCount = Count(*)
          FROM @FilterBySettings
         WHERE FilterByOrd > 0
           AND FilterByClause is not null;

        if (@OrderCount > 0)
          BEGIN
            SELECT @OrderSQL = COALESCE(@OrderSQL + ', ', '') +  OrderByClause
              FROM @OrderBySettings
             ORDER BY OrderByOrd ;

            SELECT @OrderSQL = IsNull(@OrderSQL, '');
          END
        ELSE
          BEGIN
            SET @OrderSQL = ' 1 desc';
            SET @OrderCount = 1;
          END;

        if (@FilterCount > 0)
        BEGIN
          SELECT @WhereSQL = COALESCE(@WhereSQL + ' AND ', '') + FilterByClause
            FROM @FilterBySettings
           ORDER BY FilterByOrd ;

          SELECT @WhereSQL = IsNull(@WhereSQL, '');
        END;


        if (@IncludeFilteredCount = 1 AND @FilterCount > 0)
        BEGIN
    
          SET @DynamicSQL =   @SelectCountSQL
          + ' 	FROM [dbo].[Master] '
          + ( case when @FilterCount > 0 then '  WHERE ' + @WhereSQL  else '' end )

          execute sp_executesql @DynamicSQL;
        END

        SET @DynamicSQL =   @SelectSQL
        + ' 	FROM [dbo].[Master] '
        + ( case when @FilterCount > 0 then '  WHERE ' + @WhereSQL  else '' end )
        + ( case when @OrderCount > 0 then '  ORDER BY ' + @OrderSQL else '' end )
        + '  OFFSET COALESCE(' + Cast(@Skip as varchar) + ', 0) ROWS'
        + '  FETCH NEXT COALESCE(' + Cast(@Take as varchar) + ', 0x7ffffff) ROWS ONLY;';

        execute sp_executesql @DynamicSQL;
        END
  