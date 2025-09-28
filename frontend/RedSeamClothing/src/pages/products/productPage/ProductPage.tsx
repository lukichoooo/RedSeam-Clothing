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

    // FIX 1: Utility to check if a color is available (has a mapped image)
    const isColorAvailable = useCallback((color: string): boolean =>
    {
        return colorImageMap.has(color);
    }, [colorImageMap]);


    // --- Handlers for Two-Way Sync ---

    const handleColorSelect = useCallback((color: string) =>
    {
        // Only allow selection if the color is available
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

    // --- Initial Load Effect ---

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
                setQuantity(1);

                // Determine the first available color
                const availableColors = SIMULATED_COLORS.filter(color => colorImageMap.has(color));

                // Default selection is the first available color, or the first simulated color if maps are empty
                const defaultColor = availableColors[0] || SIMULATED_COLORS[0] || "";
                setSelectedColor(defaultColor);
                setSelectedSize(PRODUCT_SIZES[0] || "");

                // Set default image based on the default color mapping
                const defaultImage = colorImageMap.get(defaultColor);

                if (defaultImage)
                {
                    setSelectedImage(defaultImage);
                } else
                {
                    // Fallback to the first raw image if mapping failed
                    const availableImages = fetchedProduct.images && fetchedProduct.images.length > 0
                        ? fetchedProduct.images
                        : (fetchedProduct.cover_image ? [fetchedProduct.cover_image] : []);
                    setSelectedImage(getAbsoluteImageUrl(availableImages[0]));
                }

            } catch (err)
            {
                setError("Failed to load product data.");
                console.error("Fetch error:", err);
            } finally
            {
                setLoading(false);
            }
        };

        // We call loadProduct directly, but we rely on the `useMemo` hooks (productImages, colorImageMap)
        // being calculated *after* setProduct runs. This is handled naturally by React's rendering cycle.
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
    }, [product, selectedColor, selectedSize, quantity]);


    if (loading) return <div className="product-page-loading">Loading product details...</div>;
    if (error) return <div className="product-page-error">Error: {error}</div>;
    if (!product) return null;


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
                                const isAvailable = isColorAvailable(color); // FIX 2: Check availability

                                return (
                                    <span
                                        key={idx}
                                        style={{ backgroundColor: color }}
                                        className={`color-swatch ${color === selectedColor ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`} // FIX 3: Add disabled class
                                        title={color + (!isAvailable ? " (Unavailable)" : "")}
                                        onClick={() => isAvailable ? handleColorSelect(color) : undefined} // FIX 4: Conditional click handler
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
                        <p>{product.brand.name}</p>
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