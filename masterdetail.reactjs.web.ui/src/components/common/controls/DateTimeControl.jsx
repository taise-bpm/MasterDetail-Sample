import { apiValueToNative, nativeValueToApi } from '../../../utils/dateFormat';

const NATIVE_FORMAT = 'yyyy-MM-ddTHH:mm';
const DEFAULT_API_FORMAT = 'yyyy-MM-ddTHH:mm:ss';

// Same idea as DateControl (including reporting `null`, not '', when
// cleared - see its comment), for <input type="datetime-local">.
const DateTimeControl = ({ field, value, onChange, disabled }) => {
  const apiFormat = field.apiFormat ?? DEFAULT_API_FORMAT;
  const nativeValue = apiValueToNative(value, apiFormat, NATIVE_FORMAT);

  return (
    <input
      type="datetime-local"
      name={field.name}
      value={nativeValue}
      onChange={(e) => onChange(field.name, e.target.value ? nativeValueToApi(e.target.value, apiFormat, NATIVE_FORMAT) : null)}
      disabled={disabled}
      required={field.required}
    />
  );
};

export default DateTimeControl;
