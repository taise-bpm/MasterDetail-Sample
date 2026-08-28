import { useEffect, useState } from 'react';
import { childEntity } from '../entities/childEntity';
import { resolveFormFields } from '../entities/fieldUtils';
import useToast from '../hooks/useToast';
import useEntityForm from '../hooks/useEntityForm';
import useCrudMutations from '../hooks/useCrudMutations';
import usePagedList from '../hooks/usePagedList';
import Toast from '../components/common/Toast';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import EntityForm from '../components/common/EntityForm';
import RecordViewer from '../components/common/RecordViewer';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import '../Appify.css';

const { idField, label, api, fields, emptyRecord } = childEntity;

const columns = [
  { name: idField, label: 'Child Id' },
  ...fields.map((field) => ({ name: field.name, label: field.label })),
];

const ChildPage = () => {
  const [modalType, setModalType] = useState(null); // 'create' | 'read' | 'update' | 'delete'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, showToast] = useToast();

  const { items, setItems, currentPage, totalPages, pageSize, loading, load, changePage, changePageSize } =
    usePagedList(({ page, limit }) => api.list({ page, limit, search: searchQuery, reverse: true }));

  const { values, errors, handleChange, validate, reset } = useEntityForm(fields, emptyRecord);

  const { create, update, remove, highlightedRowId } = useCrudMutations({
    api,
    idField,
    entityLabel: label,
    showToast,
    onCreated: () => load(1, pageSize),
    onUpdated: (updated) =>
      setItems((prev) => prev.map((item) => (item[idField] === updated[idField] ? { ...item, ...updated } : item))),
    onDeleted: () => load(currentPage, pageSize),
  });

  useEffect(() => {
    load(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const openCreateModal = () => {
    reset(emptyRecord);
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

  const formFields = [
    ...(modalType === 'update' ? [{ name: idField, label: 'Child Id', readOnly: true }] : []),
    ...resolveFormFields(fields, { mode: modalType }),
  ];

  return (
    <div className="container custom-container">
      <Toast message={toastMessage} />

      <h3 style={{ marginLeft: '40px' }}>Child Records</h3>
      <button className="custom-button primary" onClick={openCreateModal}>
        Add Child
      </button>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : items.length > 0 ? (
        <div className="table-section">
          <DataTable
            columns={columns}
            rows={items}
            rowKey={idField}
            highlightedRowId={highlightedRowId}
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
                <label htmlFor="childPageSize">Page Size:</label>
                <select
                  id="childPageSize"
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
      ) : (
        <p className="no-records">No records found</p>
      )}

      {(modalType === 'create' || modalType === 'update') && (
        <EntityForm
          title={modalType === 'create' ? 'Add Child' : 'Edit Child'}
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
          title="Child Details"
          fields={columns}
          record={selectedRecord}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === 'delete' && (
        <ConfirmDeleteModal
          title="Delete Child"
          fields={columns}
          record={selectedRecord}
          onConfirm={handleDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default ChildPage;
