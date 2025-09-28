import React, { useState } from "react";
import "./AuthPage.css";
import { Link, useNavigate } from "react-router-dom";

import passEyeIcon from "../../icons/auth/reveal-pass-img.png";
import bgImage from "../../icons/auth/auth-page-bk-image.png";

import authenticationService from "../../services/user/authenticationService";
import userService from "../../services/user/userService";

const LoginPage: React.FC = () =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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

        const newErrors: { email?: string; password?: string } = {};

        // client-side validation
        if (!/\S+@\S+\.\S+/.test(email))
        {
            newErrors.email = "Please enter a valid email.";
        }
        if (password.length < 3)
        {
            newErrors.password = "Password must be at least 3 characters.";
        }

        if (Object.keys(newErrors).length > 0)
        {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // clear old errors

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
                // invalid credentials
                setErrors({ email: "Invalid email or password.", password: "Invalid email or password." });
            } else if (err.response?.status === 422 && err.response.data?.errors)
            {
                // backend validation errors
                const apiErrors: any = {};
                for (const key in err.response.data.errors)
                {
                    apiErrors[key as "email" | "password"] = err.response.data.errors[key][0];
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
                    <h2>Log In</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className={`form-group ${errors.password ? "has-error" : ""}`}>
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
                            {errors.password && <p className="error-text">{errors.password}</p>}
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
