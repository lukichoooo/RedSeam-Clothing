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
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!validTypes.includes(file.type))
            {
                alert('Only JPG, PNG, and WEBP images are allowed.');
                return;
            }
            if (file.size > maxSize)
            {
                alert('File size must be under 2MB.');
                return;
            }

            setProfileImage(URL.createObjectURL(file));
        }
    };


    const handleImageRemove = () =>
    {
        setProfileImage(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        const form = e.currentTarget;
        const username = (form.username as HTMLInputElement).value.trim();
        const email = (form.email as HTMLInputElement).value.trim();
        const password = (form.password as HTMLInputElement).value;
        const confirmPassword = (form["confirm-password"] as HTMLInputElement).value;

        // ✅ Validation
        if (username.length < 3)
        {
            alert("Username must be at least 3 characters.");
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

        if (password !== confirmPassword)
        {
            alert("Passwords do not match.");
            return;
        }

        // Prepare form data (works with or without avatar)
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        if (form.profileUpload?.files?.[0])
        {
            formData.append("avatar", form.profileUpload.files[0]);
        }

        // TODO: Send formData to backend via fetch/axios
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
                    <form className="registration-form" onSubmit={handleSubmit}>
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