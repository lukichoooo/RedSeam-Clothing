import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl }) =>
{
    return (
        <Link to={`/product/${id}`} className="product-card-link">
            <div className="product-card">
                <img src={imageUrl} alt={name} className="product-image" />
                <div className="product-info">
                    <div className="product-name">{name}</div>
                    <div className="product-price">${price}</div>
                </div>
            </div>
        </Link>
    );
};


export default ProductCard;
