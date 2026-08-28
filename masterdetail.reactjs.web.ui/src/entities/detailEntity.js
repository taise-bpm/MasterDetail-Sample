import { detailApi } from '../api/detailApi';

// Detail can appear two ways: as the "child" pane under a selected Master
// (masterId forced from context, see EntityChildGrid's `childForeignKeyField`),
// or as its own top-level list (EntityTileList) feeding a Detail -> Child view.
// DetailController.Update only ever persists Name/Descritpion - masterId is
// fixed at creation - so it locks read-only once a record exists either way.
export const detailEntity = {
  idField: 'detailId',
  label: 'Detail',
  api: detailApi,
  emptyRecord: { detailId: 0, masterId: '', name: '', descritpion: '' },
  fields: [
    { name: 'masterId', label: 'Master Id', type: 'number', required: true, lockAfterCreate: true },
    { name: 'name', label: 'Name', required: true },
    { name: 'descritpion', label: 'Description', required: true },
  ],
  tileFields: { title: 'name', subtitle: 'descritpion' },
};
