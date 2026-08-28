// Generic read-only "View" modal: labeled field list driven by config,
// shared by Master, Detail and Child instead of three copy-pasted modals.
const RecordViewer = ({ title, fields, record, onClose }) => (
  <>
    <div className="popup-modal-overlay" onClick={onClose}></div>
    <div className="popup-modal">
      <button className="popup-close-button" onClick={onClose}>
        ×
      </button>
      <h2>{title}</h2>
      <hr />
      {fields.map((field) => (
        <p key={field.name}>
          <strong>{field.label}:</strong> {record?.[field.name]}
        </p>
      ))}
      <hr />
      <button onClick={onClose}>Close</button>
    </div>
  </>
);

export default RecordViewer;
