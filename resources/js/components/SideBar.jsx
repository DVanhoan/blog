import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Đăng xuất thất bại!");
            }

            return response.json();
        },
        onSuccess: () => {
            logout();
            navigate("/login");
            toast.success("Đăng xuất thành công!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        setIsCollapsed(false);
    }, [location]);

    return (
        <nav className="navbar navbar-expand-md navbar-white bg-white sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/images/favicon.png"
                        alt="Logo"
                        style={{ height: "40px", marginRight: "10px" }}
                    />
                    <span>myBlog</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleToggle}
                    aria-controls="navbarNav"
                    aria-expanded={isCollapsed ? "true" : "false"}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isCollapsed ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        id="userDropdown"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        Duong Van Hoan
                                    </Link>
                                    <div
                                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown"
                                    >
                                        <Link className="dropdown-item" to="/dashboard">
                                            Quản lý
                                        </Link>
                                        <Link className="dropdown-item" to="/profile">
                                            Trang cá nhân
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                mutation.mutate();
                                                setIsCollapsed(false);
                                            }}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default SideBar;
