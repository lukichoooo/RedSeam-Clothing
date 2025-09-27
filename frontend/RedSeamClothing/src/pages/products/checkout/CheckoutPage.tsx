import React, { useState, useEffect, useCallback } from "react";
import cartService from "../../../services/cart/CartService";
import { type CartProductResponse } from "../../../services/cart/cartApi";
import emailIcon from "../../../icons/auth/email-icon.png";
import "./CheckoutPage.css";

const CheckoutPage: React.FC = () =>
{
    // Local state for cart items and loading status
    const [items, setItems] = useState<CartProductResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // State for form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");

    const fetchCart = useCallback(async () =>
    {
        setLoading(true);
        try
        {
            const fetchedItems = await cartService.fetchCart();
            setItems(fetchedItems);
        } catch (error)
        {
            console.error("Failed to fetch cart on checkout page:", error);
            setItems([]);
        } finally
        {
            setLoading(false);
        }
    }, []);

    const handleUpdateQuantity = useCallback(async (id: number, newQuantity: number) =>
    {
        if (newQuantity < 1)
        {
            await handleRemoveFromCart(id);
            return;
        }

        try
        {
            await cartService.updateQuantity(id, newQuantity);
            await fetchCart();
        } catch (error)
        {
            console.error(`Failed to update quantity for product ${id}:`, error);
        }
    }, [fetchCart]);

    const handleRemoveFromCart = useCallback(async (id: number) =>
    {
        try
        {
            await cartService.removeFromCart(id);
            await fetchCart();
        } catch (error)
        {
            console.error(`Failed to remove product ${id} from cart:`, error);
        }
    }, [fetchCart]);

    // Load cart on component mount
    useEffect(() =>
    {
        fetchCart();
    }, [fetchCart]);

    const delivery = 10;
    // Calculation uses CartProductResponse fields
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + delivery;

    if (loading)
    {
        return <div className="checkout-page-loading">Loading cart...</div>;
    }

    if (items.length === 0)
    {
        return (
            <div className="checkout-page">
                <div className="checkout-left">
                    <h1>Checkout</h1>
                </div>
                <div className="checkout-right">
                    <div className="empty-cart">Your cart is empty.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {/* Left: Billing/Shipping Form */}
            <div className="checkout-left">
                <h1>Checkout</h1>
                <div className="order-details">
                    <input
                        type="text"
                        placeholder="Name Surname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="checkout-input"
                    />

                    <div className="input-with-icon">
                        <img src={emailIcon} alt="Email" className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="checkout-input icon-input"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="checkout-input"
                    />

                    <input
                        type="text"
                        placeholder="ZIP Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="checkout-input"
                    />
                </div>
            </div>

            {/* Right: Cart Summary and Items */}
            <div className="checkout-right">
                {items.map((item) => (
                    // Note: The CartProductResponse type likely doesn't include 'image', 'color', or 'size' for the cart item, 
                    // but the original JSX structure is preserved using item properties available on the API response.
                    <div key={item.id} className="checkout-item">
                        <img src={(item as any).image || item.cover_image} alt={item.name} />
                        <div className="checkout-item-info">
                            <strong>{item.name}</strong>
                            <p className="checkout-item-price">${item.price}</p>
                            {/* Assuming color/size are available on the CartProductResponse or added via type assertion */}
                            <p>Color: {(item as any).color || 'N/A'}</p>
                            <p>Size: {(item as any).size || 'N/A'}</p>
                            <div className="checkout-item-controls">
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Summary */}
                <div className="checkout-summary">
                    <div className="summary-row">
                        <span>Items Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery:</span>
                        <span>${delivery.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-pay-btn">Pay</button>
                </div>
            </div>
        </div>

    );
};

export default CheckoutPage;