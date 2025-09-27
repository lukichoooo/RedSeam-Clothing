import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    image: string;
};

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/412x549.png?text=Image+Not+Available";

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image }) =>
{
    const finalImageUrl = image && image.startsWith('http') ? image : PLACEHOLDER_IMAGE;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) =>
    {
        if (e.currentTarget.src !== PLACEHOLDER_IMAGE)
        {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
        }
    };

    return (
        <Link to={`/product/${id}`} className="product-card-link">
            <div className="product-card">
                <img
                    src={finalImageUrl}
                    alt={name}
                    className="product-image"
                    onError={handleImageError}
                />
                <div className="product-info">
                    <div className="product-name">{name}</div>
                    <div className="product-price">${price.toFixed(2)}</div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;