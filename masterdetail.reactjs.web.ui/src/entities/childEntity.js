import { childApi } from '../api/childApi';
import { masterEntity } from './masterEntity';
import { detailEntity } from './detailEntity';

// Child appears two ways: as its own standalone, single table grid (ChildPage,
// unscoped), or as the "child" pane under a selected Detail (EntityChildGrid,
// see DetailChildPage). Either way masterId/detailId are ordinary fields
// here (unlike Detail's masterId) - whichever one is the active scope gets
// forced read-only by EntityChildGrid; the other stays user-editable.
export const childEntity = {
  idField: 'childId',
  label: 'Child',
  pluralLabel: 'Children',
  api: childApi,
  emptyRecord: { childId: 0, masterId: '', detailId: '', name: '', description: '' },
  fields: [
    // ChildController.Update only ever persists Name/Description - MasterId/DetailId
    // are fixed at creation - so these two lock to read-only once a record exists.
    {
      name: 'masterId',
      label: 'Master Id',
      type: 'number',
      required: true,
      lockAfterCreate: true,
      foreignKey: { entity: masterEntity },
    },
    {
      name: 'detailId',
      label: 'Detail Id',
      type: 'number',
      required: true,
      lockAfterCreate: true,
      // Detail options narrow to whichever Master is currently picked -
      // both in the editor and in EntityGridPage's dependent grid filters.
      foreignKey: { entity: detailEntity, dependsOn: 'masterId' },
    },
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', required: true },
  ],
};
