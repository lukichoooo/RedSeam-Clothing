import React, { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router-dom';

import passEyeIcon from '../../icons/auth/reveal-pass-img.png';
import bgImage from '../../icons/auth/auth-page-bk-image.png';

const LoginPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () =>
    {
        setShowPassword(!showPassword);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault(); // prevent page refresh

        const form = e.currentTarget;
        const email = (form.email as HTMLInputElement).value.trim();
        const password = (form.password as HTMLInputElement).value;

        // ✅ Validation
        if (email.length < 3)
        {
            alert("Email must be at least 3 characters.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email))
        {
            alert("Please enter a valid email.");
            return;
        }

        if (password.length < 3)
        {
            alert("Password must be at least 3 characters.");
            return;
        }

        // TODO: send to backend
    };

    return (
        <div className="page-container">
            <div className="image-section">
                <div className="page-image">
                    <div
                        className="page-image"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    ></div>
                </div>
            </div>
            <div className="form-section">
                <div className="form-content">
                    <h2>Log In</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
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
                                    <img
                                        src={showPassword ? passEyeIcon : passEyeIcon}
                                        style={{ scale: '0.5' }}
                                    />
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
