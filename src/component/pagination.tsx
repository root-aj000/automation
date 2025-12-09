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

  const buttonBase = "flex items-center justify-center min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-300";
  const buttonInactive = `${buttonBase} bg-surface-elevated border border-gray-200 dark:border-gray-800 text-foreground hover:border-primary/50 hover:text-primary card-hover`;
  const buttonActive = `${buttonBase} btn-primary text-white`;

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-12">
      <ul className="flex items-center gap-2">
        {/* Prev */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageUrl(currentPage - 1)}
              className={buttonInactive}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </Link>
          </li>
        )}

        {/* First */}
        {startPage > 1 && (
          <li>
            <Link
              href={getPageUrl(1)}
              className={buttonInactive}
            >
              1
            </Link>
          </li>
        )}

        {/* Left Ellipsis */}
        {startPage > 2 && (
          <li>
            <span className="px-2 text-muted">…</span>
          </li>
        )}

        {/* Pages */}
        {pagesToShow.map((page) => (
          <li key={page}>
            <Link
              href={getPageUrl(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={page === currentPage ? buttonActive : buttonInactive}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* Right Ellipsis */}
        {endPage < totalPages - 1 && (
          <li>
            <span className="px-2 text-muted">…</span>
          </li>
        )}

        {/* Last */}
        {endPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(totalPages)}
              className={buttonInactive}
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
              className={buttonInactive}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
