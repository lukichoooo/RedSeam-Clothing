import React, { useState, useEffect, useCallback } from "react";
import cartService from "../../../services/cart/CartService";
import { type CartProductResponse } from "../../../services/cart/cartApi";
import emailIcon from "../../../icons/auth/email-icon.png";
import "./CheckoutPage.css";
import { useNavigate } from 'react-router-dom';
import { type CheckoutDetails } from "../../../services/cart/cartApi";

type CartItemWithVariant = CartProductResponse & {
    size: string;
    color: string;
};


interface CheckoutPopupProps
{
    onClose: () => void;
}

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ onClose }) =>
{
    const navigate = useNavigate();

    const handleContinueShopping = () =>
    {
        onClose();
        navigate('/');
    };

    return (
        <div className="checkout-popup-overlay">
            <div className="checkout-popup-content">
                <button className="popup-close-btn" onClick={onClose}>
                    X
                </button>
                <div className="popup-icon">
                    <span role="img" aria-label="Success checkmark" style={{ fontSize: '48px', color: 'green' }}>
                        ✔
                    </span>
                </div>
                <h2>Congrats!</h2>
                <p>Your order is placed successfully!</p>
                <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                    Continue shopping
                </button>
            </div>
        </div>
    );
};

const CheckoutPage: React.FC = () =>
{
    const [items, setItems] = useState<CartItemWithVariant[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setFirstName] = useState("");
    const [surname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [zip_code, setZip_code] = useState("");

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<{ success: boolean; message: string } | null>(null);
    const [showPopup, setShowPopup] = useState(false);


    const fetchCart = useCallback(async () =>
    {
        setLoading(true);
        try
        {
            const fetchedItems = await cartService.fetchCart() as CartItemWithVariant[];
            setItems(fetchedItems);
        } catch (error: any) 
        {
            let errorMessage = "Checkout failed. Please try again.";

            if (error.response && error.response.data && error.response.data.message)
            {
                errorMessage = error.response.data.message;
            }
            return { success: false, message: errorMessage };
        } finally
        {
            setLoading(false);
        }
    }, []);

    const handleRemoveFromCart = useCallback(
        async (id: number, color: string, size: string) =>
        {
            setCheckoutMessage(null);
            try
            {
                await cartService.removeFromCart(id, color, size);
                await fetchCart();
            } catch (error)
            {
                console.error(`Failed to remove product ${id} from cart:`, error);
            }
        },
        [fetchCart]
    );

    const handleUpdateQuantity = useCallback(
        async (id: number, newQuantity: number, color: string, size: string) =>
        {
            setCheckoutMessage(null);
            if (newQuantity < 1)
            {
                await handleRemoveFromCart(id, color, size);
                return;
            }

            try
            {
                await cartService.updateQuantity(id, newQuantity, color, size);
                await fetchCart();
            } catch (error)
            {
                console.error(`Failed to update quantity for product ${id}:`, error);
            }
        },
        [fetchCart, handleRemoveFromCart]
    );

    const handleCheckout = useCallback(async () =>
    {
        setCheckoutMessage(null);

        const checkoutDetails: CheckoutDetails = {
            name: name,
            surname: surname,
            email: email,
            address: address,
            zip_code: zip_code
        };

        // Client-side validation: Check for empty form fields
        if (!name || !surname || !email || !address || !zip_code)
        {
            setCheckoutMessage({ success: false, message: "Please fill in all billing and shipping details." });
            return;
        }

        // Client-side validation: Check for empty cart
        if (items.length === 0)
        {
            setCheckoutMessage({ success: false, message: "Your cart is empty. Please add items before checking out." });
            return;
        }

        setIsCheckingOut(true);
        try
        {
            const result = await cartService.checkout(checkoutDetails);

            if (result.success)
            {
                setCheckoutMessage(result);
                setItems([]);
                setShowPopup(true);
            } else
            {
                setCheckoutMessage(result);
            }
        } catch (error)
        {
            console.error("Checkout process failed:", error);
            setCheckoutMessage({ success: false, message: "An unexpected error occurred during checkout." });
        } finally
        {
            setIsCheckingOut(false);
        }
    }, [name, surname, email, address, zip_code, items.length,]);

    useEffect(() =>
    {
        fetchCart();
    }, [fetchCart]);

    const delivery = 10;
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
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
                    {checkoutMessage?.success ? (
                        <div className="checkout-message success" style={{ padding: '15px', color: 'green', fontWeight: 'bold' }}>
                            {checkoutMessage.message}
                        </div>
                    ) : (
                        <div className="empty-cart">Your cart is empty.</div>
                    )}
                </div>
                {showPopup && <CheckoutPopup onClose={() => setShowPopup(false)} />}
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-left">
                <h1>Checkout</h1>
                <div className="order-details">
                    <div className="input-group-row">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={name}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="checkout-input"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={surname}
                            onChange={(e) => setLastName(e.target.value)}
                            className="checkout-input"
                        />
                    </div>
                    <div className="input-group-row">
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
                    </div>
                    <div className="input-group-row">
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
                            value={zip_code}
                            onChange={(e) => setZip_code(e.target.value)}
                            className="checkout-input"
                        />
                    </div>
                </div>
            </div>

            <div className="checkout-right">
                {items.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <img
                            src={(item as any).image || item.cover_image}
                            alt={item.name}
                        />
                        <div className="checkout-item-info">
                            <strong>
                                {item.name}
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveFromCart(item.id, item.color, item.size)}
                                >
                                    Remove
                                </button>
                            </strong>
                            <div className="checkout-item-details">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                                <span>Price: ${item.price.toFixed(2)}</span>
                            </div>
                            <div className="checkout-item-controls">
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(item.id, item.quantity - 1, item.color, item.size)
                                    }
                                >
                                    –
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(item.id, item.quantity + 1, item.color, item.size)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="checkout-summary">
                    {checkoutMessage && (
                        <div
                            className={`checkout-message ${checkoutMessage.success ? 'success' : 'error'}`}
                            style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', color: checkoutMessage.success ? '#006400' : '#8B0000', border: `1px solid ${checkoutMessage.success ? '#006400' : '#8B0000'}`, backgroundColor: checkoutMessage.success ? '#e6ffe6' : '#ffe6e6' }}
                        >
                            {checkoutMessage.message}
                        </div>
                    )}
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
                    <button
                        className="checkout-pay-btn"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || items.length === 0}
                    >
                        {isCheckingOut ? "Processing..." : "Pay"}
                    </button>
                </div>
            </div>

            {showPopup && <CheckoutPopup onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default CheckoutPage;