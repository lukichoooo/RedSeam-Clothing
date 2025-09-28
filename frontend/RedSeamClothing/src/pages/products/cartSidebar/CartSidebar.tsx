import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Import cartService and the correct item type (CartProductResponse)
import { type CartProductResponse } from "../../../services/cart/cartApi";
import cartService from '../../../services/cart/CartService';
import "./CartSidebar.css";

import cartIcon from "../../../icons/sidebar/cart-icon.png";

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) =>
{
    const [items, setItems] = useState<CartProductResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = useCallback(async () =>
    {
        setLoading(true);
        try
        {
            const fetchedItems = await cartService.fetchCart();
            setItems(fetchedItems);
        } catch (error)
        {
            console.error("Failed to fetch cart in sidebar:", error);
            setItems([]);
        } finally
        {
            setLoading(false);
        }
    }, []);

    useEffect(() =>
    {
        if (isOpen)
        {
            fetchCart();
        }
    }, [isOpen, fetchCart]);

    // cartItemId is assumed to be the unique identifier for the specific cart line item (product + color + size)
    const handleUpdateQuantity = useCallback(async (cartItemId: number, newQuantity: number) =>
    {
        if (newQuantity < 1)
        {
            // If new quantity is < 1, delegate to remove handler
            await handleRemoveFromCart(cartItemId);
            return;
        }

        // Optimistic UI Update
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        try
        {
            await cartService.updateQuantity(cartItemId, newQuantity);
        } catch (error)
        {
            // Revert state change if API call fails
            console.error(`Failed to update quantity for cart item ${cartItemId}:`, error);
            await fetchCart(); // Re-fetch to synchronize state with server
        }
    }, [fetchCart]);

    // cartItemId is assumed to be the unique identifier for the specific cart line item
    const handleRemoveFromCart = useCallback(async (cartItemId: number) =>
    {
        // Optimistic UI Update: Remove item immediately from the state
        setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));

        try
        {
            await cartService.removeFromCart(cartItemId);
        } catch (error)
        {
            // If removal fails, re-fetch the entire cart to revert the optimistic removal
            console.error(`Failed to remove cart item ${cartItemId} from cart:`, error);
            await fetchCart(); // Re-fetch to synchronize state with server
        }
    }, [fetchCart]);


    const delivery = 10;
    // Calculation uses local state
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
    const total = subtotal + delivery;

    if (!isOpen) return null;

    if (loading && items.length === 0)
    {
        return (
            <div className={`cart-sidebar open`}>
                <div className="cart-header">
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="empty-cart">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }


    if (items.length === 0)
    {
        return (
            <div className={`cart-sidebar open`}>
                <div className="cart-header">
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="empty-cart">
                    <img src={cartIcon} alt="Empty Cart Icon" className="empty-cart-icon" />
                    <h2>Ooops!</h2>
                    <p>You've got nothing in your cart just yet...</p>
                    <button
                        className="start-shopping-btn"
                        onClick={() =>
                        {
                            navigate("/");
                            onClose();
                        }}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="cart-overlay" onClick={onClose}></div>

            <div className={`cart-sidebar open`}>
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="cart-items">
                    {items.map(item =>
                    {
                        // Assuming the API provides color and size on the CartProductResponse object
                        const itemColor = (item as any).color || 'N/A';
                        const itemSize = (item as any).size || 'N/A';

                        // Use item.id as the unique key for React rendering and for handler functions (assuming it's the unique cart item ID)
                        return (
                            <div key={item.id} className="cart-item">
                                <img src={item.cover_image} alt={item.name} className="cart-item-image" />

                                <div className="cart-item-details">
                                    <div className="cart-item-top">
                                        <div className="cart-item-info">
                                            <strong>{item.name}</strong>
                                            <div className="cart-item-meta">
                                                <span>Color: {itemColor}</span>
                                                <span>Size: {itemSize}</span>
                                            </div>
                                        </div>

                                        <div className="cart-item-price">
                                            <strong>${item.price.toFixed(2)}</strong>
                                        </div>
                                    </div>

                                    <div className="cart-item-controls">
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={loading}>+</button>
                                    </div>

                                    {/* Using item.id as the unique Cart Item ID */}
                                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)} disabled={loading}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-footer">
                    <div className="summary-row">
                        <span>Items Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery:</span>
                        <span>${delivery.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <strong>Total:</strong>
                        <strong>${total.toFixed(2)}</strong>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate("/checkout")}>Go to Checkout</button>
                </div>
            </div>
        </>
    );

};

export default CartSidebar;