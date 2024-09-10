import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { carService } from '../../services/carService';
import { userService } from '../../services/userService';

const BlockAds = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [selectedCar, setSelectedCar] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
    const [carDetails, setCarDetails] = useState<any | null>(null);
    const [premiumError, setPremiumError] = useState<string | null>(null);

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
            }
        };

        const fetchCars = async () => {
            try {
                const response = await carService.getAll();
                setCars(response.data);
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.detail || 'Ошибка при загрузке машин');
                } else {
                    setError('Произошла непредвиденная ошибка');
                }
            }
        };

        fetchCurrentUserRole();
        fetchCars();
    }, []);

    const handleActivateCar = async () => {
        if (selectedCar === null) return;

        try {
            await carService.activateCar(selectedCar);
            setSuccessMessage('Объявление успешно активировано');
            setError(null);
            fetchCarDetails(selectedCar);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка при активации объявления');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    const handleDeactivateCar = async () => {
        if (selectedCar === null) return;

        try {
            await carService.deactivateCar(selectedCar);
            setSuccessMessage('Объявление успешно деактивировано');
            setError(null);
            fetchCarDetails(selectedCar);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Ошибка при деактивации объявления');
            } else {
                setError('Произошла непредвиденная ошибка');
            }
            setSuccessMessage(null);
        }
    };

    const fetchCarDetails = async (carId: number) => {
        try {
            const response = await carService.getCarDetails(carId);
            if (response.data.error) {
                setPremiumError(response.data.error);
                setCarDetails(null);
            } else {
                setCarDetails(response.data.car);
                setPremiumError(null);
            }
        } catch (err) {
            console.error('Ошибка при получении данных машины:', err);
        }
    };

    return (
        <div>
            <h1>Управление объявлениями о машинах</h1>

            <div>
                <p>Администратор: {isAdmin ? 'Да' : 'Нет'}</p>
                <p>Суперпользователь: {isSuperuser ? 'Да' : 'Нет'}</p>
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

            <div>
                <label>Выберите объявление (ID):</label>
                <select onChange={(e) => setSelectedCar(Number(e.target.value))}>
                    <option value="">Выберите объявление</option>
                    {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                            {car.id}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleActivateCar} disabled={!isAdmin && !isSuperuser}>
                Активировать объявление
            </button>
            <button onClick={handleDeactivateCar} disabled={!isAdmin && !isSuperuser}>
                Деактивировать объявление
            </button>

            {premiumError && (
                <div style={{ color: 'red' }}>
                    {premiumError}
                </div>
            )}

            {carDetails && (
                <div>
                    <h3>Детали объявления:</h3>
                    <p>ID: {carDetails.id}</p>
                    <p>Бренд: {carDetails.brand}</p>
                    <p>Модель: {carDetails.model}</p>
                    <p>Цена: {carDetails.price}</p>
                    <p>Цена в USD: {carDetails.price_usd}</p>
                    <p>Цена в EUR: {carDetails.price_eur}</p>
                    <p>Цена в UAH: {carDetails.price_uah}</p>
                    <p>Курс USD: {carDetails.exchange_rate_usd}</p>
                    <p>Курс EUR: {carDetails.exchange_rate_eur}</p>
                    <p>Год: {carDetails.year}</p>
                    <p>Валюта: {carDetails.currency}</p>
                    <p>Дата создания: {carDetails.created_at}</p>
                    <p>Дата обновления: {carDetails.updated_at}</p>
                    <p>Просмотры: {carDetails.view_count}</p>
                    <p>Просмотры за день: {carDetails.view_count_day}</p>
                    <p>Просмотры за неделю: {carDetails.view_count_week}</p>
                    <p>Просмотры за месяц: {carDetails.view_count_month}</p>
                    <p>Средняя цена по региону: {carDetails.average_price_region}</p>
                    <p>Средняя цена по Украине: {carDetails.average_price_ukraine}</p>
                    <p>Регион: {carDetails.region}</p>
                </div>
            )}
        </div>
    );
};

export { BlockAds };
