import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const PersonalUserPage = () => {
    return (
        <div>
            <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                <NavLink to="create-car" style={{ marginRight: '15px' }}>
                    Создать машину
                </NavLink>
                <NavLink to="block-users" style={{ marginRight: '15px' }}>
                    Управление пользователями
                </NavLink>
                <NavLink to="block-ads" style={{ marginRight: '15px' }}>
                    Управление объявлениями
                </NavLink>
                <NavLink to="no-brand" style={{ marginRight: '15px' }}>
                    Сообщить об отсутствии бренда
                </NavLink>
                <NavLink to="user-cars" style={{ marginRight: '15px' }}>
                    Объявления пользователя
                </NavLink>
            </nav>
            <Outlet />
        </div>
    );
};

export { PersonalUserPage };
