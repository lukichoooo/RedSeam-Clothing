import { Link } from 'react-router-dom';
import { useTheme } from '../../services/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { type User } from '../../services/user/user.types';
import './Navbar.css';

import loginIcon from '../../icons/navbar/login-btn.png';
import cartIcon from '../../icons/navbar/cart-icon.png';
import dropdownIcon from '../../icons/navbar/dropdown-icon.png';
import brandLogo from '../../icons/brand/redseam-logo.png';

import CartSidebar from '../../pages/products/cartSidebar/CartSidebar';

import defaultAvatar from '../../icons/navbar/default-avatar.png';
import authenticationService from '../../services/user/authenticationService';

// Assuming you have moved this helper to a utility file and are importing it
import { getAndNormalizeUser } from '../../utils/authSync';

const getUserWithAbsolutePhotoUrl = getAndNormalizeUser;

export default function Navbar()
{
    const { theme, toggleTheme } = useTheme();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [user, setUser] = useState<User | null>(() =>
    {
        return getUserWithAbsolutePhotoUrl();
    });

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!user);

    const menuRef = useRef<HTMLDivElement>(null);

    // Sync isLoggedIn state when user changes
    useEffect(() =>
    {
        setIsLoggedIn(!!user);
    }, [user]);

    // Function to re-read and update user state
    const checkAndSetUser = () =>
    {
        const currentUser = getUserWithAbsolutePhotoUrl();
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) 
        {
            setUser(currentUser);
        }
    };

    // --- EFFECT 1: AUTH SYNC (Storage, Focus, Custom Event) ---
    useEffect(() =>
    {
        const handleStorageChange = (event: StorageEvent) =>
        {
            if (event.key === 'user' || event.key === 'token')
            {
                checkAndSetUser();
            }
        };

        const handleFocusChange = () =>
        {
            checkAndSetUser();
        };

        const handleLocalAuthUpdate = () =>
        {
            checkAndSetUser();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleFocusChange);
        window.addEventListener('localAuthUpdate', handleLocalAuthUpdate);

        return () =>
        {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocusChange);
            window.removeEventListener('localAuthUpdate', handleLocalAuthUpdate);
        };
    }, [user]);

    // --- EFFECT 2: DROPDOWN CLICK-OUTSIDE FIX ---
    useEffect(() =>
    {
        if (!isDropdownOpen) return; // Only attach listener when dropdown is open

        const handleClickOutside = (event: MouseEvent) =>
        {
            // Use currentTarget for better specificity with React synthetic events, 
            // and ensure the event target is not inside the menu container.
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
            {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]); // Dependency only on open state

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const handleLogout = () =>
    {
        authenticationService.logout();
        setUser(null);
    };

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
                        <div className="user-menu-container" ref={menuRef}>
                            <img
                                src={user?.profile_photo || defaultAvatar}
                                alt={`${user?.name || 'User'} Avatar`}
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