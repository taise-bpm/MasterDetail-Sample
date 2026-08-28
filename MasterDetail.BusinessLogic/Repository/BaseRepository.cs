
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.Common;
using Serilog;

namespace MasterDetail.BusinessLogic.Repository
{
    public class BaseRepository<T> where T : class, new()
    {
        protected string Schema = "[dbo]";

        protected string GetAllProc = "[Table_GetAll]";

        protected string InsertProc = "[Table_BulkInsert]";
        protected string UpdateProc = "[Table_BulkUpdate]";
        protected string DeleteProc = "[Table_BulkDelete]";

        protected string DymamicProc = "[Table_DynamicSQL]";

        protected string PageSortFilterProc = "[Table_GetByPageSortFilter]";

        protected IConnectionStringFactory ConnectionStringFactory;

        public BaseRepository(IConnectionStringFactory connectionStringFactory)
        {
            ConnectionStringFactory = connectionStringFactory;
        }
        protected virtual async Task<T> GetByUniqueKey(int orgId, List<FilterBySetting> filterByList, List<OrderBySetting> orderByList, bool bubbleException = false)
        {
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    sqlParameterList.Add(new SqlParameter("@FilterBySettings", filterByList.ToDataTable()));
                    sqlParameterList.Add(new SqlParameter("@OrderBySettings", orderByList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + DymamicProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return dataTable.ToList<T>().FirstOrDefault();
        }

        protected virtual async Task<IEnumerable<T>> GetByForeignKey(int orgId, List<FilterBySetting> filterByList, List<OrderBySetting> orderByList, bool bubbleException = false)
        {
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    sqlParameterList.Add(new SqlParameter("@FilterBySettings", filterByList.ToDataTable()));
                    sqlParameterList.Add(new SqlParameter("@OrderBySettings", orderByList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + DymamicProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return dataTable.ToList<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(int orgId, bool bubbleException = false)
        {
            DataTable dataTable = new DataTable();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(Schema + "." + GetAllProc, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return dataTable.ToList<T>();
        }

        public virtual async Task<T> CreateAsync(int orgId, T entity, bool bubbleException = false)
        {
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var entityList = new List<T>
            {
                entity
            };

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + InsertProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return dataTable.ToList<T>().FirstOrDefault();
        }

        public virtual async Task<int> DeleteAsync(int orgId, T entity, bool bubbleException = false)
        {
            int rowsDeleted = 0;
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var entityList = new List<T>
            {
                entity
            };

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + DeleteProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        rowsDeleted = (Int32)command.ExecuteScalar();
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return rowsDeleted;
        }

        public virtual async Task<int> UpdateAsync(int orgId, T entity, bool bubbleException = false)
        {
            int rowsUpdated = 0;
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var entityList = new List<T>
            {
                entity
            };

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + UpdateProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        rowsUpdated = (Int32)command.ExecuteScalar();
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return rowsUpdated;
        }

        public virtual async Task<IEnumerable<T>> BulkInsertAsync(int orgId, List<T> entityList, bool bubbleException = false)
        {
            DataTable dataTable = new DataTable();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + InsertProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return dataTable.ToList<T>();
        }

        public virtual async Task<int> BulkUpdateAsync(int orgId, List<T> entityList, bool bubbleException = false)
        {
            int rowsUpdated = 0;
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + UpdateProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        rowsUpdated = (Int32)command.ExecuteScalar();
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return rowsUpdated;
        }

        public virtual async Task<int> BulkDeleteAsync(int orgId, List<T> entityList, bool bubbleException = false)
        {
            int rowsDeleted = 0;
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@EntityListIn", entityList.ToDataTable()));

                    using (SqlCommand command = new SqlCommand(Schema + "." + DeleteProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        rowsDeleted = (Int32)command.ExecuteScalar();
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }
            return rowsDeleted;
        }

        public virtual async Task<PageOrderFilterReturn> GetPageSortFilterAsync(int orgId, PageSortFilterModel model, bool bubbleException = false)
        {
            DataSet dataSet = new DataSet();
            List<SqlParameter> sqlParameterList = new List<SqlParameter>();
            int index = 0;

            long skip = model.Skip;
            long take = model.Take;
            bool includeTotalCount = model.IncludeTotalCount;
            bool includeFilteredCount = model.IncludeFilteredCount;

            DataTable orderByDT = new DataTable();
            DataTable filterByDT = new DataTable();

            orderByDT = model.OrderbyList.ToDataTable();
            filterByDT = model.FilterByList.ToDataTable();

            int totalCount = -1;
            int filteredCount = -1;

            var connectionString = ConnectionStringFactory.GetConnectionString();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    sqlParameterList.Add(new SqlParameter("@Skip", skip));
                    sqlParameterList.Add(new SqlParameter("@Take", take));

                    sqlParameterList.Add(new SqlParameter("@IncludeTotalCount", includeTotalCount));
                    sqlParameterList.Add(new SqlParameter("@IncludeFilteredCount", includeFilteredCount));

                    sqlParameterList.Add(new SqlParameter("@FilterBySettings", filterByDT));
                    sqlParameterList.Add(new SqlParameter("@OrderBySettings", orderByDT));

                    using (SqlCommand command = new SqlCommand(Schema + "." + PageSortFilterProc, connection))
                    {
                        command.Parameters.AddRange(sqlParameterList.ToArray());
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataSet);
                        }
                    }
                }
                catch (Exception ex)
                {
                    HandleException(ex, orgId, bubbleException);
                }
            }


            if (includeTotalCount)
            {
                totalCount = dataSet.Tables[index].ToScalar<int>();
	            index++;
	        }

	        if (includeFilteredCount && model.FilterByList.Count > 0)
            {
                totalCount = dataSet.Tables[index].ToScalar<int>();
	            index++;
	        }

	        var content = dataSet.Tables[index].ToList<T>();

            return new PageOrderFilterReturn { TotalCount = totalCount, FilteredCount = filteredCount, Content = content };
        }

        protected void HandleException(Exception ex, int orgId, bool bubbleException = false)
        {
            Log.Error(ex, "Exception in Repository layer");

            if (bubbleException)
            {
                throw ex;
            }
        }
    }

    public interface IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(int orgId, bool bubbleException = false);
        Task<T> CreateAsync(int orgId, T entity, bool bubbleException = false);
        Task<int> DeleteAsync(int orgId, T entity, bool bubbleException = false);
        Task<int> UpdateAsync(int orgId, T entity, bool bubbleException = false);
        Task<IEnumerable<T>> BulkInsertAsync(int orgId, List<T> entityList, bool bubbleException = false);
        Task<int> BulkUpdateAsync(int orgId, List<T> entityList, bool bubbleException = false);
        Task<int> BulkDeleteAsync(int orgId, List<T> entityList, bool bubbleException = false);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(int orgId, PageSortFilterModel model, bool bubbleException = false);
    }
}
  