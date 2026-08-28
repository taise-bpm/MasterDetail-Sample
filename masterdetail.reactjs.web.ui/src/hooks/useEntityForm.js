import { useState } from 'react';

const isFieldEmpty = (field, value) => {
  if (field.type === 'number') {
    return value === '' || value === null || value === undefined || Number.isNaN(Number(value)) || Number(value) <= 0;
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

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
