import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { userService } from '../../services/userService';

const BlockUser = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

    useEffect(() => {
        const fetchCurrentUserRole = async () => {
            try {
                const response = await userService.getCurrentUser();
                const currentUser = response.data;

                setIsAdmin(currentUser.is_staff);
                setIsSuperuser(currentUser.is_superuser);
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.detail || 'Ошибка при загрузке информации о пользователе');
                } else {
                    setError('Произошла непредвиденная ошибка');
                }
                console.error('Ошибка при загрузке информации о пользователе:', err);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await userService.getAll();
                setUsers(response.data.data);
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.detail || 'Ошибка при загрузке пользователей');
                } else {
                    setError('Произошла непредвиденная ошибка');
                }
                console.error('Ошибка при загрузке пользователей:', err);
            }
        };

        fetchCurrentUserRole();
        fetchUsers();
    }, []);

    const handleBlockUser = async () => {
        if (selectedUser === null) {
            return;
        }

        try {
            await userService.blockUser(selectedUser);
            setSuccessMessage('Пользователь успешно заблокирован');
            setError(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка при блокировке пользователя');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    const handleUnblockUser = async () => {
        if (selectedUser === null) {
            return;
        }

        try {
            await userService.unblockUser(selectedUser);
            setSuccessMessage('Пользователь успешно разблокирован');
            setError(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка при разблокировке пользователя');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    const handleActivateUser = async () => {
        if (selectedUser === null) {
            return;
        }

        try {
            await userService.AdminActivate(selectedUser);
            setSuccessMessage('Права Администратора предоставлены');
            setError(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка предоставления прав Администратора');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    const handleDeactivateUser = async () => {
        if (selectedUser === null) {
            return;
        }

        try {
            await userService.AdminDeactivate(selectedUser);
            setSuccessMessage('Права Администратора отключены у данного пользователя');
            setError(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка при отключении прав Администратора');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    return (
        <div>
            <h1>Управление пользователями</h1>

            <div>
                <p>Администратор: {isAdmin ? 'Да' : 'Нет'}</p>
                <p>Суперпользователь: {isSuperuser ? 'Да' : 'Нет'}</p>
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

            <div>
                <label>Выберите пользователя:</label>
                <select onChange={(e) => setSelectedUser(Number(e.target.value))}>
                    <option value="">Выберите пользователя</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.email}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleBlockUser} disabled={!isAdmin && !isSuperuser}>Заблокировать пользователя</button>
            <button onClick={handleUnblockUser} disabled={!isAdmin && !isSuperuser}>Разблокировать пользователя</button>
            <button onClick={handleActivateUser} disabled={!isSuperuser}>Сделать Администратором</button>
            <button onClick={handleDeactivateUser} disabled={!isSuperuser}>Забрать Админ права</button>
        </div>
    );
};

export { BlockUser };
