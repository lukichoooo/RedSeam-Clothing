import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import CartSidebar from "../cartSidebar/CartSidebar";
import "./ProductPage.css";
import { productsApi, type ProductByIdResponse } from "../../../services/products/productsApi";
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


const SIMULATED_COLORS = ["red", "blue", "green", "black"];
const PRODUCT_SIZES = ["S", "M", "L", "XL"];


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
    // 1. ADD: State for quantity
    const [quantity, setQuantity] = useState(1);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // --- Derived State and Logic for Color/Image Sync ---

    // 1. Get all available image URLs
    const productImages = useMemo(() =>
    {
        if (!product) return [];
        const rawImages = (product.images || []) && (product.images?.length || 0 > 0)
            ? product.images!
            : (product.cover_image ? [product.cover_image] : []);
        return rawImages.map(getAbsoluteImageUrl);
    }, [product]);

    // 2. Map Image URL to Color (Simulating API matching logic)
    const imageColorMap = useMemo(() =>
    {
        const map = new Map<string, string>();
        productImages.forEach((imgUrl, index) =>
        {
            if (index < SIMULATED_COLORS.length)
            {
                map.set(imgUrl, SIMULATED_COLORS[index]);
            }
        });
        return map;
    }, [productImages]);

    // 3. Map Color to Image URL
    const colorImageMap = useMemo(() =>
    {
        const map = new Map<string, string>();
        SIMULATED_COLORS.forEach((color, index) =>
        {
            if (index < productImages.length)
            {
                map.set(color, productImages[index]);
            }
        });
        return map;
    }, [productImages]);

    const isColorAvailable = useCallback((color: string): boolean =>
    {
        return colorImageMap.has(color);
    }, [colorImageMap]);



    const handleColorSelect = useCallback((color: string) =>
    {
        if (!isColorAvailable(color)) return;

        setSelectedColor(color);

        const image = colorImageMap.get(color);
        if (image)
        {
            setSelectedImage(image);
        }
    }, [colorImageMap, isColorAvailable]);

    const handleImageSelect = useCallback((image: string) =>
    {
        setSelectedImage(image);

        const color = imageColorMap.get(image);
        if (color)
        {
            setSelectedColor(color);
        }
    }, [imageColorMap]);

    // --- Initial Load Effect (Fetch Data) ---

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
                // 2. CHANGE: Set default quantity to 1
                setQuantity(1);
                setSelectedSize(PRODUCT_SIZES[0] || "");
            } catch (err)
            {
                setError("Failed to load product data.");
                console.error("Fetch error:", err);
            } finally
            {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);


    // Effect to handle default color/image selection AFTER product and maps are ready
    useEffect(() =>
    {
        if (product && productImages.length > 0 && colorImageMap.size > 0)
        {

            const availableColors = SIMULATED_COLORS.filter(color => colorImageMap.has(color));
            const defaultColor = availableColors[0] || SIMULATED_COLORS[0] || "";

            // Only update if the selected color hasn't been set yet (initial load)
            if (!selectedColor)
            {
                setSelectedColor(defaultColor);
            }

            const defaultImage = colorImageMap.get(selectedColor || defaultColor);

            if (defaultImage)
            {
                setSelectedImage(defaultImage);
            } else if (productImages.length > 0)
            {
                setSelectedImage(productImages[0]);
            }
        }
    }, [product, productImages, colorImageMap, selectedColor]);


    const handleAddToCart = useCallback(async () =>
    {
        if (!product) return;

        // 3. CHANGE: Use the state quantity
        const quantityToAdd = quantity;

        if (!selectedColor || !selectedSize || quantityToAdd < 1)
        {
            alert("Please select a color, size, and quantity.");
            return;
        }

        const payload: ProductData = {
            id: product.id,
            color: selectedColor,
            size: selectedSize,
            quantity: quantityToAdd, // Use state quantity
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
    }, [product, selectedColor, selectedSize, quantity]); // 4. DEPENDENCY: Add quantity to dependency array


    if (loading) return <div className="product-page-loading">Loading product details...</div>;
    if (error) return <div className="product-page-error">Error: {error}</div>;
    if (!product) return null;


    return (
        <>
            <div className="product-page">
                {/* ... existing JSX for product-page-left and product-page-right ... */}
                <div className="product-page-left">
                    <div className="thumbnail-list">
                        {productImages.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={img === selectedImage ? "selected" : ""}
                                alt={`${product.name} thumbnail ${idx + 1}`}
                                onClick={() => handleImageSelect(img)}
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
                            {SIMULATED_COLORS.map((color, idx) =>
                            {
                                const isAvailable = isColorAvailable(color);

                                return (
                                    <span
                                        key={idx}
                                        style={{ backgroundColor: color }}
                                        className={`color-swatch ${color === selectedColor ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`}
                                        title={color + (!isAvailable ? " (Unavailable)" : "")}
                                        onClick={() => isAvailable ? handleColorSelect(color) : undefined}
                                    ></span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="product-size">
                        <span className="label">Size:</span>
                        <div className="size-options">
                            {PRODUCT_SIZES.map((size, idx) => (
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

                    {/* 5. ADD: Quantity selector */}
                    <div className="product-quantity">
                        <span className="label">Quantity:</span>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {/* Option list for quantity (e.g., 1 to 10) */}
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
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
                        <p className="product-brand"> {/* Added a wrapper class for styling */}
                            <span>Brand: {product.brand.name}</span> {/* Wrapped the text in a span */}
                            <img
                                className="brand-logo"
                                src={product.brand.image}
                                alt="brand logo"
                            />
                        </p>
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