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

    if (totalPages <= 1) return null;


    const half = Math.floor(maxButtons / 2);

    let startPage = currentPage - half;
    let endPage = currentPage + half;

    if (startPage < 1)
    {
        startPage = 1;
        endPage = Math.min(maxButtons, totalPages);
    }

    if (endPage > totalPages)
    {
        endPage = totalPages;
        startPage = Math.max(totalPages - maxButtons + 1, 1);
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
        if (endPage < totalPages) pages.push(totalPages);
    }


    return (
        <div className="pagination-controls">
            <button
                className="edge-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {prevImg ? <img src={prevImg} alt="Previous" /> : '<'}
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
                        <span key={idx} className="ellipsis">{p}</span>
                    )
                )}
            </div>

            <button
                className="edge-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {nextImg ? <img src={nextImg} alt="Next" /> : '>'}
            </button>
        </div>
    );
};

export default Pagination;