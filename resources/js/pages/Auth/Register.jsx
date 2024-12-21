import React from 'react';
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Đăng ký thất bại!");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Đăng ký thành công!");
            navigate('/login');
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

    return (
        <div className="container mt-5" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2 className="text-center mb-4">Đăng ký tài khoản mới</h2>
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
                    <label htmlFor="fullName" className="form-label">Họ và Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Họ và tên"
                        {...register('name', { required: 'Họ và Tên là bắt buộc!' })}
                    />
                    {errors.fullName && <p className="text-danger">{errors.fullName.message}</p>}
                </div>


                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật khẩu"
                        {...register('password', {
                            required: 'Mật khẩu là bắt buộc!',
                            minLength: {
                                value: 6,
                                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                            },
                        })}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>


                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password_confirmation"
                        placeholder="Xác nhận mật khẩu"
                        {...register('password_confirmation', {
                            required: 'Xác nhận mật khẩu là bắt buộc!',
                            validate: (value) => value === password || 'Mật khẩu xác nhận không khớp!',
                        })}
                    />
                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                </div>


                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: '#6c63ff' }}
                >
                    {mutation.isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>


            <p className="text-center mt-3">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-decoration-none text-primary">Đăng nhập</Link>
            </p>
        </div>
    );
};

export default Register;
