import { detailApi } from '../api/detailApi';
import { masterEntity } from './masterEntity';

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
    {
      name: 'masterId',
      label: 'Master Id',
      type: 'number',
      required: true,
      lockAfterCreate: true,
      // Renders as a dependent dropdown (ForeignKeySelect) of Masters instead
      // of a raw id input, in the editor and in EntityGridPage's grid filters.
      foreignKey: { entity: masterEntity },
    },
    { name: 'name', label: 'Name', required: true },
    { name: 'descritpion', label: 'Description', required: true },
  ],
  tileFields: { title: 'name', subtitle: 'descritpion' },
  // DataTable row action drilling down to this detail's children.
  linkForwards: [{ label: 'View Children', to: (record) => `/child?detailId=${record.detailId}` }],
};
