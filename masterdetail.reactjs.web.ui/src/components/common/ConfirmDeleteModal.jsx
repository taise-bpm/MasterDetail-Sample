import { formatFieldValue } from '../../utils/formatFieldValue';

// Generic delete-confirmation modal, shared the same way as RecordViewer.
const ConfirmDeleteModal = ({ title, fields, record, onConfirm, onCancel }) => (
  <>
    <div className="popup-modal-overlay" onClick={onCancel}></div>
    <div className="popup-modal">
      <button className="popup-close-button" onClick={onCancel}>
        ×
      </button>
      <h2>{title}</h2>
      <hr />
      <p>Are you sure you want to delete the selected record?</p>
      {fields.map((field) => (
        <p key={field.name}>
          <strong>{field.label}:</strong> {formatFieldValue(field, record?.[field.name])}
        </p>
      ))}
      <hr />
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  </>
);

export default ConfirmDeleteModal;
