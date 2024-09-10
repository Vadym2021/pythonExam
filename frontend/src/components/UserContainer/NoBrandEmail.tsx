import React, { useState } from 'react';
import { carService } from '../../services/carService';

const NoBrandEmail = () => {
    const [brand, setBrand] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendEmail = async () => {
        try {
            const response = await carService.sendBrandRequestEmail(brand);
            setMessage(response.data.message);
            setError(null);
        } catch (err) {
            setError('Ошибка при отправке email');
            setMessage(null);
        }
    };

    return (
        <div>
            <h3>Сообщить об отсутствии бренда</h3>
            <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Введите название бренда"
            />
            <button onClick={handleSendEmail}>Отправить запрос</button>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export { NoBrandEmail };
