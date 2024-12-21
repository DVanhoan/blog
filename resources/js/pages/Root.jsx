import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Home from "./Home/Home";
import Login from "./Auth/Login";
import Post from "./Home/Post";
import Profile from "./Home/Profile";
import Register from "./Auth/Register";
import SideBar from "../components/SideBar";



function Root() {
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await fetch("/api/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to fetch profile");
            }
            console.log("auth : ", res.json());
            return res.json();
        },
        retry: false,
    });


    return (
        <div className="container">
            <SideBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
                <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/post" element={<Post />} />
            </Routes>
            <Toaster />
        </div>
    )
}


export default Root
