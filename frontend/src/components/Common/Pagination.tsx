import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isPrevDisabled = currentPage === 1 || loading;
  const isNextDisabled = currentPage === totalPages || loading;

  return (
    <div className="pagination" data-testid="pagination">
      <button
        onClick={handlePrevious}
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        data-testid="pagination-prev"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        data-testid="pagination-next"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;