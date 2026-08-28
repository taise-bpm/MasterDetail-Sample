import httpClient from './httpClient';

// Matches the routes exposed by MasterController ([Route("api/[controller]")]).
const RESOURCE = 'Master';

const listMasters = async ({ page = 1, limit = 20, search = '', reverse = true } = {}) => {
  const { data } = await httpClient.get(`/${RESOURCE}/GetAllPaged`, {
    params: { page, limit, search, reverse },
  });
  return {
    items: data.masters,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
};

const createMaster = async (master) => (await httpClient.post(`/${RESOURCE}/create`, master)).data;

const updateMaster = async (master) => (await httpClient.put(`/${RESOURCE}/update`, master)).data;

const deleteMaster = async (masterId) => (await httpClient.delete(`/${RESOURCE}/delete/${masterId}`)).data;

// A uniform { list, create, update, remove } shape so generic hooks/components
// (useCrudMutations, usePagedList, ...) can drive any entity the same way.
export const masterApi = {
  list: listMasters,
  create: createMaster,
  update: updateMaster,
  remove: deleteMaster,
};
