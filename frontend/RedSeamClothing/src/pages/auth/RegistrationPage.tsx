import React, { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router-dom';

import passEyeIcon from '../../icons/auth/reveal-pass-img.png';

const RegistrationPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const togglePasswordVisibility = () =>
    {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () =>
    {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file)
        {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = () =>
    {
        setProfileImage(null);
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
                        <div className="profile-image-section">
                            <div className="profile-image-container">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="profile-image-preview" />
                                ) : (
                                    <div className="profile-image-placeholder"></div>
                                )}
                            </div>
                            <div className="profile-image-buttons">
                                <label htmlFor="profile-upload" className="profile-upload-btn">
                                    Upload new
                                </label>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <span onClick={handleImageRemove} className="profile-remove-btn">
                                    Remove
                                </span>
                            </div>
                        </div>
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
                                    <img
                                        src={showPassword ? passEyeIcon : passEyeIcon}
                                        style={{ scale: '0.5' }}
                                    />
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