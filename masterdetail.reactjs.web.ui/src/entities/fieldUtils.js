// Shared helper: turns an entity's editable `fields` into the field list an
// EntityForm should render for a given modal mode, honoring:
//  - `lockAfterCreate`: fields the API only ever applies at creation (e.g.
//    Child's masterId/detailId) - become read-only once you're updating.
//  - `alwaysReadOnlyField`: a field supplied by parent context rather than
//    typed by the user (e.g. the foreign key EntityChildGrid scopes by) -
//    read-only in every mode.
export const resolveFormFields = (fields, { mode, alwaysReadOnlyField } = {}) =>
  fields.map((field) => {
    if (field.name === alwaysReadOnlyField) return { ...field, readOnly: true };
    if (mode === 'update' && field.lockAfterCreate) return { ...field, readOnly: true };
    return field;
  });

// Types that map to a *nullable value type* on a typical .NET model
// (DateTime?, int?, decimal?, ...). Those reject an empty string outright -
// System.Text.Json throws deserializing "" into DateTime?, so the request
// never even reaches the controller - whereas an optional string field is
// usually happy to receive "". A blank optional field of one of these types
// has to be submitted as `null`, not "".
const NULLABLE_WHEN_EMPTY_TYPES = new Set(['date', 'datetime', 'number']);

// Adapts this app's in-form "no value" representation ('' from a cleared
// input, or whatever an entity's `emptyRecord` happens to use) into what a
// nullable-value-type API field actually requires, right at the boundary
// where values leave the form and go over the wire. Required fields are left
// untouched - validation should already have stopped an empty required field
// from reaching this point, and this must never paper over that.
//
// This is deliberately one central adapter (used by useCrudMutations for
// every entity) rather than something each control or each entity's
// emptyRecord has to remember to get right on its own.
export const sanitizeForSubmit = (fields, values) => {
  const sanitized = { ...values };
  fields.forEach((field) => {
    if (field.required) return;
    if (!NULLABLE_WHEN_EMPTY_TYPES.has(field.type)) return;
    if (sanitized[field.name] === '' || sanitized[field.name] === undefined) {
      sanitized[field.name] = null;
    }
  });
  return sanitized;
};
