import React, { useState } from "react";
import { useCart } from "../../../services/context/CartContext";
import emailIcon from "../../../icons/auth/email-icon.png";
import "./CheckoutPage.css";

const CheckoutPage: React.FC = () =>
{
    const { items, updateQuantity, removeFromCart } = useCart();
    const delivery = 10;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + delivery;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");

    return (
        <div className="checkout-page">
            {/* Left */}
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

            {/* Right */}
            <div className="checkout-right">
                {items.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <img src={item.image} alt={item.name} />
                        <div className="checkout-item-info">
                            <strong>{item.name}</strong>
                            <p className="checkout-item-price">${item.price}</p>
                            <p>Color: {item.color}</p>
                            <p>Size: {item.size}</p>
                            <div className="checkout-item-controls">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
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
