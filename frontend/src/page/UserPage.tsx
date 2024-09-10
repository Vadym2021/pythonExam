import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IUserCreate } from "../interfaces/user.interface";
import { userService } from '../services/userService';
import { AxiosError } from 'axios';

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
                        <div key={key} style={{ color: 'red' }}>
                            <strong>{key}:</strong>
                            <div>{renderErrors(messages)}</div>
                        </div>
                    );
                } else if (Array.isArray(messages)) {
                    return (
                        <div key={key} style={{ color: 'red' }}>
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
                        <div key={key} style={{ color: 'red' }}>
                            <strong>{key}:</strong>
                            <ul>
                                <li>{messages}</li>
                            </ul>
                        </div>
                    );
                } else {
                    return (
                        <div key={key} style={{ color: 'red' }}>
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
        <div>
            <h1>Создание пользователя</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register('email', { required: true })} />
                </div>

                <div>
                    <label>Пароль:</label>
                    <input type="password" {...register('password', { required: true })} />
                </div>

                <div>
                    <label>Тип аккаунта:</label>
                    <select {...register('account_type', { required: true })}>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>

                <div>
                    <label>Тип пользователя:</label>
                    <select value={userRole} onChange={(e) => setUserRole(e.target.value as 'user' | 'admin' | 'superuser')}>
                        <option value="user">Обычный пользователь</option>
                        <option value="admin">Администратор</option>
                        <option value="superuser">Суперпользователь</option>
                    </select>
                </div>

                <h2>Профиль</h2>
                <div>
                    <label>Имя:</label>
                    <input type="text" {...register('profile.name', { required: true })} />
                </div>

                <div>
                    <label>Фамилия:</label>
                    <input type="text" {...register('profile.surname', { required: true })} />
                </div>

                <div>
                    <label>Возраст:</label>
                    <input type="number" {...register('profile.age', { required: true, min: 1 })} />
                </div>

                <button type="submit">Создать пользователя</button>
            </form>

            {renderErrors(error)}

            <button onClick={handleLogin}>Залогиниться</button>
        </div>
    );
};

export { UserPage };
