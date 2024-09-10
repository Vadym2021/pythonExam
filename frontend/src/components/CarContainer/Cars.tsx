import React, {useEffect, useState} from 'react';
import {carService} from "../../services/carService";
import {Car} from "./Car";
import {Brand, Model} from "../../interfaces/car.interfase";
import css from './Cars.module.css';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let token: string | null = null;

        const fetchCars = async () => {
            try {
                token = localStorage.getItem('access');
                localStorage.removeItem('access');

                const {data} = await carService.getAll();
                setCars(data);
            } catch (error) {
                setError('Ошибка при загрузке машин');
            } finally {
                if (token) {
                    localStorage.setItem('access', token);
                }
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
    }, []);

    const getBrandName = (brandId: number) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'Неизвестно';
    };

    const getModelName = (modelId: number) => {
        const model = models.find(m => m.id === modelId);
        return model ? model.name : 'Неизвестно';
    };

    return (
        <div className={css.CarContainer}>
            {error && <div style={{color: 'red'}}>{error}</div>}
            {cars.map(car => (
                <Car
                    key={car.id}
                    car={{
                        ...car,
                        brand: getBrandName(car.brand),
                        model: getModelName(car.model),
                    }}
                />
            ))}
        </div>
    );
};

export {Cars};
