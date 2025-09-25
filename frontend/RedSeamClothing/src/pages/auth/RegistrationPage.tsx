import React, { useState } from 'react';
import './AuthPage.css'; // This is your new combined CSS file
import { Link } from 'react-router-dom';

const RegistrationPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () =>
    {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () =>
    {
        setShowConfirmPassword(!showConfirmPassword);
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
                    <h2>Registration</h2>
                    <form className="registration-form">
                        <div className="form-group">
                            <label htmlFor="username" />
                            <input type="text" id="username" name="username" placeholder="Username" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" />
                            <input type="email" id="email" name="email" placeholder="Email" required />
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
                        <div className="form-group">
                            <label htmlFor="confirm-password" />
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirm-password"
                                    placeholder="Confirm password"
                                    required
                                />
                                <span
                                    className="password-toggle"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="auth-button" >
                            Register
                        </button>
                        <div className="login-link">
                            Already a member? <Link to="/login">Log in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;