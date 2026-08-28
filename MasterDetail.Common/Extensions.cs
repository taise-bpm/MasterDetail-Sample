
using Microsoft.Data.SqlClient.Server;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Reflection;

namespace MasterDetail.Common
{
    public static class Extensions
    {
        public static void SetNullableInt64(this SqlDataRecord rec, int index, long? value)
        {
            if (value.HasValue)
                rec.SetInt64(index, value.GetValueOrDefault());
            else
                rec.SetDBNull(index);
        }

        public static void SetNullableInt32(this SqlDataRecord rec, int index, Int32? value)
        {
            if (value.HasValue)
                rec.SetInt32(index, value.GetValueOrDefault());
            else
                rec.SetDBNull(index);
        }

        public static void SetNullableDateTime(this SqlDataRecord rec, int index, DateTime? value)
        {
            if (value.HasValue)
                rec.SetDateTime(index, value.GetValueOrDefault());
            else
                rec.SetDBNull(index);
        }

        public static dynamic ToScalar<T>(this DataTable table)
        {
            dynamic item = default(T);

            if (table.Rows.Count > 0)
            {
                var typeCode = Type.GetTypeCode(typeof(T));
                switch (typeCode)
                {
                    case TypeCode.Boolean:
                        item = Convert.ToBoolean(table.Rows[0][0]);
                        break;
                    case TypeCode.DateTime:
                        item = Convert.ToDateTime(table.Rows[0][0]);
                        break;
                    case TypeCode.Decimal:
                        item = Convert.ToDecimal(table.Rows[0][0]);
                        break;
                    case TypeCode.Double:
                        item = Convert.ToDouble(table.Rows[0][0]);
                        break;
                    case TypeCode.Int16:
                        item = Convert.ToInt16(table.Rows[0][0]);
                        break;
                    case TypeCode.Int32:
                        item = Convert.ToInt32(table.Rows[0][0]);
                        break;
                    case TypeCode.Int64:
                        item = Convert.ToInt64(table.Rows[0][0]);
                        break;
                    case TypeCode.String:
                        item = Convert.ToString(table.Rows[0][0]);
                        break;
                    default:
                        item = default(T);
                        break;
                }
            }

            return item;
        }
        public static IList<T> ToList<T>(this DataTable table) where T : new()
        {

            IList<PropertyInfo> properties = typeof(T).GetProperties().ToList();
            IList<T> result = new List<T>();

            foreach (var row in table.Rows)
            {
                var item = CreateItemFromRow<T>((DataRow)row, properties);
                result.Add(item);
            }

            return result;
        }

        private static T CreateItemFromRow<T>(DataRow row, IList<PropertyInfo> properties) where T : new()
        {
            T item = new T();
            foreach (var property in properties)
            {
                Type propertyType = property.PropertyType;

                if (Nullable.GetUnderlyingType(propertyType) != null) // Check if property type is nullable
                {
                    if (row[property.Name] != DBNull.Value)
                    {
                        property.SetValue(item, row[property.Name], null);
                    }
                }
                else
                {
                    if (propertyType == typeof(string))
                    {
                        if (row[property.Name] == DBNull.Value || row[property.Name] == null)
                        {
                            property.SetValue(item, string.Empty, null);
                        }
                        else
                        {
                            property.SetValue(item, row[property.Name], null);
                        }
                    }
                    else
                    {
                        property.SetValue(item, row[property.Name], null);
                    }
                }
            }
            return item;
        }

        public static DataTable ToDataTable<T>(this List<T> iList)
        {
            DataTable dataTable = new DataTable();
            PropertyDescriptorCollection propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
                Type type = propertyDescriptor.PropertyType;

                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    type = Nullable.GetUnderlyingType(type);

                dataTable.Columns.Add(propertyDescriptor.Name, type);

            }
            object[] values = new object[propertyDescriptorCollection.Count];
            foreach (T iListItem in iList)
            {
                for (int i = 0; i < values.Length; i++)
                {

                    values[i] = propertyDescriptorCollection[i].GetValue(iListItem);
                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }

        public static T GetAttributeOfType<T>(this Enum enumVal) where T : System.Attribute
        {
            var type = enumVal.GetType();
            var memInfo = type.GetMember(enumVal.ToString());
            var attributes = memInfo[0].GetCustomAttributes(typeof(T), false);
            return (attributes.Length > 0) ? (T)attributes[0] : null;
        }
    }
}    
  