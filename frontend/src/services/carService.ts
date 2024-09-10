import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { ICar } from "../interfaces/car.interfase";
import { AxiosResponse } from "axios";

const carService = {
    getAll() {
        return apiService.get(urls.cars.base);
    },
    create(data: FormData) {
        return apiService.post(urls.cars.base, data);
    },
    getBrands() {
        return apiService.get(urls.cars.brands);
    },
    getModels(brandId: number) {
        return apiService.get(`${urls.cars.models}?brand=${brandId}`);
    },
    getAllModels() {
        return apiService.get(urls.cars.models);
    },
    activateCar(carId: number) {
        return apiService.patch(`${urls.cars.base}/${carId}/activate`);
    },
    deactivateCar(carId: number) {
        return apiService.patch(`${urls.cars.base}/${carId}/deactivate`);
    },
    getCarDetails(carId: number) {
        return apiService.get(`${urls.cars.base}/${carId}`);
    },
    sendBrandRequestEmail(brand: string) {
        return apiService.post(urls.cars.sendBrandRequestEmail, { brand });
    },
    async getUserCars(userId: number): Promise<ICar[]> {
        try {
            const response: AxiosResponse<ICar[]> = await apiService.get(`${urls.user.base}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении машин пользователя:', error);
            throw error;
        }
    }
};

export { carService };
