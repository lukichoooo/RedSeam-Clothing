import React from 'react';
import './Pagination.css';

interface PaginationProps
{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxButtons?: number; // optional, default 5
    prevImg?: string;
    nextImg?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    maxButtons = 5,
    prevImg,
    nextImg,
}) =>
{
    const pages: (number | string)[] = [];

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages)
    {
        endPage = totalPages;
        startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    if (startPage > 1)
    {
        pages.push(1);
        if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++)
    {
        pages.push(i);
    }

    if (endPage < totalPages)
    {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="pagination-controls">
            <button
                className="edge-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {prevImg ? <img src={prevImg} alt="prev" /> : '<'}
            </button>

            <div className="page-buttons">
                {pages.map((p, idx) =>
                    typeof p === 'number' ? (
                        <button
                            key={idx}
                            className={`page-btn ${currentPage === p ? 'active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                    ) : (
                        <span key={idx}>{p}</span>
                    )
                )}
            </div>

            <button
                className="edge-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {nextImg ? <img src={nextImg} alt="next" /> : '>'}
            </button>
        </div>
    );
};

export default Pagination;
