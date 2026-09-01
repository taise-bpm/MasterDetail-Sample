import TextControl from './TextControl';
import NumberControl from './NumberControl';
import TextAreaControl from './TextAreaControl';
import DateControl from './DateControl';
import DateTimeControl from './DateTimeControl';
import CheckboxControl from './CheckboxControl';
import RadioGroupControl from './RadioGroupControl';
import SelectControl from './SelectControl';

// One place mapping a field's `type` to the component that renders it, every
// control sharing the (field, value, onChange, disabled) contract. Adding a
// new input type anywhere in the app means adding one control component plus
// one line here - EntityForm itself never needs to change.
const CONTROL_REGISTRY = {
  text: TextControl,
  number: NumberControl,
  textarea: TextAreaControl,
  date: DateControl,
  datetime: DateTimeControl,
  checkbox: CheckboxControl,
  radio: RadioGroupControl,
  select: SelectControl,
};

export const resolveControl = (field) => CONTROL_REGISTRY[field.type] ?? TextControl;

// Field types that read naturally as "the control, then its own inline
// label" (checkbox/radio) rather than the app's usual floating-label-above-
// a-full-width-control layout.
export const INLINE_LABEL_TYPES = new Set(['checkbox', 'radio']);
