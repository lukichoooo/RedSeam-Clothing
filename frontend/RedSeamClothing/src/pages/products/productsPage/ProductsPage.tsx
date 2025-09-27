import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../card/ProductCard';
import './ProductsPage.css';
import Pagination from '../../../components/pagination.tsx/Pagination';
import bwkBtn from '../../../icons/search/bkw-btn.png';
import fwdBrn from '../../../icons/search/fwd-btn.png';
import filterBtn from '../../../icons/search/filter-btn.png';
import { productsApi, type ListProductItemResponse, type ProductsListResponse } from '../../../services/productsApi';

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
    const [products, setProducts] = useState<ListProductItemResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortOption, setSortOption] = useState<'price' | '-price' | 'created_at' | '-created_at'>();

    const fetchProducts = useCallback(async (page: number, sort?: string) =>
    {
        setLoading(true);
        setError(null);
        try
        {
            const filters = {
                page: page,
                sort: sort as any,
            };

            const response: ProductsListResponse = await productsApi.fetchProducts(filters);

            setProducts(response.data);
            setTotalPages(response.meta.current_page + (response.links.next ? 1 : 0));

            const newTotalItems = (response.meta.current_page - 1) * response.meta.per_page + response.data.length;
            setTotalItems(newTotalItems);

        } catch (e)
        {
            console.error("Failed to fetch products:", e);
            setError("Failed to load products. Please try again.");
            setProducts([]);
            setTotalPages(1);
            setTotalItems(0);
        } finally
        {
            setLoading(false);
        }
    }, []);

    useEffect(() =>
    {
        fetchProducts(currentPage, sortOption);
    }, [currentPage, sortOption, fetchProducts]);

    const handlePageChange = (page: number) =>
    {
        if (page >= 1 && page <= totalPages)
        {
            setCurrentPage(page);
        }
    };

    if (loading && products.length === 0)
    {
        return <div className="products-page-loading">Loading products... 🛒</div>;
    }

    const startItem = (currentPage - 1) * products.length + 1;
    const endItem = startItem + products.length - 1;

    return (
        <div className="products-page">

            <div className="products-header">
                <div className="header-left">
                    <h1>Products</h1>
                </div>
                <div className="header-right">
                    {products.length > 0 && (
                        <span>
                            Showing {startItem}-{endItem} results
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

            {!loading && products.length === 0 && !error && (
                <div className="no-results">No products found matching your criteria.</div>
            )}

            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        // FIX APPLIED HERE: Ensure imageUrl is an absolute path
                        imageUrl={getAbsoluteImageUrl(product.image)}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
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