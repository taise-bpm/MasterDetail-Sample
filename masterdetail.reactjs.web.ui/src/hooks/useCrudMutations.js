import { useState } from 'react';

// Generic create/update/delete workflow shared by Master, Detail and Child:
// calls the entity's API, reports success/failure via toast, and briefly
// highlights the affected row. Only the entity's `api` + `idField` + `label`
// change between tables - the workflow itself doesn't.
const useCrudMutations = ({ api, idField, entityLabel, showToast, onCreated, onUpdated, onDeleted }) => {
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const highlight = (id) => {
    setHighlightedRowId(id);
    setTimeout(() => setHighlightedRowId(null), 3000);
  };

  const reportError = (action, error) => {
    console.error(`Error ${action} ${entityLabel.toLowerCase()}:`, error);
    showToast('error', 'Server error. Please contact your administrator.');
  };

  const create = async (values) => {
    try {
      const created = await api.create(values);
      onCreated?.(created);
      showToast('success', `${entityLabel} added successfully!`);
      highlight(created[idField]);
      return true;
    } catch (error) {
      reportError('creating', error);
      return false;
    }
  };

  const update = async (values) => {
    try {
      await api.update(values);
      onUpdated?.(values);
      showToast('success', `${entityLabel} updated successfully!`);
      highlight(values[idField]);
      return true;
    } catch (error) {
      reportError('updating', error);
      return false;
    }
  };

  const remove = async (record) => {
    try {
      await api.remove(record[idField]);
      onDeleted?.(record);
      showToast('success', `${entityLabel} deleted successfully!`);
      return true;
    } catch (error) {
      reportError('deleting', error);
      return false;
    }
  };

  return { create, update, remove, highlightedRowId };
};

export default useCrudMutations;
