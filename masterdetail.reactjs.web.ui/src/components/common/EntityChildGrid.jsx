import { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import useEntityForm from '../../hooks/useEntityForm';
import useCrudMutations from '../../hooks/useCrudMutations';
import usePagedList from '../../hooks/usePagedList';
import { resolveFormFields } from '../../entities/fieldUtils';
import Breadcrumbs from './Breadcrumbs';
import Toast from './Toast';
import DataTable from './DataTable';
import Pagination from './Pagination';
import EntityForm from './EntityForm';
import RecordViewer from './RecordViewer';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// Generic "records belonging to a selected parent" pane: breadcrumb + paginated
// grid + full CRUD, scoped by whichever field ties this entity back to its
// parent (`childForeignKeyField`). Pairs with EntityTileList to build any
// Parent -> Child layout (Master -> Detail, Detail -> Child, ...) without
// writing the grid/modals/pagination wiring more than once.
const EntityChildGrid = ({
  entity,
  parent,
  parentIdField,
  childForeignKeyField,
  parentLabelField = 'name',
  parentDescriptionField,
  noParentMessage,
}) => {
  const { idField, label, api, fields, emptyRecord, linkForwards, pluralLabel = `${entity.label}s` } = entity;
  const columns = [{ name: idField, label: `${label} Id` }, ...fields];

  const [modalType, setModalType] = useState(null); // 'create', 'read', 'update', 'delete'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, showToast] = useToast();

  const parentId = parent?.[parentIdField];

  const { items, setItems, currentPage, totalPages, pageSize, loading, load, changePage, changePageSize } =
    usePagedList(({ page, limit }) => api.list({ page, limit, reverse: true, [childForeignKeyField]: parentId }));

  const { values, errors, handleChange, validate, reset } = useEntityForm(fields, emptyRecord);

  const { create, update, remove, highlightedRowId } = useCrudMutations({
    api,
    idField,
    fields,
    entityLabel: label,
    showToast,
    onCreated: () => load(1, pageSize),
    onUpdated: (updated) =>
      setItems((prev) => prev.map((item) => (item[idField] === updated[idField] ? { ...item, ...updated } : item))),
    onDeleted: () => load(currentPage, pageSize),
  });

  useEffect(() => {
    if (parent) {
      load(1, pageSize);
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent]);

  const openCreateModal = () => {
    reset({ ...emptyRecord, [childForeignKeyField]: parentId });
    setModalType('create');
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    reset({ [idField]: record[idField], ...Object.fromEntries(fields.map((f) => [f.name, record[f.name]])) });
    setModalType('update');
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const succeeded = modalType === 'create' ? await create(values) : await update(values);
    if (succeeded) setModalType(null);
  };

  const handleDelete = async () => {
    if (await remove(selectedRecord)) setModalType(null);
  };

  // Ctrl+Alt+N shortcut for creating a new record against the selected parent.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'n' && parent) openCreateModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent]);

  const formFields = [
    ...(modalType === 'update' ? [{ name: idField, label: `${label} Id`, readOnly: true }] : []),
    ...resolveFormFields(fields, { mode: modalType, alwaysReadOnlyField: childForeignKeyField }),
  ];

  return (
    <div className="container custom-container">
      <Toast message={toastMessage} />

      {parent && (
        <div className="detail-table">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: parent[parentLabelField] }]} />
          <h3>
            {pluralLabel} for {parent[parentLabelField]}
          </h3>
          {parentDescriptionField && <p>{parent[parentDescriptionField]}</p>}
        </div>
      )}

      {!parent && (
        <div className="no-master-selected">
          <p>{noParentMessage}</p>
        </div>
      )}

      {parent && loading && <div className="loading">Loading...</div>}

      {parent && !loading && items.length > 0 && (
        <>
          <button className="custom-button primary" onClick={openCreateModal} title="Shortcut: Ctrl+Alt+N">
            Add {label}
          </button>
          <div className="table-section">
            <DataTable
              columns={columns}
              rows={items}
              rowKey={idField}
              highlightedRowId={highlightedRowId}
              linkForwards={linkForwards}
              onView={(record) => {
                setSelectedRecord(record);
                setModalType('read');
              }}
              onEdit={openEditModal}
              onDelete={(record) => {
                setSelectedRecord(record);
                setModalType('delete');
              }}
            />
            <div className="pagination-sticky">
              <div className="pagination-controls">
                <div className="page-size-selector">
                  <label htmlFor={`${idField}-pageSize`}>Page Size:</label>
                  <select
                    id={`${idField}-pageSize`}
                    value={pageSize}
                    onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={changePage}
                  maxButtons={window.innerWidth < 768 ? 3 : 5}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {parent && !loading && items.length === 0 && (
        <div className="no-master-selected">
          <p>
            No {label.toLowerCase()} records for {parent[parentLabelField]}
          </p>
          <button className="custom-button primary" onClick={openCreateModal} title="Shortcut: Ctrl+Alt+N">
            Add {label}
          </button>
        </div>
      )}

      {(modalType === 'create' || modalType === 'update') && (
        <EntityForm
          title={modalType === 'create' ? `Add ${label}` : `Edit ${label}`}
          fields={formFields}
          values={values}
          errors={errors}
          onChange={handleChange}
          onCancel={() => setModalType(null)}
          onSubmit={handleSubmit}
          submitLabel={modalType === 'create' ? 'Create' : 'Update'}
        />
      )}

      {modalType === 'read' && (
        <RecordViewer
          title={`${label} Details`}
          fields={columns}
          record={selectedRecord}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === 'delete' && (
        <ConfirmDeleteModal
          title={`Delete ${label}`}
          fields={columns}
          record={selectedRecord}
          onConfirm={handleDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default EntityChildGrid;
