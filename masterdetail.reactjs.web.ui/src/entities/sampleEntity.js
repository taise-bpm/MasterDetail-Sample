import { sampleApi } from '../api/sampleApi';
import { masterEntity } from './masterEntity';

// A "kitchen sink" entity that exists purely to demonstrate every reusable
// form control (text, textarea, number, date, datetime, checkbox, radio,
// select, and a dependent foreign-key select) running through the exact same
// EntityForm / EntityGridPage / useCrudMutations / DataTable pipeline as
// Master/Detail/Child - proving the control system needs no special-casing
// to be reused for a brand new table. Backed by an in-memory mock API
// (sampleApi.js), not the real .NET backend - except `masterId`, which does
// call the real Master API, to prove a mocked entity and a live one can
// share one form without friction.
export const sampleEntity = {
  idField: 'sampleId',
  label: 'Sample',
  pluralLabel: 'Sample Records',
  api: sampleApi,
  emptyRecord: {
    sampleId: 0,
    masterId: '',
    name: '',
    notes: '',
    quantity: '',
    startDate: '',
    appointmentAt: '',
    isActive: false,
    priority: 'medium',
    status: '',
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea', rows: 3, required: false },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 0, required: true },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      // Deliberately a non-ISO "legacy backend" format, to prove the picker
      // (always native yyyy-MM-dd) and the stored/submitted value are
      // genuinely independent.
      apiFormat: 'dd-MM-yyyy',
      displayFormat: 'dd MMM yyyy',
      required: true,
    },
    {
      name: 'appointmentAt',
      label: 'Appointment',
      type: 'datetime',
      apiFormat: 'yyyy-MM-ddTHH:mm:ss',
      displayFormat: 'dd MMM yyyy HH:mm',
      required: false,
    },
    { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Is Active' },
    {
      name: 'priority',
      label: 'Priority',
      type: 'radio',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ],
    },
    {
      name: 'masterId',
      label: 'Related Master',
      type: 'number',
      required: false,
      foreignKey: { entity: masterEntity },
    },
  ],
};
