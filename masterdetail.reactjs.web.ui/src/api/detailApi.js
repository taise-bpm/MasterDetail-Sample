import httpClient from './httpClient';

// Matches the routes exposed by DetailController ([Route("api/[controller]")]).
const RESOURCE = 'Detail';

// GetAllPaged requires a masterId route segment, but 0 skips the filter
// server-side - so `list` doubles as "all details" (masterId omitted) and
// "details of one master" (masterId provided), same pattern as childApi.
const listDetails = async ({ page = 1, limit = 10, search = '', reverse = true, masterId = 0 } = {}) => {
  const { data } = await httpClient.get(`/${RESOURCE}/GetAllPaged/${masterId}`, {
    params: { page, limit, search, reverse },
  });
  return {
    items: data.details,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
};

const createDetail = async (detail) => (await httpClient.post(`/${RESOURCE}/create`, detail)).data;

const updateDetail = async (detail) => (await httpClient.put(`/${RESOURCE}/update`, detail)).data;

const deleteDetail = async (detailId) => (await httpClient.delete(`/${RESOURCE}/delete/${detailId}`)).data;

export const detailApi = {
  list: listDetails,
  create: createDetail,
  update: updateDetail,
  remove: deleteDetail,
};
