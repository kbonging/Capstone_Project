export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { currentPage, totalPage, firstPage, lastPage } = pagination;

  const pages = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pages.push(i);
  }

  const isFirstGroup = currentPage <= 10;
  const isLastGroup = Math.floor((currentPage - 1) / 10) === Math.floor((totalPage - 1) / 10);

  const showGroupArrows = totalPage > 10;

  const goPrevGroup = () => {
    const targetPage = Math.max(1, currentPage - 10);
    onPageChange(targetPage);
  };

  const goNextGroup = () => {
    const targetPage = Math.min(totalPage, currentPage + 10);
    onPageChange(targetPage);
  };

  return (
    <div className="flex justify-center mt-8 space-x-1 text-sm">
        {/* << 그룹 이전 */}
        {showGroupArrows && (
            <button
            onClick={goPrevGroup}
            disabled={isFirstGroup}
            className={`p-1 ${
                isFirstGroup ? "text-gray-300" : "text-gray-500 hover:text-blue-500"
            }`}
            aria-label="이전 그룹"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7M19 19l-7-7 7-7" />
            </svg>
            </button>
        )}
        {/* < 이전 */}
        <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1 ${
            currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:text-blue-500"
        }`}
        aria-label="이전 페이지"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        </button>

      {/* 페이지 번호 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-200 text-blue-600"
              : " hover:bg-blue-100 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

        {/* > 다음 */}
        <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className={`p-1 ${
            currentPage === totalPage ? "text-gray-300" : "text-gray-500 hover:text-blue-500"
        }`}
        aria-label="다음 페이지"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        </button>

        {/* >> 그룹 다음 */}
        {showGroupArrows && (
            <button
            onClick={goNextGroup}
            disabled={isLastGroup}
            className={`p-1 ${
                isLastGroup ? "text-gray-300" : "text-gray-500 hover:text-blue-500"
            }`}
            aria-label="다음 그룹"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            </button>
        )}
    </div>
  );
}
