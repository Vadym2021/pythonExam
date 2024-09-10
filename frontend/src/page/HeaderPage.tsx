import React from 'react';
import { NavLink } from 'react-router-dom';
import css from './HeaderPage.module.css';

const HeaderPage = () => {
    return (
        <div className={css.Header}>
            <NavLink to={'cars'} className={({ isActive }) => isActive ? css.active : ''}>
                Просмотр машин без регистрации
            </NavLink>
            <NavLink to={'auth'} className={({ isActive }) => isActive ? css.active : ''}>
                Войти
            </NavLink>
            <NavLink to={'user'} className={({ isActive }) => isActive ? css.active : ''}>
                Регистрация
            </NavLink>
        </div>
    );
};

export { HeaderPage };
