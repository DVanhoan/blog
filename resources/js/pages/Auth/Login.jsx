import React from 'react';
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { login } = useAuth();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Đăng nhập thất bại!");
            }

            return res.json();
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            login();
            toast.success("Đăng nhập thành công!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const onSubmit = (data) => {
        if (!mutation.isLoading) {
            mutation.mutate(data);
        }
    };


    const LoginGoogle = async () => {
        const res = await fetch("/api/login/google", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Đăng nhập thất bại!");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        login();
        toast.success("Đăng nhập thành công!");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/");
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2 className="text-center mb-4">Đăng nhập vào tài khoản của bạn</h2>
            <form onSubmit={handleSubmit(onSubmit)}>


                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Địa chỉ email"
                        {...register('email', {
                            required: 'Email là bắt buộc!',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'Email không hợp lệ!',
                            },
                        })}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>


                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật khẩu"
                        {...register('password', { required: 'Mật khẩu là bắt buộc!' })}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>


                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            {...register('remember')}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                    </div>
                    <a href="#" className="text-decoration-none text-primary">Quên mật khẩu?</a>
                </div>


                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: '#6c63ff' }}
                >
                    {mutation.isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>

            <div className="oauth mt-3">
                <div className="d-flex justify-content-center align-items-center gap-3">
                    <Link onClick={LoginGoogle} className="btn btn-light border d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <img src="https://cuoiky-dvh.onrender.com/images/google.png" alt="Google Login" style={{ width: '30px', height: '30px' }} />
                    </Link>
                    <Link to="/login/github" className="btn btn-light border d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <img src="https://cuoiky-dvh.onrender.com/images/github.png" alt="Github Login" style={{ width: '30px', height: '30px' }} />
                    </Link>
                </div>
            </div>



            <p className="text-center mt-3">
                Bạn chưa có tài khoản?{' '}
                <Link to="/register" className="text-decoration-none text-primary">Đăng ký ngay</Link>
            </p>
        </div>
    );
};

export default Login;
