import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { carService } from '../../services/carService';
import { ICar } from '../../interfaces/car.interfase';

const UserCars: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cars, setCars] = useState<ICar[]>([]);
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

        fetchCars();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Машины пользователя</h1>
            {cars.length === 0 ? (
                <p>Нет доступных машин.</p>
            ) : (
                cars.map(car => (
                    <div key={car.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                        <h2>{car.brand} {car.model}</h2>
                        <p><strong>Год:</strong> {car.year}</p>
                        <p><strong>Цена:</strong> {car.price} {car.currency}</p>
                        <p><strong>Регион:</strong> {car.region}</p>
                        <p><strong>Описание:</strong> {car.description}</p>
                        {car.photo ? (
                            <img src={car.photo} alt={`${car.brand} ${car.model}`} style={{ width: '100px', height: 'auto' }} />
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
