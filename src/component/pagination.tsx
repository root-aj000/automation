"use client";

import Link from "next/link";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  basePath: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  basePath,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visibleRange = 5;
  const halfRange = Math.floor(visibleRange / 2);

  let startPage = Math.max(1, currentPage - halfRange);
  const endPage = Math.min(totalPages, startPage + visibleRange - 1);

  if (endPage - startPage + 1 < visibleRange) {
    startPage = Math.max(1, endPage - visibleRange + 1);
  }

  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const getPageUrl = (page: number) => {
    return page === 1 ? `${basePath}` : `${basePath}/page/${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-10 bg-white">
      <ul className="flex items-center space-x-2 text-sm">
        {/* Prev */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageUrl(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Prev
            </Link>
          </li>
        )}

        {/* First */}
        {startPage > 1 && (
          <li>
            <Link
              href={getPageUrl(1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              1
            </Link>
          </li>
        )}

        {/* Left Ellipsis */}
        {startPage > 2 && <li><span className="px-2">…</span></li>}

        {/* Pages */}
        {pagesToShow.map((page) => (
          <li key={page}>
            <Link
              href={getPageUrl(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-orange-500 text-white border-orange-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* Right Ellipsis */}
        {endPage < totalPages - 1 && <li><span className="px-2">…</span></li>}

        {/* Last */}
        {endPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(totalPages)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              {totalPages}
            </Link>
          </li>
        )}

        {/* Next */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
