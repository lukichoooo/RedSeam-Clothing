import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../card/ProductCard';
import './ProductsPage.css';
import Pagination from '../../../components/pagination.tsx/Pagination';
import bwkBtn from '../../../icons/search/bkw-btn.png';
import fwdBrn from '../../../icons/search/fwd-btn.png';
import filterBtn from '../../../icons/search/filter-btn.png';
import productsApi, { type Data, type Links, type Meta, type productsListQuery, type ProductsListResponse } from '../../../services/products/productsApi';

// --- Define the correct base URL for images ---
const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

// Utility function to convert relative paths to absolute URLs
const getAbsoluteImageUrl = (path: string | undefined): string =>
{
    if (!path || path.startsWith('http'))
    {
        return path || '';
    }
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Define the available sort options
const sortOptions = [
    { label: 'Newest', value: '-created_at' },
    { label: 'Oldest', value: 'created_at' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
];

const ProductsPage: React.FC = () =>
{
    const [data, setData] = useState<Data[]>([]);
    const [links, setLinks] = useState<Links | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);

    // State for filters and sorting
    const [priceFrom, setPriceFrom] = useState<number | undefined>();
    const [priceTo, setPriceTo] = useState<number | undefined>();
    // Initialize sort state to the first option, or leave undefined if no default is desired
    const [sort, setSort] = useState<productsListQuery['sort']>(sortOptions[0].value);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New state for dropdown visibility
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const fetchProducts = useCallback(async () =>
    {
        // When filters/sort changes, we should reset to page 1
        if (page !== 1 && !loading)
        {
            setPage(1);
            return; // Exit and let the next useEffect call the function with page=1
        }

        setLoading(true);
        setError(null);
        try
        {
            const filters: productsListQuery = { page };
            if (priceFrom && priceFrom > 0) filters['filter[price_from]'] = priceFrom;
            if (priceTo && priceTo > 0) filters['filter[price_to]'] = priceTo;
            if (sort) filters.sort = sort;

            const response: ProductsListResponse = await productsApi.fetchProductsList(filters);

            setData(response.data);
            setLinks(response.links);
            setMeta(response.meta);

            // Calculate total pages dynamically from the API response
            const total = response.meta.total || 0;
            const perPage = response.meta.per_page || 1;
            setTotalPages(Math.ceil(total / perPage));

        } catch (e)
        {
            console.error("Failed to fetch products:", e);
            setError("Failed to load products. Please try again.");
            setData([]);
            setTotalPages(1);
        } finally
        {
            setLoading(false);
        }
    }, [page, priceFrom, priceTo, sort]);
    // ^ Minor refinement: fetchProducts should ideally only be called when page, price, or sort changes.

    useEffect(() =>
    {
        // If sort or filters change, we want to reset the page to 1
        // The useCallback above handles the setPage(1) logic on filter change.
        if (page === 1)
        {
            fetchProducts();
        }
    }, [fetchProducts]);

    const handlePageChange = (newPage: number) =>
    {
        if (newPage >= 1 && newPage <= totalPages)
        {
            setPage(newPage);
        }
    };

    // Function to handle sort selection
    const handleSortChange = (newSortValue: productsListQuery['sort']) =>
    {
        setSort(newSortValue);
        setIsSortDropdownOpen(false); // Close dropdown after selection
        setPage(1); // Crucial: Reset to first page when changing sort criteria
    };

    // Get the label for the currently selected sort option
    const currentSortLabel = sortOptions.find(option => option.value === sort)?.label || 'Sort By';

    if (loading && data.length === 0)
    {
        return <div className="products-page-loading">Loading products... 🛒</div>;
    }

    return (
        <div className="products-page">

            <div className="products-header">
                <div className="header-left">
                    <h1>Products</h1>
                </div>
                <div className="header-right">
                    {meta && meta.total > 0 && (
                        // Use meta info for more accurate result count
                        <span>
                            Showing {meta.from}-{meta.to} of {meta.total} results
                        </span>
                    )}
                    |
                    <button className="filter-btn" disabled={loading}>
                        <img
                            className="dropdown-icon"
                            src={filterBtn}
                            alt="Filter Icon"
                        />
                        <span>Filter</span>
                    </button>

                    {/* Sort Dropdown Container */}
                    <div className="sort-dropdown-container">
                        <button
                            className="sort-btn"
                            disabled={loading}
                            onClick={() => setIsSortDropdownOpen(c => !c)}
                        >
                            <span>{currentSortLabel}</span>
                            <span className="dropdown-icon">▼</span>
                        </button>

                        {isSortDropdownOpen && (
                            <div className="sort-dropdown-menu">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={sort === option.value ? 'sort-option active' : 'sort-option'}
                                        onClick={() => handleSortChange(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {error && <div className="products-page-error">{error}</div>}

            {!loading && data.length === 0 && !error && (
                <div className="no-results">No products found matching your criteria.</div>
            )}

            <div className="product-grid">
                {data.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={getAbsoluteImageUrl(product.cover_image)}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    prevImg={bwkBtn}
                    nextImg={fwdBrn}
                />
            )}
        </div >
    );
};

export default ProductsPage;