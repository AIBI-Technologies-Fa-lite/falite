interface PaginationProps {
  currentPage: number;
  totalPageCount: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPageCount, onPageChange, onNext, onPrevious, canPreviousPage, canNextPage }) => {
  // Calculate the visible pages
  const visiblePages = () => {
    let start = Math.max(currentPage - 1, 0);
    let end = Math.min(start + 3, totalPageCount);

    if (end === totalPageCount) {
      start = Math.max(end - 3, 0);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={onPrevious}
        disabled={!canPreviousPage}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          canPreviousPage ? "text-gray-600 hover:text-purple-600" : "text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>
      {visiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === page ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          aria-label={`Go to page ${page + 1}`}
        >
          {page + 1}
        </button>
      ))}
      <button
        onClick={onNext}
        disabled={!canNextPage}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          canNextPage ? "text-gray-600 hover:text-purple-600" : "text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
