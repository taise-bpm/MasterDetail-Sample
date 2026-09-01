import { useState } from 'react';

const isFieldEmpty = (field, value) => {
  if (field.type === 'checkbox') return field.required ? !value : false;
  if (field.type === 'number') {
    return value === '' || value === null || value === undefined || Number.isNaN(Number(value));
  }
  return !String(value ?? '').trim();
};

// Generic create/update form state for any entity's `fields` config: tracks
// values + validation errors, and knows how to validate a record without each
// component re-implementing its own `validateForm`.
const useEntityForm = (fields, initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
  };

  // Every control (see components/common/controls) calls this the same way:
  // handleChange(fieldName, newValue) - already unwrapped from whatever
  // native DOM event produced it, so this never needs to know which HTML
  // element a field renders as.
  const handleChange = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // A field whose ForeignKeySelect options depend on the one that just
      // changed may now be showing a stale, no-longer-valid choice - clear it
      // so the user re-picks from the refetched (narrower) option list.
      fields.forEach((field) => {
        if (field.foreignKey?.dependsOn === name) next[field.name] = '';
      });
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && isFieldEmpty(field, values[field.name])) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, setValues, errors, handleChange, validate, reset };
};

export default useEntityForm;
