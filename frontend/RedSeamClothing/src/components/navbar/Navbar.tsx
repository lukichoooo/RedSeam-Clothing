import { Link } from 'react-router-dom';
import { useTheme } from '../../services/context/ThemeContext';
import { useState, useEffect } from 'react';
import { type User } from '../../services/user/user.types';
import './Navbar.css';

import loginIcon from '../../icons/navbar/login-btn.png';
import cartIcon from '../../icons/navbar/cart-icon.png';
import dropdownIcon from '../../icons/navbar/dropdown-icon.png';
import brandLogo from '../../icons/brand/redseam-logo.png';

import CartSidebar from '../../pages/products/cartSidebar/CartSidebar';

import defaultAvatar from '../../icons/navbar/default-avatar.png';
import userService from '../../services/user/userService';
import authenticationService from '../../services/user/authenticationService';

export default function Navbar()
{
    const { theme, toggleTheme } = useTheme();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() =>
    {

        setUser(userService.getUserFromLocalStorage());
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const handleLogout = () =>
    {
        authenticationService.logout();
        window.location.reload();
    };

    const isLoggedIn = !!user;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo" aria-label="Home">
                <img src={brandLogo} alt="RedSeam Clothing Logo" />
            </Link>
            <div className="navbar-links">
                {isLoggedIn ? (
                    <>
                        <img
                            onClick={openCart}
                            src={cartIcon}
                            alt="Shopping Cart"
                            className="cart-icon"
                        />
                        <div className="user-menu-container">
                            <img
                                src={user!.profile_photo || defaultAvatar}
                                alt={`${user!.name || 'User'} Avatar`}
                                className="user-avatar"
                                onClick={() => setIsDropdownOpen(c => !c)}
                            />
                            <img
                                onClick={() => setIsDropdownOpen(c => !c)}
                                src={dropdownIcon}
                                alt="Toggle Dropdown"
                                className="dropdown-icon"
                            />
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout} className="logout-button">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
                    </>
                ) : (
                    <Link to="/login" className="nav-button login">
                        <img src={loginIcon} alt="Login" className="login-icon" />
                    </Link>
                )}
                <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    {theme === 'dark' ? '🌙' : '🌞'}
                </button>
            </div>
        </nav>
    );
}