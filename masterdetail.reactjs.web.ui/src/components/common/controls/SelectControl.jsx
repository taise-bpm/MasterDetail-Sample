// A plain dropdown of *static* field.options: [{ value, label }] - for a
// fixed enum-like choice. Distinct from ForeignKeySelect, which fetches its
// options from a related entity's own API.
const SelectControl = ({ field, value, onChange, disabled }) => (
  <select
    name={field.name}
    value={value ?? ''}
    onChange={(e) => onChange(field.name, e.target.value)}
    disabled={disabled}
    required={field.required}
  >
    <option value="">{field.placeholder ?? `Select ${field.label}`}</option>
    {(field.options ?? []).map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SelectControl;
