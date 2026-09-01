const NumberControl = ({ field, value, onChange, disabled }) => (
  <input
    type="number"
    name={field.name}
    value={value ?? ''}
    onChange={(e) => onChange(field.name, e.target.value)}
    placeholder={`Enter ${field.label}`}
    readOnly={disabled}
    required={field.required}
    step={field.step}
    min={field.min}
    max={field.max}
  />
);

export default NumberControl;
