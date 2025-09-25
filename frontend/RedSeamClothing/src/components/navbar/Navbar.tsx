import { Link } from 'react-router-dom';
import { useTheme } from '../../services/context/ThemeContext';
import './Navbar.css';

import loginIcon from '../../icons/auth/login-btn.png'; // Assuming you have a login icon at this path

export default function Navbar()
{
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <h1>RedSeam Clothing</h1>
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