// Generic create/update modal: renders one floating-label input per field.
// `fields` fully describes the form - callers (Master/Detail/Child) decide
// which fields to show (including any read-only context fields), this
// component just renders them the same way every time.
const EntityForm = ({ title, fields, values, errors, onChange, onCancel, onSubmit, submitLabel }) => (
  <>
    <div className="popup-modal-overlay" onClick={onCancel}></div>
    <div className="popup-modal">
      <button className="popup-close-button" onClick={onCancel}>
        ×
      </button>
      <h2>{title}</h2>
      <br />
      <form>
        {/* paddingTop leaves room for the first field's floating label - it floats
            upward on focus/fill and would otherwise clip against this scroll edge. */}
        <div style={{ overflowY: 'auto', maxHeight: '400px', paddingTop: '20px' }}>
          {fields.map((field) => (
            <div className="form-group floating-label" key={field.name}>
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                name={field.name}
                value={values[field.name] ?? ''}
                onChange={onChange}
                placeholder={`Enter ${field.label}`}
                readOnly={field.readOnly}
                required={field.required}
              />
              <label>{field.label}</label>
              {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
            </div>
          ))}
        </div>
        <br />
        <button type="button" onClick={onSubmit}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  </>
);

export default EntityForm;
