import React, { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () =>
    {
        setShowPassword(!showPassword);
    };

    return (
        <div className="page-container">
            <div className="image-section">
                <div className="page-image">
                    {/* TODO: Add image here */}
                </div>
            </div>
            <div className="form-section">
                <div className="form-content">
                    <h2>Log In</h2>
                    <form className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" />
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <span
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="auth-button">
                            Log In
                        </button>
                        <div className="register-link">
                            Not a member? <Link to="/register">Register now</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
