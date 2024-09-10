import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IUserCreate } from "../interfaces/user.interface";
import { userService } from '../services/userService';
import { AxiosError } from 'axios';
import css from './UserPage.module.css';

const UserPage = () => {
    const { register, handleSubmit } = useForm<IUserCreate>();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<'user' | 'admin' | 'superuser'>('user');
    const [error, setErrorState] = useState<any>(null);

    const onSubmit = async (data: IUserCreate) => {
        let token: string | null = null;

        try {
            token = localStorage.getItem('access');
            localStorage.removeItem('access');

            let response;
            switch (userRole) {
                case 'admin':
                    response = await userService.createAdmin(data);
                    break;
                case 'superuser':
                    response = await userService.createSuperuser(data);
                    break;
                default:
                    response = await userService.createUser(data);
            }
            console.log('Ответ от сервера:', response.data);
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            const axiosError = error as AxiosError;
            setErrorState(axiosError.response?.data || axiosError.message || 'Неизвестная ошибка');
        } finally {
            if (token) {
                localStorage.setItem('access', token);
            }
        }
    };

    const handleLogin = () => {
        navigate('/auth');
    };

    const renderErrors = (errors: any) => {
        if (errors) {
            return Object.keys(errors).map((key) => {
                const messages = errors[key];
                if (typeof messages === 'object' && !Array.isArray(messages)) {
                    return (
                        <div key={key} className={css.error}>
                            <strong>{key}:</strong>
                            <div>{renderErrors(messages)}</div>
                        </div>
                    );
                } else if (Array.isArray(messages)) {
                    return (
                        <div key={key} className={css.error}>
                            <strong>{key}:</strong>
                            <ul>
                                {messages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    );
                } else if (typeof messages === 'string') {
                    return (
                        <div key={key} className={css.error}>
                            <strong>{key}:</strong>
                            <ul>
                                <li>{messages}</li>
                            </ul>
                        </div>
                    );
                } else {
                    return (
                        <div key={key} className={css.error}>
                            <strong>{key}:</strong>
                            <ul>
                                <li>Неизвестный формат ошибки</li>
                            </ul>
                        </div>
                    );
                }
            });
        }
        return null;
    };

    return (

    <div className={css.container}>
        <div className={css.loginButtonWrapper}>
            <button type="button" onClick={handleLogin} className={css.loginButton}>Залогиниться</button>
        </div>
        <h1>Создание пользователя</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={css.formGroup}>
                <label className={css.label}>Email:</label>
                <input type="email" className={css.input} {...register('email', {required: true})} />
            </div>

            <div className={css.formGroup}>
                <label className={css.label}>Пароль:</label>
                <input type="password" className={css.input} {...register('password', {required: true})} />
            </div>

            <div className={css.formGroup}>
                <label className={css.label}>Тип аккаунта:</label>
                <select className={css.select} {...register('account_type', {required: true})}>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                </select>
            </div>

            <div className={css.formGroup}>
                <label className={css.label}>Тип пользователя:</label>
                <select className={css.select} value={userRole}
                        onChange={(e) => setUserRole(e.target.value as 'user' | 'admin' | 'superuser')}>
                    <option value="user">Обычный пользователь</option>
                    <option value="admin">Администратор</option>
                    <option value="superuser">Суперпользователь</option>
                </select>
            </div>

            <h2>Профиль</h2>
            <div className={css.formGroup}>
                <label className={css.label}>Имя:</label>
                <input type="text" className={css.input} {...register('profile.name', {required: true})} />
            </div>

            <div className={css.formGroup}>
                <label className={css.label}>Фамилия:</label>
                <input type="text" className={css.input} {...register('profile.surname', {required: true})} />
            </div>

            <div className={css.formGroup}>
                <label className={css.label}>Возраст:</label>
                <input type="number" className={css.input} {...register('profile.age', {required: true, min: 1})} />
            </div>

            <div className={css.buttons}>
                <button type="submit" className={css.submitButton}>Создать пользователя</button>

            </div>
        </form>


        {renderErrors(error)}
    </div>

)
    ;
};

export {UserPage};
