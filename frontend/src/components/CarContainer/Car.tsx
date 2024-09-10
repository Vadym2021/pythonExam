import React from 'react';
import { ICar } from "../../interfaces/car.interfase";
import css from './Car.module.css';

interface CarProps {
    car: ICar;
}

const Car: React.FC<CarProps> = ({ car }) => {
    const { id, brand, model, price, price_usd, price_eur, price_uah, year, photo, description } = car;

    return (
        <div className={css.CarCard}>
            <div>id: {id}</div>
            <div>Бренд: {brand}</div>
            <div>Модель: {model}</div>
            <div>Цена: {price} {car.currency}</div>
            <div>Цена (USD): {price_usd ?? 'Не указана'}</div>
            <div>Цена (EUR): {price_eur ?? 'Не указана'}</div>
            <div>Цена (UAH): {price_uah ?? 'Не указана'}</div>
            <div>Год: {year}</div>
            {photo && (
                <img
                    src={photo}
                    alt="Фото автомобиля"
                    className={css.CarPhoto}
                />
            )}
            <div>Описание: {description}</div>
        </div>
    );
};

export { Car };
