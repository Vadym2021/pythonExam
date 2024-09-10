import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { carService } from '../../services/carService';
import { Brand, ICarCreate, Model } from '../../interfaces/car.interfase';

const CreateCar = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset, setValue } = useForm<ICarCreate>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await carService.getBrands();
                setBrands(response.data.data);
            } catch (error) {
                setErrorMessage('Ошибка при загрузке брендов.');
                console.error('Ошибка при загрузке брендов:', error);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            const fetchModels = async () => {
                try {
                    const response = await carService.getModels(selectedBrand);
                    setModels(response.data.data);
                } catch (error) {
                    setErrorMessage('Ошибка при загрузке моделей.');
                    console.error('Ошибка при загрузке моделей:', error);
                }
            };

            fetchModels();
        } else {
            setModels([]);
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (id) {
            setValue('seller', parseInt(id));
        }
    }, [id, setValue]);

    const onSubmit = async (data: ICarCreate) => {
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput && fileInput.files?.[0]) {
                formData.append('photo', fileInput.files[0]);
            }

            const response = await carService.create(formData);
            setSuccessMessage('Машина успешно создана.');
            reset();
        } catch (error) {
            setErrorMessage('Ошибка при создании машины.');
            console.error('Ошибка при создании машины:', error);
        }
    };

    return (
        <div>
            <h1>Создание машины</h1>
            {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green', marginBottom: '20px' }}>{successMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Марка:</label>
                    <select
                        {...register('brand', { required: true })}
                        onChange={(e) => setSelectedBrand(Number(e.target.value))}
                    >
                        <option value="">Выберите марку</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Модель:</label>
                    <select {...register('model', { required: true })} disabled={!selectedBrand}>
                        <option value="">Выберите модель</option>
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Год выпуска:</label>
                    <input
                        type="number"
                        {...register('year', {
                            required: true,
                            min: 1900,
                            max: new Date().getFullYear()
                        })}
                    />
                </div>
                <div>
                    <label>Цена:</label>
                    <input type="number" {...register('price', { required: true })} />
                </div>
                <div>
                    <label>Валюта:</label>
                    <select {...register('currency', { required: true })}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="UAH">UAH</option>
                    </select>
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea {...register('description')}></textarea>
                </div>
                <div>
                    <label>Фото:</label>
                    <input type="file" {...register('photo')} />
                </div>
                <div>
                    <label>Продавец ID:</label>
                    <input
                        type="number"
                        {...register('seller', { required: true })}
                        disabled
                    />
                </div>
                <div>
                    <label>Регион:</label>
                    <input type="text" {...register('region', { required: true })} />
                </div>
                <button type="submit">Создать машину</button>
            </form>
        </div>
    );
};

export { CreateCar };
