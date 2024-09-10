import React from 'react';
import { ICar } from "../../interfaces/car.interfase";

interface CarProps {
    car: ICar;
}

const Car: React.FC<CarProps> = ({ car }) => {
    const { id, brand, model, price, year, photo, description } = car;
    return (
        <div>
            <div>id: {id}</div>
            <div>brand: {brand}</div>
            <div>model: {model}</div>
            <div>price: {price}</div>
            <div>year: {year}</div>
            {photo && (
                <img
                    src={photo}
                    alt="Car photo"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
            )}
            <div>description: {description}</div>
        </div>
    );
};

export { Car };
