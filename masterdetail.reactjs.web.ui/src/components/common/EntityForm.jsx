import ForeignKeySelect from './ForeignKeySelect';
import { resolveControl, INLINE_LABEL_TYPES } from './controls/registry';

// Generic create/update modal: renders one control per field, resolved from
// the shared control registry (text/number/date/datetime/checkbox/radio/
// select/textarea - see controls/registry.js) or a dependent ForeignKeySelect
// for any field with a `foreignKey` descriptor. `fields` fully describes the
// form - callers (Master/Detail/Child/Sample) decide which fields to show
// (including any read-only context fields), this component just renders
// them the same way every time, whatever their control type.
const EntityForm = ({ title, fields, values, errors, onChange, onCancel, onSubmit, submitLabel }) => (
  <>
    <div className="popup-modal-overlay" onClick={onCancel}></div>
    <div className="popup-modal">
      <button className="popup-close-button" onClick={onCancel}>
        ×
      </button>
      <h2>{title}</h2>
      <br />
      <form>
        {/* paddingTop leaves room for the first field's floating label - it floats
            upward on focus/fill and would otherwise clip against this scroll edge. */}
        <div style={{ overflowY: 'auto', maxHeight: '400px', paddingTop: '20px' }}>
          {fields.map((field) => {
            if (field.foreignKey) {
              return (
                <div className="form-group floating-label" key={field.name}>
                  <ForeignKeySelect
                    name={field.name}
                    entity={field.foreignKey.entity}
                    dependsOn={field.foreignKey.dependsOn}
                    dependsOnValue={field.foreignKey.dependsOn ? values[field.foreignKey.dependsOn] : undefined}
                    value={values[field.name]}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    disabled={field.readOnly}
                    required={field.required}
                    placeholder={`Select ${field.label}`}
                  />
                  <label>{field.label}</label>
                  {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
                </div>
              );
            }

            const Control = resolveControl(field);
            const inline = INLINE_LABEL_TYPES.has(field.type);

            return (
              <div className={`form-group ${inline ? 'inline-control' : 'floating-label'}`} key={field.name}>
                <Control field={field} value={values[field.name]} onChange={onChange} disabled={field.readOnly} />
                {!inline && <label>{field.label}</label>}
                {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
              </div>
            );
          })}
        </div>
        <br />
        <button type="button" onClick={onSubmit}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  </>
);

export default EntityForm;
