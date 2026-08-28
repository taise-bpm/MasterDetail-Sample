
    -- =============================================
    -- Author:		  Dennis Abraham
    -- Create date: 24-02-2026
    -- Description:	Get from table Detail by Dynamic Where and OrderBy
    -- =============================================
    CREATE PROCEDURE [dbo].[Detail_DynamicSQL]
        @OrderBySettings  [dbo].[OrderBySetting_TVP] ReadOnly,
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

        SET @DynamicSQL =   @SelectSQL
        + ' 	FROM [dbo].[Detail] '
        + ( case when @FilterCount > 0 then '  WHERE ' + @WhereSQL  else '' end )
        + ( case when @OrderCount > 0 then '  ORDER BY ' + @OrderSQL else '' end );

        execute sp_executesql @DynamicSQL;
        END
  