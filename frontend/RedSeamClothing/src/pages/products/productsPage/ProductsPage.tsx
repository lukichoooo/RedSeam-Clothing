import React, { useState } from 'react';
import ProductCard from '../card/ProductCard';
import './ProductsPage.css';
import Pagination from '../../../components/pagination.tsx/Pagination';
import bwkBtn from '../../../icons/search/bkw-btn.png';
import fwdBrn from '../../../icons/search/fwd-btn.png';
import filterBtn from '../../../icons/search/filter-btn.png';

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
    const itemsPerPage = 10; // 4 columns x 3 rows

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
                    |
                    <button className="filter-btn">
                        <img
                            className="dropdown-icon"
                            src={filterBtn}
                            alt="Filter Icon"
                        />
                        <span>Filter</span>
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
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.imageUrl}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                prevImg={bwkBtn}
                nextImg={fwdBrn}
            />

        </div >
    );
};

export default ProductsPage;
