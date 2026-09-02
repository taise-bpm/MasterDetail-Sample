// In-memory mock backing the controls-demo entity - the exact same
// { list, create, update, remove } contract every real *Api.js module uses
// (masterApi, detailApi, childApi), so EntityGridPage and the rest of the
// CRUD pipeline can't tell this apart from a real HTTP-backed API. Exists
// purely so /controls-demo works standalone, without needing the .NET API
// running, while still proving every control submits through the real path.
let records = [
  {
    sampleId: 2,
    masterId: '',
    name: 'Quarterly Review',
    notes: 'Bring the Q3 numbers and the renewal list.',
    quantity: 4,
    startDate: '15-09-2026',
    appointmentAt: '2026-09-15T14:00:00',
    isActive: true,
    priority: 'high',
    status: 'published',
  },
  {
    sampleId: 1,
    masterId: '',
    name: 'Draft Proposal',
    notes: '',
    quantity: 1,
    startDate: '01-09-2026',
    appointmentAt: null,
    isActive: false,
    priority: 'low',
    status: 'draft',
  },
];
let nextId = 3;

const delay = (value, ms = 150) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

const list = async ({ page = 1, limit = 10, search = '', reverse = true } = {}) => {
  const filtered = search
    ? records.filter((r) => `${r.name} ${r.notes}`.toLowerCase().includes(search.toLowerCase()))
    : records;
  const sorted = [...filtered].sort((a, b) => (reverse ? b.sampleId - a.sampleId : a.sampleId - b.sampleId));
  const start = (page - 1) * limit;
  const items = sorted.slice(start, start + limit);
  return delay({
    items,
    totalCount: sorted.length,
    totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
    currentPage: page,
  });
};

const create = async (record) => {
  const created = { ...record, sampleId: nextId++ };
  records = [created, ...records];
  return delay(created);
};

const update = async (record) => {
  records = records.map((r) => (r.sampleId === Number(record.sampleId) ? { ...r, ...record } : r));
  return delay({ success: true });
};

const remove = async (sampleId) => {
  records = records.filter((r) => r.sampleId !== Number(sampleId));
  return delay({ success: true });
};

export const sampleApi = { list, create, update, remove };
