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
