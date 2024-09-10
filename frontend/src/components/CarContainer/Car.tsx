import React from 'react';
import {ICar} from "../../interfaces/car.interfase";

interface CarProps {
    car: ICar;
}

const Car: React.FC<CarProps> = ({ car }) => {
    const { id, brand, price, year } = car;
    return (
        <div>
            <div>id: {id}</div>
            <div>brand: {brand}</div>
            <div>price: {price}</div>
            <div>year: {year}</div>
        </div>
    );
};

export { Car };
