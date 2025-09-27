import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Import cartService and the correct item type (CartProductResponse)
import { type CartProductResponse } from "../../../services/cart/cartApi";
import cartService from '../../../services/cart/CartService';
import "./CartSidebar.css";

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) =>
{
    // FIX: State type must be CartProductResponse[], as returned by fetchCart()
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


    const delivery = 10;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
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