// Every control shares the same contract: (field, value, onChange, disabled).
// `onChange` is called as onChange(field.name, newValue) - already unwrapped
// from whatever native DOM event produced it - so EntityForm and
// useEntityForm never need to know which native element a field renders as.
const TextControl = ({ field, value, onChange, disabled }) => (
  <input
    type={field.inputType ?? 'text'}
    name={field.name}
    value={value ?? ''}
    onChange={(e) => onChange(field.name, e.target.value)}
    placeholder={`Enter ${field.label}`}
    readOnly={disabled}
    required={field.required}
  />
);

export default TextControl;
