import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../../services/context/CartContext"; // adjust path
import CartSidebar from "../cartSidebar/CartSidebar";
import "./ProductPage.css";

interface Product
{
    id: number;
    name: string;
    price: number;
    brand: string;
    images: string[];
    colors: string[];
    sizes: string[];
}

// Mock products
const mockProducts: Product[] = [
    {
        id: 1,
        name: "Example Product 1",
        price: 99,
        brand: "Brand A",
        images: [
            "https://via.placeholder.com/703x937.png?text=1",
            "https://via.placeholder.com/703x937.png?text=2",
            "https://via.placeholder.com/703x937.png?text=3",
        ],
        colors: ["red", "blue", "green"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: 2,
        name: "Example Product 2",
        price: 55,
        brand: "Brand B",
        images: [
            "https://via.placeholder.com/703x937.png?text=1",
            "https://via.placeholder.com/703x937.png?text=2",
            "https://via.placeholder.com/703x937.png?text=3",
        ],
        colors: ["red", "blue", "yellow"],
        sizes: ["S", "M", "L", "XL"],
    },
];

const ProductPage: React.FC = () =>
{
    const { id } = useParams<{ id: string }>();
    const product = mockProducts.find((p) => p.id === Number(id));

    const [selectedImage, setSelectedImage] = useState(product?.images[0] ?? "");
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? "");
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
    const [quantity, setQuantity] = useState(1);

    // Cart context
    const { items, addToCart, updateQuantity, removeFromCart } = useCart();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    if (!product) return <div>Product not found</div>;

    const handleAddToCart = () =>
    {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
        });
        setSidebarOpen(true); // open sidebar after adding
    };

    return (
        <>
            <div className="product-page">
                {/* Left: Images */}
                <div className="product-page-left">
                    <div className="thumbnail-list">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={img === selectedImage ? "selected" : ""}
                                alt={`Thumbnail ${idx + 1}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={selectedImage} alt={product.name} />
                    </div>
                </div>

                {/* Right: Product info */}
                <div className="product-page-right">
                    <h1>{product.name}</h1>
                    <div className="product-price">${product.price}</div>

                    <div className="product-color">
                        Color:
                        <div className="color-options">
                            {product.colors.map((color, idx) => (
                                <span
                                    key={idx}
                                    style={{ backgroundColor: color }}
                                    className={color === selectedColor ? "selected" : ""}
                                    onClick={() => setSelectedColor(color)}
                                ></span>
                            ))}
                        </div>
                    </div>

                    <div className="product-size">
                        Size:
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            {product.sizes.map((size, idx) => (
                                <option key={idx} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="product-quantity">
                        Quantity:
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
                                <option key={q} value={q}>
                                    {q}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="add-to-cart" onClick={handleAddToCart}>
                        Add to Cart
                    </button>

                    <div className="product-details">
                        <h3>Details:</h3>
                        <p>Brand: {product.brand}</p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <CartSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

export default ProductPage;
