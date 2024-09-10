import React, { useEffect, useState } from 'react';
import { carService } from "../../services/carService";
import { Car } from "./Car";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let token: string | null = null;

        const fetchCars = async () => {
            try {
                token = localStorage.getItem('access');
                localStorage.removeItem('access');

                const { data } = await carService.getAll();
                setCars(data);
            } catch (error) {
                setError('Ошибка при загрузке машин');
            } finally {
                if (token) {
                    localStorage.setItem('access', token);
                }
            }
        };

        fetchCars();
    }, []);

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {cars.map(car => <Car key={car.id} car={car} />)}
        </div>
    );
};

export { Cars };
