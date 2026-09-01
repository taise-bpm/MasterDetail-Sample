import { formatForDisplay } from './dateFormat';

const DEFAULT_API_FORMAT = { date: 'yyyy-MM-dd', datetime: 'yyyy-MM-ddTHH:mm:ss' };
const DEFAULT_DISPLAY_FORMAT = { date: 'dd MMM yyyy', datetime: 'dd MMM yyyy HH:mm' };

// Renders a stored field value the way a human should read it, driven purely
// by the field's config - a date stored as "31-08-2026" (apiFormat:
// dd-MM-yyyy) displays as "31 Aug 2026" (displayFormat: dd MMM yyyy) instead
// of the raw stored string; a checkbox shows Yes/No; a radio/select shows its
// option's label instead of its raw value. Every other type passes through
// unchanged. Used by DataTable, RecordViewer and ConfirmDeleteModal so a grid
// column and a view/delete modal always agree on how a value looks.
export const formatFieldValue = (field, rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '') return rawValue;

  if (field.type === 'date' || field.type === 'datetime') {
    const apiFormat = field.apiFormat ?? DEFAULT_API_FORMAT[field.type];
    const displayFormat = field.displayFormat ?? DEFAULT_DISPLAY_FORMAT[field.type];
    return formatForDisplay(rawValue, apiFormat, displayFormat);
  }

  if (field.type === 'checkbox') return rawValue ? 'Yes' : 'No';

  if (field.type === 'radio' || field.type === 'select') {
    const option = field.options?.find((o) => String(o.value) === String(rawValue));
    return option?.label ?? rawValue;
  }

  return rawValue;
};
