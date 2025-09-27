import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../../services/context/CartContext";
import CartSidebar from "../cartSidebar/CartSidebar";
import "./ProductPage.css";
// Corrected import: 'ProductsListResponseL' is not defined. Use 'ProductByIdResponse' for the single product data.
import { productsApi, type ProductByIdResponse } from "../../../services/products/productsApi";
import axios from "axios";

import type { ProductData } from "../../../services/cart/cart.types";


// --- Utility Function to Fix Image URLs ---
const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

const getAbsoluteImageUrl = (path: string | undefined): string =>
{
    if (!path) return '';
    // Check if the path is already absolute (starts with http)
    if (path.startsWith('http'))
    {
        return path;
    }
    // Prepend the base URL for relative paths
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
// ------------------------------------------

const ProductPage: React.FC = () =>
{
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    // Corrected state type to use ProductByIdResponse
    const [product, setProduct] = useState<ProductByIdResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();
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
                // FIX: productsApi.fetchProductById expects an object { id: number }
                const fetchedProduct = await productsApi.fetchProductById({ id: productId });

                setProduct(fetchedProduct);

                // Ensure a safe array of images for initialization
                const availableImages = fetchedProduct.images && fetchedProduct.images.length > 0
                    ? fetchedProduct.images
                    : (fetchedProduct.cover_image ? [fetchedProduct.cover_image] : []);

                setQuantity(1);

                // Set initial image using the new utility
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
            quantity,
        };

        try
        {
            await addToCart(payload);
            setSidebarOpen(true);
        } catch (e)
        {
            console.error("Error adding to cart:", e);
            alert("Could not add product to cart. Please try again.");
        }
    }, [product, selectedColor, selectedSize, quantity, addToCart]);

    if (loading) return <div className="product-page-loading">Loading product details...</div>;
    if (error) return <div className="product-page-error">Error: {error}</div>;
    if (!product) return null;

    // Hardcoded options can be improved by fetching from the product data if available
    const productColors = ["red", "blue", "green", "black"];
    const productSizes = ["S", "M", "L", "XL"];

    // Process all images to ensure they are absolute URLs
    // Added a check for images being null/undefined before spreading
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
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            {productSizes.map((size, idx) => (
                                <option key={idx} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="product-quantity">
                        <span className="label">Quantity:</span>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {/* Ensure quantity selection does not exceed product's available quantity */}
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
                        <p>{product.description}</p>
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