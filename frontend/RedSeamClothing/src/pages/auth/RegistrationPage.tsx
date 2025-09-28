import React, { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router-dom';

import passEyeIcon from '../../icons/auth/reveal-pass-img.png';
import bgImage from '../../icons/auth/auth-page-bk-image.png';
import authenticationService from "../../services/user/authenticationService";
import userService from "../../services/user/userService";

const RegistrationPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        avatar?: string;
    }>({});


    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file)
        {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            const maxSize = 2 * 1024 * 1024;

            if (!validTypes.includes(file.type))
            {
                setErrors({ avatar: 'Only JPG, PNG, and WEBP images are allowed.' });
                return;
            }
            if (file.size > maxSize)
            {
                setErrors({ avatar: 'File size must be under 2MB.' });
                return;
            }

            setAvatarFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, avatar: undefined }));
        }
    };

    const handleImageRemove = () =>
    {
        setAvatarFile(null);
        setProfileImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        const form = e.currentTarget;
        const username = (form.username as HTMLInputElement).value.trim();
        const email = (form.email as HTMLInputElement).value.trim();
        const password = (form.password as HTMLInputElement).value;
        const confirmPassword = (form['confirm-password'] as HTMLInputElement).value;

        const newErrors: typeof errors = {};

        if (!username) newErrors.username = "Username is required.";
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email.";
        if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        if (Object.keys(newErrors).length > 0)
        {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // clear errors

        try
        {
            const res = await authenticationService.register({
                username,
                email,
                password,
                password_confirmation: confirmPassword,
                avatar: avatarFile,
            });

            localStorage.setItem("token", res.token);
            userService.setUserToLocalStorage(res.user);
            window.location.href = "/";
        } catch (err: any)
        {
            if (err.response?.status === 422 && err.response.data?.errors)
            {
                const apiErrors: any = {};
                for (const key in err.response.data.errors)
                {
                    apiErrors[key as keyof typeof errors] = err.response.data.errors[key][0];
                }
                setErrors(apiErrors);
            } else
            {
                setErrors({ email: "Something went wrong. Please try again later." });
            }
        }
    };

    return (
        <div className="page-container">
            <div className="image-section">
                <div
                    className="page-image"
                    style={{ backgroundImage: `url(${bgImage})` }}
                ></div>
            </div>
            <div className="form-section">
                <div className="form-content">
                    <h2>Registration</h2>
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="profile-image-section">
                            <div className="profile-image-container">
                                {profileImagePreview ? (
                                    <img src={profileImagePreview} alt="Profile" className="profile-image-preview" />
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
                                    name="profileUpload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <span onClick={handleImageRemove} className="profile-remove-btn">
                                    Remove
                                </span>
                            </div>
                            {errors.avatar && <p className="error-text">{errors.avatar}</p>}
                        </div>

                        <div className={`form-group ${errors.username ? "has-error" : ""}`}>
                            <input type="text" id="username" name="username" placeholder="Username" required />
                            {errors.username && <p className="error-text">{errors.username}</p>}
                        </div>

                        <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                            <input type="email" id="email" name="email" placeholder="Email" required />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className={`form-group ${errors.password ? "has-error" : ""}`}>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    <img src={passEyeIcon} style={{ scale: '0.5' }} />
                                </span>
                            </div>
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirm-password"
                                    placeholder="Confirm password"
                                    required
                                />
                                <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                    <img src={passEyeIcon} style={{ scale: '0.5' }} />
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="auth-button">Register</button>
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
