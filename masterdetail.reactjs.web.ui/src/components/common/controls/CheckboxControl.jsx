// Renders as "checkbox then its own label" rather than the floating-label
// pattern the other controls use - see INLINE_LABEL_TYPES in registry.js.
const CheckboxControl = ({ field, value, onChange, disabled }) => (
  <label className="checkbox-control">
    <input
      type="checkbox"
      name={field.name}
      checked={Boolean(value)}
      onChange={(e) => onChange(field.name, e.target.checked)}
      disabled={disabled}
    />
    {field.checkboxLabel ?? field.label}
  </label>
);

export default CheckboxControl;
