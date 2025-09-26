import React from 'react';
import './ProductCard.css';

type ProductCardProps =
    {
        name: string;
        price: number;
        imageUrl: string;
    }

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl }) =>
{
    return (
        <div className="product-card">
            <img src={imageUrl} alt={name} className="product-image" />
            <div className="product-info">
                <div className="product-name">{name}</div>
                <div className="product-price">${price}</div>
            </div>
        </div>
    );
};

export default ProductCard;
