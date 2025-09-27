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
    // FIX: Set initial state to defaults to ensure button is enabled on load
    const [selectedColor, setSelectedColor] = useState("red");
    const [selectedSize, setSelectedSize] = useState("S");
    const [quantity, setQuantity] = useState(1);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Define available options (moved out of render for consistency)
    const productColors = ["red", "blue", "green", "black"];
    const productSizes = ["S", "M", "L", "XL"];

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

                // FIX: Set quantity to 1 if stock is available, otherwise 0.
                setQuantity(fetchedProduct.quantity > 0 ? 1 : 0);

                setSelectedImage(getAbsoluteImageUrl(availableImages[0]));

                // Default selections are now handled by useState initialization, 
                // but we can re-confirm them here for robustness if needed.
                // setSelectedColor("red");
                // setSelectedSize("S"); 

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
        const currentQuantity = quantity;

        // Safety check for out of stock or missing data before sending to cartService
        if (!product || product.quantity === 0) return;

        // The validation check remains important, even with defaults set
        if (!selectedColor || !selectedSize || currentQuantity < 1)
        {
            alert("Please select a valid color, size, and quantity greater than 0.");
            return;
        }

        const payload: ProductData = {
            id: product.id,
            color: selectedColor,
            size: selectedSize,
            quantity: currentQuantity,
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
    }, [product, selectedColor, selectedSize, quantity]);

    if (loading) return <div className="product-page-loading">Loading product details...</div>;
    if (error) return <div className="product-page-error">Error: {error}</div>;
    if (!product) return null;

    // Use a simpler check for product images
    const rawProductImages = (product.images && product.images.length > 0)
        ? product.images
        : (product.cover_image ? [product.cover_image] : []);
    const productImages = rawProductImages.map(getAbsoluteImageUrl);

    // FIX: Calculate maximum available quantity (up to 10 max)
    const maxQuantity = Math.max(0, Math.min(10, product.quantity));
    const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

    const isOutOfStock = product.quantity === 0;


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

                    {/* FIX: Change Size back to side-by-side buttons */}
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
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? (
                                <option value={0}>Out of Stock</option>
                            ) : (
                                quantityOptions.map((q) => (
                                    <option key={q} value={q}>{q}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <button
                        className="add-to-cart"
                        onClick={handleAddToCart}
                        // FIX: Only disable if out of stock, as selections are guaranteed by default state.
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <div className="product-details">
                        <h3>Product Details</h3>
                        <p>Brand: {product.brand.name}</p>
                        <p>This product contains regenerative cotton,
                            which is grown using farming methods that seek to improve soil health,
                            watersheds and biodiversity.
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