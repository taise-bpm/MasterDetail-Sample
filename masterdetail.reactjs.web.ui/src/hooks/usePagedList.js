import { useState } from 'react';

// Generic page-number pagination for any `fetchPage({ page, limit }) => { items, totalPages }`
// call. Used by both Detail (scoped to a master) and Child (unscoped) so page/size/loading
// state and the load/changePage/changePageSize behavior are written once.
const usePagedList = (fetchPage, { initialPageSize = 10 } = {}) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);

  const load = async (page = 1, size = pageSize) => {
    setLoading(true);
    try {
      const result = await fetchPage({ page, limit: size });
      setItems(result.items ?? []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) load(page);
  };

  const changePageSize = (size) => {
    setPageSize(size);
    load(1, size);
  };

  return {
    items,
    setItems,
    currentPage,
    totalPages,
    pageSize,
    loading,
    load,
    changePage,
    changePageSize,
  };
};

export default usePagedList;
