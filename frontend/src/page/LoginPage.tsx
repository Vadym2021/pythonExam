import React from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { LoginFormData } from "../interfaces/user.interface";

const LoginPage = () => {
    const { handleSubmit, register } = useForm<LoginFormData>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginFormData> = async (user) => {
        try {
            const { access, refresh, id } = await authService.login(user);


            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);


            navigate(`/user/${id}`);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Email" {...register('email')} />
            <input type="password" placeholder="Password" {...register('password')} />
            <button>Login</button>
        </form>
    );
};

export { LoginPage };
