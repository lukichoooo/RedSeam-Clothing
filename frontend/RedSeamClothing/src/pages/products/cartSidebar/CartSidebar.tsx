import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../services/context/CartContext"; // <- import hook
import "./CartSidebar.css";

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) =>
{
    const { items, updateQuantity, removeFromCart } = useCart(); // <- get cart data & handlers
    const navigate = useNavigate();

    const delivery = 10;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + delivery;

    if (items.length === 0)
    {
        return (
            <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
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
        <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
            <div className="cart-header">
                <h2>Shopping Cart</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="cart-items">
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                            <strong>{item.name}</strong> - ${item.price}
                        </div>
                        <div className="cart-item-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    </div>
                ))}
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
