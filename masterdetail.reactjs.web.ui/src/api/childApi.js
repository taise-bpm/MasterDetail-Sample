import httpClient from './httpClient';

// Matches the routes exposed by ChildController ([Route("api/[controller]")]).
const RESOURCE = 'Child';

// GetAllPaged requires masterId/detailId route segments, but passing 0/0 skips
// both filters server-side, giving us the unfiltered "single table" list.
const listChildren = async ({
  page = 1,
  limit = 10,
  search = '',
  reverse = true,
  masterId = 0,
  detailId = 0,
} = {}) => {
  const { data } = await httpClient.get(`/${RESOURCE}/GetAllPaged/${masterId}/${detailId}`, {
    params: { page, limit, search, reverse },
  });
  return {
    items: data.childs,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
};

const createChild = async (child) => (await httpClient.post(`/${RESOURCE}/create`, child)).data;

const updateChild = async (child) => (await httpClient.put(`/${RESOURCE}/update`, child)).data;

const deleteChild = async (childId) => (await httpClient.delete(`/${RESOURCE}/delete/${childId}`)).data;

export const childApi = {
  list: listChildren,
  create: createChild,
  update: updateChild,
  remove: deleteChild,
};
