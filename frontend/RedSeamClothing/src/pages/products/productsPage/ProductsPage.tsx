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
// ---------------------------------------------

const ProductsPage: React.FC = () =>
{
    const [data, setData] = useState<Data[]>([]);
    const [links, setLinks] = useState<Links | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);

    // State for filters and sorting
    const [priceFrom, setPriceFrom] = useState<number | undefined>();
    const [priceTo, setPriceTo] = useState<number | undefined>();
    const [sort, setSort] = useState<'price' | '-price' | 'created_at' | '-created_at' | undefined>();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, [page, priceFrom, priceTo, sort]); // Re-run fetch when page or filters change

    useEffect(() =>
    {
        fetchProducts();
    }, [fetchProducts]); // This effect depends on the memoized fetchProducts function

    const handlePageChange = (newPage: number) =>
    {
        if (newPage >= 1 && newPage <= totalPages)
        {
            setPage(newPage);
        }
    };

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
                    <button className="sort-btn" disabled={loading}>
                        <span>Sort By</span>
                        <span className="dropdown-icon">▼</span>
                    </button>
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
                        // Use the utility function to get the full image URL
                        image={getAbsoluteImageUrl(product.image)}
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