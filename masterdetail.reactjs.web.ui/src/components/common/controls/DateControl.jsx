import { apiValueToNative, nativeValueToApi } from '../../../utils/dateFormat';

const NATIVE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_API_FORMAT = 'yyyy-MM-dd';

// A native date picker (best UX/accessibility: keyboard input, mobile
// pickers, no typo-prone free text) whose *stored* value can be in whatever
// format the API expects (`field.apiFormat`) - the two are decoupled by
// converting at the edges, so a legacy backend format never has to leak into
// how the field is edited.
//
// Clearing the field reports `null`, not '' - a blank DateTime?-style API
// field needs an actual null, since most JSON deserializers reject "" for a
// nullable value type outright rather than treating it as "no value" (see
// sanitizeForSubmit for the matching safety net at the submit boundary).
const DateControl = ({ field, value, onChange, disabled }) => {
  const apiFormat = field.apiFormat ?? DEFAULT_API_FORMAT;
  const nativeValue = apiValueToNative(value, apiFormat, NATIVE_FORMAT);

  return (
    <input
      type="date"
      name={field.name}
      value={nativeValue}
      onChange={(e) => onChange(field.name, e.target.value ? nativeValueToApi(e.target.value, apiFormat, NATIVE_FORMAT) : null)}
      // `readOnly` alone doesn't reliably block a native date picker's
      // calendar UI across browsers - `disabled` does.
      disabled={disabled}
      required={field.required}
    />
  );
};

export default DateControl;
