import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '../card/ProductCard';
import './ProductsPage.css';
import Pagination from '../../../components/pagination.tsx/Pagination';
import bwkBtn from '../../../icons/search/bkw-btn.png';
import fwdBrn from '../../../icons/search/fwd-btn.png';
import filterBtn from '../../../icons/search/filter-btn.png';
import productsApi, { type Data, type Meta, type productsListQuery, type ProductsListResponse } from '../../../services/products/productsApi';

const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

const getAbsoluteImageUrl = (path: string | undefined): string =>
{
    if (!path || path.startsWith('http'))
    {
        return path || '';
    }
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const sortOptions = [
    { label: 'Newest', value: '-created_at' },
    { label: 'Oldest', value: 'created_at' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
];

const ProductsPage: React.FC = () =>
{
    const [data, setData] = useState<Data[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);

    const [priceFrom, setPriceFrom] = useState<number | undefined>();
    const [priceTo, setPriceTo] = useState<number | undefined>();
    const [sort, setSort] = useState<productsListQuery['sort']>(sortOptions[0].value);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const [localPriceFrom, setLocalPriceFrom] = useState<string>(priceFrom?.toString() || '');
    const [localPriceTo, setLocalPriceTo] = useState<string>(priceTo?.toString() || '');

    const filterRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // FIX: Changed the type of 'ref' to explicitly allow HTMLDivElement | null
    const closeDropdowns = useCallback((
        event: MouseEvent,
        ref: React.RefObject<HTMLDivElement | null>,
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    {
        if (ref.current && !ref.current.contains(event.target as Node))
        {
            setter(false);
        }
    }, []);

    useEffect(() =>
    {
        const handleFilterClickOutside = (event: MouseEvent) => closeDropdowns(event, filterRef, setIsFilterDropdownOpen);
        const handleSortClickOutside = (event: MouseEvent) => closeDropdowns(event, sortRef, setIsSortDropdownOpen);

        if (isFilterDropdownOpen)
        {
            document.addEventListener('mousedown', handleFilterClickOutside);
        }
        if (isSortDropdownOpen)
        {
            document.addEventListener('mousedown', handleSortClickOutside);
        }

        return () =>
        {
            document.removeEventListener('mousedown', handleFilterClickOutside);
            document.removeEventListener('mousedown', handleSortClickOutside);
        };
    }, [isFilterDropdownOpen, isSortDropdownOpen, closeDropdowns]);

    const fetchProducts = useCallback(async () =>
    {
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
            setMeta(response.meta);

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

    useEffect(() =>
    {
        fetchProducts();
    }, [fetchProducts]);

    const handlePageChange = (newPage: number) =>
    {
        if (newPage >= 1 && newPage <= totalPages)
        {
            setPage(newPage);
        }
    };

    const handleSortChange = (newSortValue: productsListQuery['sort']) =>
    {
        setSort(newSortValue);
        setIsSortDropdownOpen(false);
        setPage(1);
    };

    const handleApplyFilters = () =>
    {
        const from = parseFloat(localPriceFrom) || undefined;
        const to = parseFloat(localPriceTo) || undefined;

        setPriceFrom(from);
        setPriceTo(to);

        setPage(1);
        setIsFilterDropdownOpen(false);
    };

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
                        <span>
                            Showing {meta.from}-{meta.to} of {meta.total} results
                        </span>
                    )}
                    |

                    <div className="filter-dropdown-container" ref={filterRef}>
                        <button
                            className="filter-btn"
                            disabled={loading}
                            onClick={() => setIsFilterDropdownOpen(c => !c)}
                        >
                            <img
                                className="dropdown-icon"
                                src={filterBtn}
                                alt="Filter Icon"
                            />
                            <span>Filter</span>
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="filter-dropdown-menu">
                                <h3 className="filter-title">Select Price</h3>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        placeholder="From"
                                        value={localPriceFrom}
                                        onChange={(e) => setLocalPriceFrom(e.target.value)}
                                        min="0"
                                    />
                                    <input
                                        type="number"
                                        placeholder="To"
                                        value={localPriceTo}
                                        onChange={(e) => setLocalPriceTo(e.target.value)}
                                        min="0"
                                    />
                                </div>
                                <div className="filter-actions">
                                    <button
                                        className="apply-btn"
                                        onClick={handleApplyFilters}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="sort-dropdown-container" ref={sortRef}>
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