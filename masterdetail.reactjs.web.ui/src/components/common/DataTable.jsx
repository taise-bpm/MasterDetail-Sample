import { Link } from 'react-router-dom';
import { formatFieldValue } from '../../utils/formatFieldValue';

// Generic paginated grid body: one column per `columns` entry plus a fixed
// View/Edit/Delete actions column, and zero or more extra navigation links
// (e.g. Master rows link to both /detail?masterId=... and /child?masterId=...
// since Child carries masterId as a foreign key too). Shared by every
// EntityGridPage / EntityChildGrid.
const DataTable = ({ columns, rows, rowKey, highlightedRowId, onView, onEdit, onDelete, linkForwards = [] }) => (
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
              <td key={column.name}>{formatFieldValue(column, row[column.name])}</td>
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
              {linkForwards.map((link) => (
                <Link key={link.label} className="custom-button primary" to={link.to(row)}>
                  {link.label}
                </Link>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
