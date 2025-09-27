import React, { useState } from "react";
import "./AuthPage.css";
import { Link, useNavigate } from "react-router-dom";

import passEyeIcon from "../../icons/auth/reveal-pass-img.png";
import bgImage from "../../icons/auth/auth-page-bk-image.png";

import authenticationService from "../../services/user/authenticationService";
import userService from '../../services/user/userService';

const LoginPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () =>
    {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        const form = e.currentTarget;
        const email = (form.email as HTMLInputElement).value.trim();
        const password = (form.password as HTMLInputElement).value;

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

        try
        {
            const res = await authenticationService.login({ email, password });

            localStorage.setItem("token", res.token);
            userService.setUserToLocalStorage(res.user);
            navigate("/");

        } catch (err: any)
        {
            if (err.response?.status === 401)
            {
                alert("Invalid email or password.");
            } else if (err.response?.status === 422)
            {
                alert("Validation error. Please check your inputs.");
            } else
            {
                alert("Something went wrong. Please try again later.");
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
                    <h2>Log In</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" required />
                        </div>
                        <div className="form-group">
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    <img src={passEyeIcon} style={{ scale: "0.5" }} />
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="auth-button">Log In</button>
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
