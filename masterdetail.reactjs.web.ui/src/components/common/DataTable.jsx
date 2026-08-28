// Generic paginated grid body: one column per `columns` entry plus a fixed
// View/Edit/Delete actions column. Shared by Detail and Child.
const DataTable = ({ columns, rows, rowKey, highlightedRowId, onView, onEdit, onDelete }) => (
  <div className="custom-table-container">
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name}>{column.label}</th>
          ))}
          <th className="sticky-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]} className={highlightedRowId === row[rowKey] ? 'highlight-row' : ''}>
            {columns.map((column) => (
              <td key={column.name}>{row[column.name]}</td>
            ))}
            <td className="sticky-column">
              <button className="custom-button info" onClick={() => onView(row)}>
                View
              </button>
              <button className="custom-button warning" onClick={() => onEdit(row)}>
                Edit
              </button>
              <button className="custom-button danger" onClick={() => onDelete(row)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
