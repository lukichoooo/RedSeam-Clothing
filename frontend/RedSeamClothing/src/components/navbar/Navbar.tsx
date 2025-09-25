import { Link } from 'react-router-dom';
import { useTheme } from '../../services/context/ThemeContext';
import './Navbar.css';

import loginIcon from '../../icons/auth/login-btn.png';
import brandLogo from '../../icons/brand/redseam-logo.png';

export default function Navbar()
{
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={brandLogo} alt="RedSeam Clothing Logo" />
                <span className="logo-text-hidden" />
            </Link>
            <div className="navbar-links">
                <Link to="/login" className="nav-button login">
                    <img src={loginIcon} alt="Login" style={{ width: '64px', height: '20px' }} />
                </Link>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'dark' ? '🌙' : '🌞'}
                </button>
            </div>
        </nav>
    );
}