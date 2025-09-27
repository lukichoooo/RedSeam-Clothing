import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Import cartService and the correct item type (CartProductResponse)
import { type CartProductResponse } from "../../../services/cart/cartApi";
import cartService from '../../../services/cart/CartService';
import "./CartSidebar.css";

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

    const handleUpdateQuantity = useCallback(async (id: number, newQuantity: number) =>
    {
        if (newQuantity < 1)
        {
            // If new quantity is < 1, delegate to remove handler
            await handleRemoveFromCart(id);
            return;
        }

        // Optimistic UI Update (for a quicker feel)
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );

        try
        {
            // Update the quantity on the backend
            await cartService.updateQuantity(id, newQuantity);

            // NOTE: If your backend calculates and returns a new total_price or subtotal 
            // and you need that reflected, you should uncomment the line below:
            // await fetchCart(); 

        } catch (error)
        {
            // Revert state change and show error if API call fails
            console.error(`Failed to update quantity for product ${id}:`, error);
            await fetchCart(); // Re-fetch to synchronize state with server
        }
    }, []); // Removed fetchCart from dependencies to prevent unnecessary full fetches

    const handleRemoveFromCart = useCallback(async (id: number) =>
    {
        // Optimistic UI Update: Remove item immediately from the state
        setItems(prevItems => prevItems.filter(item => item.id !== id));

        try
        {
            // Call the remove API
            await cartService.removeFromCart(id);
        } catch (error)
        {
            // If removal fails, re-fetch the entire cart to revert the optimistic removal
            console.error(`Failed to remove product ${id} from cart:`, error);
            await fetchCart(); // Re-fetch to synchronize state with server
        }
    }, []);


    const delivery = 10;
    // Calculation uses local state
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + delivery;

    if (!isOpen) return null;

    // ... (rest of the component logic remains the same for loading/empty state) ...

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
        <div className={`cart-sidebar open`}>
            <div className="cart-header">
                <h2>Shopping Cart</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="cart-items">
                {items.map(item =>
                {
                    const itemColor = (item as any).color || 'NoColor';
                    const itemSize = (item as any).size || 'NoSize';

                    // Using item.id is typically sufficient for cart actions, but the variant key is kept for UI rendering.
                    const uniqueKey = `${item.id}-${itemColor}-${itemSize}`;

                    return (
                        <div key={uniqueKey} className="cart-item">
                            <div className="cart-item-info">
                                <strong>{item.name}</strong> - ${item.price}
                            </div>
                            <div className="cart-item-controls">
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={loading}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={loading}>+</button>
                                <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)} disabled={loading}>Remove</button>
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
    );
};

export default CartSidebar;