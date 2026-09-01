// field.options: [{ value, label }]
const RadioGroupControl = ({ field, value, onChange, disabled }) => (
  <div className="radio-group-control">
    {(field.options ?? []).map((option) => (
      <label key={option.value} className="radio-option">
        <input
          type="radio"
          name={field.name}
          value={option.value}
          checked={String(value ?? '') === String(option.value)}
          onChange={(e) => onChange(field.name, e.target.value)}
          disabled={disabled}
        />
        {option.label}
      </label>
    ))}
  </div>
);

export default RadioGroupControl;
