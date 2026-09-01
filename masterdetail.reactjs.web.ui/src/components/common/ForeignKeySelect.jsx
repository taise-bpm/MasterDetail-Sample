import { useEffect, useState } from 'react';

// <select> populated by fetching a related entity's own list (via its
// `api.list`). When `dependsOnValue` is given, it's forwarded as a filter to
// that fetch and the field refetches whenever it changes - e.g. Child's
// Detail Id options narrow to whichever Master Id is currently picked. A
// falsy `dependsOnValue` (nothing picked yet) fetches unfiltered, matching
// the "0 = list all" convention already used everywhere else.
//
// Used by both EntityForm (editors) and EntityGridPage/DetailChildPage
// (dependent grid filters) - same component, same dependency behavior.
const ForeignKeySelect = ({ name, entity, dependsOn, dependsOnValue, value, onChange, disabled, required, placeholder }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const displayField = entity.tileFields?.title ?? entity.idField;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const filters = dependsOn ? { [dependsOn]: dependsOnValue || 0 } : {};
    entity.api
      .list({ page: 1, limit: 200, reverse: true, ...filters })
      .then(({ items }) => {
        if (!cancelled) setOptions(items);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entity, dependsOn, dependsOnValue]);

  return (
    <select name={name} value={value ?? ''} onChange={onChange} disabled={disabled} required={required}>
      <option value="">{loading ? 'Loading...' : placeholder}</option>
      {options.map((option) => (
        <option key={option[entity.idField]} value={option[entity.idField]}>
          {option[displayField]} (#{option[entity.idField]})
        </option>
      ))}
    </select>
  );
};

export default ForeignKeySelect;
