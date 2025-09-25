import { Link } from 'react-router-dom';
import { useTheme } from '../../services/context/ThemeContext'; // Correct import
import './Navbar.css';

export default function Navbar()
{
    const { theme, toggleTheme } = useTheme(); // Correct way to access the theme context

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <h1>RedSeam Clothing</h1>
            </Link>
            <div className="navbar-links">
                <Link to="/" className="nav-button">Home</Link>
                <Link to="/about" className="nav-button">About</Link>
                <Link to="/dashboard" className="nav-button">Dashboard</Link>
                <Link to="/login" className="nav-button login">Login</Link>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'dark' ? '🌙' : '🌞'}
                </button>
            </div>
        </nav>
    );
}