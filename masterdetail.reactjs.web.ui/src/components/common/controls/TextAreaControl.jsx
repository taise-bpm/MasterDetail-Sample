const TextAreaControl = ({ field, value, onChange, disabled }) => (
  <textarea
    name={field.name}
    value={value ?? ''}
    onChange={(e) => onChange(field.name, e.target.value)}
    placeholder={`Enter ${field.label}`}
    readOnly={disabled}
    required={field.required}
    rows={field.rows ?? 3}
  />
);

export default TextAreaControl;
