const buildPageList = (currentPage, totalPages, maxButtons) => {
  const pages = [];
  const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange, maxButtons = 5 }) => (
  <div className="pagination">
    <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
      Previous
    </button>
    {buildPageList(currentPage, totalPages, maxButtons).map((page, index) =>
      page === '...' ? (
        <span key={`ellipsis-${index}`}>...</span>
      ) : (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      )
    )}
    <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
      Next
    </button>
  </div>
);

export default Pagination;
