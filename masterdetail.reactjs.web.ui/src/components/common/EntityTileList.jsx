import { useEffect, useRef, useState } from 'react';
import useToast from '../../hooks/useToast';
import useEntityForm from '../../hooks/useEntityForm';
import useCrudMutations from '../../hooks/useCrudMutations';
import { resolveFormFields } from '../../entities/fieldUtils';
import Toast from './Toast';
import EntityForm from './EntityForm';
import RecordViewer from './RecordViewer';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const PAGE_SIZE = 20;

// Generic searchable, infinite-scroll tile list with inline create/view/edit/
// delete - the "parent" pane of any Parent -> Child layout. Master's sidebar
// and Detail's (when Detail is the parent, e.g. a Detail -> Child view) are
// both just this component pointed at a different entity.
const EntityTileList = ({ entity, selectedId, onSelect }) => {
  const { idField, label, api, fields, emptyRecord, tileFields } = entity;
  const infoFields = [{ name: idField, label: `${label} Id` }, ...fields];

  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOptions, setActiveOptions] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);

  const [modalType, setModalType] = useState(null); // 'create', 'read', 'update', 'delete'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, showToast] = useToast();

  const { values, errors, handleChange, validate, reset } = useEntityForm(fields, emptyRecord);

  const { create, update, remove, highlightedRowId } = useCrudMutations({
    api,
    idField,
    entityLabel: label,
    showToast,
    onCreated: (created) => setRecords((prev) => [created, ...prev]),
    onUpdated: (updated) =>
      setRecords((prev) => prev.map((record) => (record[idField] === updated[idField] ? { ...record, ...updated } : record))),
    onDeleted: (deleted) => setRecords((prev) => prev.filter((record) => record[idField] !== deleted[idField])),
  });

  const loadRecords = async (pageToLoad, search = '') => {
    try {
      const { items } = await api.list({ page: pageToLoad, limit: PAGE_SIZE, search, reverse: true });
      if (items.length > 0) {
        setRecords((prev) => (pageToLoad === 1 ? items : [...prev, ...items]));
      } else {
        setHasMore(false);
        if (pageToLoad === 1) setRecords([]);
      }
    } catch (error) {
      console.error(`Error fetching ${label.toLowerCase()} list:`, error);
    }
  };

  useEffect(() => {
    setHasMore(true);
    loadRecords(1, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) loadRecords(page, searchQuery);
    // Intentionally reacts only to `page`: search changes are handled by the effect above,
    // which already resets to page 1.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSelect = (record) => {
    onSelect(record);
    setActiveOptions(null);
  };

  const toggleOptions = (id) => setActiveOptions((current) => (current === id ? null : id));

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

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
    ...(modalType === 'update' ? [{ name: idField, label: `${label} Id`, readOnly: true }] : []),
    ...resolveFormFields(fields, { mode: modalType }),
  ];

  return (
    <>
      <Toast message={toastMessage} />

      <div className="master-table">
        <h3 style={{ marginLeft: '40px' }}>{label} List</h3>
        <button className="custom-button primary" onClick={openCreateModal}>
          Add {label}
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <p className="master-count">Count: {records.length}</p>

        <div className="master-table-scrollable" ref={scrollContainerRef} onScroll={handleScroll}>
          {records.length > 0 ? (
            <ul>
              {records.map((record, index) => (
                <li
                  key={`${record[idField]}-${index}`}
                  onClick={() => handleSelect(record)}
                  className={record[idField] === selectedId ? 'active' : ''}
                >
                  <div
                    className={highlightedRowId === record[idField] ? 'master-tile highlight-row' : 'master-tile'}
                  >
                    <div className="leading-icon">📄</div>
                    <div className="content">
                      <div className="title">{record[tileFields.title]}</div>
                      <div className="description">{record[tileFields.subtitle]}</div>
                    </div>
                    <div className="options">
                      <button
                        className="options-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOptions(record[idField]);
                        }}
                      >
                        ⋮
                      </button>
                      {activeOptions === record[idField] && (
                        <div className="options-menu">
                          <button
                            className="custom-button info"
                            onClick={() => {
                              setSelectedRecord(record);
                              setModalType('read');
                            }}
                          >
                            View
                          </button>
                          <button className="custom-button warning" onClick={() => openEditModal(record)}>
                            Edit
                          </button>
                          <button
                            className="custom-button danger"
                            onClick={() => {
                              setSelectedRecord(record);
                              setModalType('delete');
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-records">No records found</p>
          )}
          {!hasMore && records.length > 0 && <p className="no-more-data">No more data to load</p>}
        </div>
      </div>

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
          fields={infoFields}
          record={selectedRecord}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === 'delete' && (
        <ConfirmDeleteModal
          title={`Delete ${label}`}
          fields={infoFields}
          record={selectedRecord}
          onConfirm={handleDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default EntityTileList;
