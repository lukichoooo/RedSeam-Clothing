import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CartSidebar from "../cartSidebar/CartSidebar";
import "./ProductPage.css";
import { productsApi, type ProductByIdResponse } from "../../../services/products/productsApi";
import axios from "axios";

import cartService, { type ProductData } from "../../../services/cart/CartService";


const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

const getAbsoluteImageUrl = (path: string | undefined): string =>
{
    if (!path) return '';
    if (path.startsWith('http'))
    {
        return path;
    }
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};


const ProductPage: React.FC = () =>
{
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    const [product, setProduct] = useState<ProductByIdResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() =>
    {
        if (isNaN(productId))
        {
            setError("Invalid Product ID.");
            setLoading(false);
            return;
        }

        const loadProduct = async () =>
        {
            setLoading(true);
            setError(null);
            try
            {
                const fetchedProduct = await productsApi.fetchProductById({ id: productId });

                setProduct(fetchedProduct);

                const availableImages = fetchedProduct.images && fetchedProduct.images.length > 0
                    ? fetchedProduct.images
                    : (fetchedProduct.cover_image ? [fetchedProduct.cover_image] : []);

                setQuantity(1);

                setSelectedImage(getAbsoluteImageUrl(availableImages[0]));

                setSelectedColor("red");
                setSelectedSize("S");

            } catch (err)
            {
                if (axios.isAxiosError(err) && err.response?.status === 404)
                {
                    setError("Product not found.");
                } else
                {
                    setError("Failed to load product data.");
                }
                console.error("Fetch error:", err);
            } finally
            {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    const handleAddToCart = useCallback(async () =>
    {
        if (!product) return;

        if (!selectedColor || !selectedSize || quantity < 1)
        {
            alert("Please select a color, size, and quantity.");
            return;
        }

        const payload: ProductData = {
            id: product.id,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
        };

        try
        {
            await cartService.addToCart(payload);
            setSidebarOpen(true);
        } catch (e)
        {
            console.error("Error adding to cart:", e);
            alert("Could not add product to cart. Please try again.");
        }
    }, [product, selectedColor, selectedSize, quantity, cartService.addToCart]);

    if (loading) return <div className="product-page-loading">Loading product details...</div>;
    if (error) return <div className="product-page-error">Error: {error}</div>;
    if (!product) return null;

    const productColors = ["red", "blue", "green", "black"];
    const productSizes = ["S", "M", "L", "XL"];

    const rawProductImages = (product.images || []) && (product.images?.length || 0 > 0) ? product.images! : (product.cover_image ? [product.cover_image] : []);
    const productImages = rawProductImages.map(getAbsoluteImageUrl);

    return (
        <>
            <div className="product-page">
                <div className="product-page-left">
                    <div className="thumbnail-list">
                        {productImages.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={img === selectedImage ? "selected" : ""}
                                alt={`${product.name} thumbnail ${idx + 1}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={selectedImage} alt={product.name} />
                    </div>
                </div>

                <div className="product-page-right">
                    <h1>{product.name}</h1>
                    <div className="product-brand">{product.brand.name}</div>
                    <div className="product-price">${product.price.toFixed(2)}</div>

                    <div className="product-color">
                        <span className="label">Color:</span>
                        <span className="current-selection">{selectedColor}</span>
                        <div className="color-options">
                            {productColors.map((color, idx) => (
                                <span
                                    key={idx}
                                    style={{ backgroundColor: color }}
                                    className={`color-swatch ${color === selectedColor ? "selected" : ""}`}
                                    title={color}
                                    onClick={() => setSelectedColor(color)}
                                ></span>
                            ))}
                        </div>
                    </div>

                    <div className="product-size">
                        <span className="label">Size:</span>
                        <div className="size-options">
                            {productSizes.map((size, idx) => (
                                <button
                                    key={idx}
                                    className={`size-button ${size === selectedSize ? "selected" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="product-quantity">
                        <span className="label">Quantity:</span>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {Array.from({ length: Math.min(10, product.quantity) }, (_, i) => i + 1).map((q) => (
                                <option key={q} value={q}>
                                    {q}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="add-to-cart"
                        onClick={handleAddToCart}
                        disabled={!selectedColor || !selectedSize || quantity < 1}
                    >
                        Add to Cart
                    </button>

                    <div className="product-details">
                        <h3>Product Details</h3>
                        <p>b{product.brand.name}</p>
                        <p>
                            This product contains regenerative cotton,
                            which is grown using farming methods that
                            seek to improve soil health, watersheds
                            and biodiversity
                        </p>
                    </div>
                </div>
            </div>

            <CartSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

export default ProductPage;