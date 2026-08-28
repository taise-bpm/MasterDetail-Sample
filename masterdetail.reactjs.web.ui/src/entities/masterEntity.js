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
};
