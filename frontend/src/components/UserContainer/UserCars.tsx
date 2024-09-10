import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { carService } from '../../services/carService';
import { ICar, Brand, Model } from '../../interfaces/car.interfase';
import css from './UserCars.module.css';

const UserCars: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cars, setCars] = useState<ICar[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            if (id) {
                try {
                    const response = await carService.getUserCars(Number(id));
                    setCars(response);
                } catch (err) {
                    setError('Ошибка при загрузке данных.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError('Не указан id.');
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await carService.getBrands();
                setBrands(response.data.data);
            } catch (error) {
                setError('Ошибка при загрузке брендов.');
                console.error('Ошибка при загрузке брендов:', error);
            }
        };

        const fetchModels = async () => {
            try {
                const response = await carService.getAllModels();
                setModels(response.data.data);
            } catch (error) {
                setError('Ошибка при загрузке моделей.');
                console.error('Ошибка при загрузке моделей:', error);
            }
        };

        fetchCars();
        fetchBrands();
        fetchModels();
    }, [id]);

    const getBrandName = (brandId: number) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'Неизвестно';
    };

    const getModelName = (modelId: number) => {
        const model = models.find(m => m.id === modelId);
        return model ? model.name : 'Неизвестно';
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={css.UserCarsContainer}>
            <h1>Машины пользователя</h1>
            {cars.length === 0 ? (
                <p>Нет доступных машин.</p>
            ) : (
                cars.map(car => (
                    <div key={car.id} className={css.CarCard}>
                        <h2>{getBrandName(car.brand)} {getModelName(car.model)}</h2>
                        <p><strong>Год:</strong> {car.year}</p>
                        <p><strong>Цена:</strong> {car.price} {car.currency}</p>
                        <p><strong>Регион:</strong> {car.region}</p>
                        <p><strong>Описание:</strong> {car.description}</p>
                        {car.photo ? (
                            <img src={car.photo} alt={`${getBrandName(car.brand)} ${getModelName(car.model)}`} style={{ width: '100px', height: 'auto' }} />
                        ) : (
                            <p>Фото отсутствует</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export { UserCars };
