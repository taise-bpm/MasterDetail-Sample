import { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import useEntityForm from '../../hooks/useEntityForm';
import useCrudMutations from '../../hooks/useCrudMutations';
import usePagedList from '../../hooks/usePagedList';
import useQueryFilters from '../../hooks/useQueryFilters';
import { resolveFormFields } from '../../entities/fieldUtils';
import Breadcrumbs from './Breadcrumbs';
import Toast from './Toast';
import DataTable from './DataTable';
import Pagination from './Pagination';
import EntityForm from './EntityForm';
import ForeignKeySelect from './ForeignKeySelect';
import RecordViewer from './RecordViewer';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// Generic standalone "single table" CRUD page: breadcrumb + search + a grid
// optionally scoped by query-param filters + pagination + full CRUD. Master's
// /master, Detail's /detail and Child's /child are all just this pointed at
// a different entity - `filterParamNames` says which of masterId/detailId (if
// any) this entity's list can be scoped by. Any such field that also carries
// a `foreignKey` descriptor (see childEntity/detailEntity) gets a dependent
// dropdown filter for free, wired to the same query params the "View X" row
// links and deep links already use.
const EntityGridPage = ({ entity, breadcrumbItems, filterParamNames = [] }) => {
  const { idField, label, pluralLabel = `${label}s`, api, fields, emptyRecord, linkForwards } = entity;
  const columns = [{ name: idField, label: `${label} Id` }, ...fields];

  const [modalType, setModalType] = useState(null); // 'create' | 'read' | 'update' | 'delete'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, showToast] = useToast();

  // Only two foreign keys exist anywhere in this schema, so both are always
  // tracked (Rules of Hooks) - `filterParamNames` just picks which are
  // actually forwarded to `api.list()` for this entity.
  const [availableFilters, setFilterValues] = useQueryFilters(['masterId', 'detailId']);
  const activeFilters = Object.fromEntries(filterParamNames.map((name) => [name, availableFilters[name]]));
  const activeFiltersKey = JSON.stringify(activeFilters);

  // Which of this entity's own fields are both a foreign key and an active
  // filter dimension for this page - those get a dropdown, in field order so
  // a dependency (e.g. detailId depends on masterId) always renders after
  // the field it depends on.
  const filterableFields = fields.filter((field) => field.foreignKey && filterParamNames.includes(field.name));

  const handleFilterChange = (field) => (e) => {
    const patch = { [field.name]: Number(e.target.value) || 0 };
    // A filter whose options depend on the one that just changed may no
    // longer be valid for the new selection - clear it back to "all", in the
    // same update so it doesn't clobber the change we're actually making.
    filterableFields.forEach((other) => {
      if (other.foreignKey?.dependsOn === field.name) patch[other.name] = 0;
    });
    setFilterValues(patch);
  };

  const { items, setItems, currentPage, totalPages, pageSize, loading, load, changePage, changePageSize } =
    usePagedList(({ page, limit }) => api.list({ page, limit, search: searchQuery, reverse: true, ...activeFilters }));

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
  }, [searchQuery, activeFiltersKey]);

  const openCreateModal = () => {
    // Pre-fill (but don't lock) from any active filter - e.g. creating from
    // "?masterId=5" starts pointed at master 5.
    reset({ ...emptyRecord, ...activeFilters });
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
    <div className="container custom-container">
      <Toast message={toastMessage} />
      <Breadcrumbs items={breadcrumbItems} />

      <h3 style={{ marginLeft: '40px' }}>{pluralLabel}</h3>
      <button className="custom-button primary" onClick={openCreateModal}>
        Add {label}
      </button>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filterableFields.length > 0 && (
        <div className="filter-bar">
          {filterableFields.map((field) => (
            <div className="filter-bar__item" key={field.name}>
              <label htmlFor={`filter-${field.name}`}>{field.label}</label>
              <ForeignKeySelect
                name={`filter-${field.name}`}
                entity={field.foreignKey.entity}
                dependsOn={field.foreignKey.dependsOn}
                dependsOnValue={field.foreignKey.dependsOn ? availableFilters[field.foreignKey.dependsOn] : undefined}
                value={activeFilters[field.name] || ''}
                onChange={handleFilterChange(field)}
                placeholder={`All ${field.foreignKey.entity.pluralLabel ?? `${field.foreignKey.entity.label}s`}`}
              />
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : items.length > 0 ? (
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
      ) : (
        <p className="no-records">No records found</p>
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

export default EntityGridPage;
