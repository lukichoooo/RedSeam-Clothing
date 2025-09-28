import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { type CartProductResponse } from "../../../services/cart/cartApi";
import cartService from '../../../services/cart/CartService';
import "./CartSidebar.css";

import cartIcon from "../../../icons/sidebar/cart-icon.png";

type CartItemWithDetails = CartProductResponse & {
    color: string;
    size: string;
};

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) =>
{
    const [items, setItems] = useState<CartItemWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = useCallback(async () =>
    {
        setLoading(true);
        try
        {
            const fetchedItems = await cartService.fetchCart() as CartItemWithDetails[];
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

    const getUniqueLineItemId = (item: CartItemWithDetails): string =>
    {
        return `${item.id}-${item.color}-${item.size}`;
    };

    const handleUpdateQuantity = useCallback(async (productId: number, uniqueId: string, color: string, size: string, newQuantity: number) =>
    {
        if (newQuantity < 1)
        {
            await handleRemoveFromCart(productId, uniqueId, color, size);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
            {
                const currentUniqueId = getUniqueLineItemId(item);
                if (currentUniqueId === uniqueId)
                {
                    const newTotalPrice = item.price * newQuantity;
                    return { ...item, quantity: newQuantity, total_price: newTotalPrice };
                }
                return item;
            })
        );

        try
        {
            await cartService.updateQuantity(productId, newQuantity, color, size);
        } catch (error)
        {
            console.error(`Failed to update quantity for cart item with Product ID ${productId}:`, error);
            await fetchCart();
        }
    }, [fetchCart]);

    const handleRemoveFromCart = useCallback(async (productId: number, uniqueId: string, color: string, size: string) =>
    {
        setItems(prevItems =>
            prevItems.filter(item => getUniqueLineItemId(item) !== uniqueId)
        );

        try
        {
            await cartService.removeFromCart(productId, color, size);
        } catch (error)
        {
            console.error(`Failed to remove cart item with Product ID ${productId} from cart:`, error);
            await fetchCart();
        }
    }, [fetchCart]);


    const delivery = 10;
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
                        const uniqueId = getUniqueLineItemId(item);
                        const itemColor = item.color;
                        const itemSize = item.size;
                        const productId = item.id;

                        return (
                            <div key={uniqueId} className="cart-item">
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
                                        <button onClick={() => handleUpdateQuantity(productId, uniqueId, itemColor, itemSize, item.quantity - 1)} disabled={loading || item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(productId, uniqueId, itemColor, itemSize, item.quantity + 1)} disabled={loading}>+</button>
                                    </div>

                                    <button className="remove-btn" onClick={() => handleRemoveFromCart(productId, uniqueId, itemColor, itemSize)} disabled={loading}>
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
