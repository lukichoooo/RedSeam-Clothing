import React, { useState } from 'react';
import ProductCard from './card/ProductCard';
import './ProductsPage.css';

interface Product
{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

// Example mock products
const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 45 + i,
    imageUrl: `https://via.placeholder.com/412x549.png?text=Product+${i + 1}`,
}));

const ProductsPage: React.FC = () =>
{
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 4 columns x 3 rows

    const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

    const currentItems = mockProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="products-page">
            {/* Header */}
            <div className="products-header">
                <div className="header-left">
                    <h1>Products</h1>
                </div>
                <div className="header-right">
                    <span>
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, mockProducts.length)} of{' '}
                        {mockProducts.length} results
                    </span>
                    <button className="filter-btn">
                        <span>Filter</span>
                        <span className="dropdown-icon">▼</span>
                    </button>
                    <button className="sort-btn">
                        <span>Sort By</span>
                        <span className="dropdown-icon">▼</span>
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {currentItems.map((product) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.imageUrl}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    Prev
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductsPage;
