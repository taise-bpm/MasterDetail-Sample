import { masterApi } from '../api/masterApi';

// Single source of truth for the Master table: what a record looks like, which
// fields are user-editable, and which API calls back it. Drives the shared
// EntityForm / RecordViewer / ConfirmDeleteModal so Master's editor and viewer
// stay in lock-step with Detail's and Child's without duplicating markup.
export const masterEntity = {
  idField: 'masterId',
  label: 'Master',
  api: masterApi,
  emptyRecord: { masterId: 0, name: '', descritption: '' },
  fields: [
    { name: 'name', label: 'Name', required: true },
    { name: 'descritption', label: 'Description', required: true },
  ],
  // Which fields an EntityTileList shows as a tile's title/subtitle.
  tileFields: { title: 'name', subtitle: 'descritption' },
  // DataTable row actions drilling down from this master. Child carries
  // masterId as a foreign key too (not just via Detail), so a master links
  // straight to both its details and its children.
  linkForwards: [
    { label: 'View Details', to: (record) => `/detail?masterId=${record.masterId}` },
    { label: 'View Children', to: (record) => `/child?masterId=${record.masterId}` },
  ],
};
