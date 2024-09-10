import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { IUserCreate } from "../interfaces/user.interface";

const userService = {
    getAll() {
        return apiService.get(urls.user.base);
    },
    createUser(data: IUserCreate) {
        return apiService.post(urls.user.base, data);
    },
    createAdmin(data: IUserCreate) {
        return apiService.post(urls.user.createAdmin, data);
    },
    createSuperuser(data: IUserCreate) {
        return apiService.post(urls.user.createSuperuser, data);
    },
    blockUser(userId: number) {
        return apiService.patch(`${urls.user.base}/${userId}/block`);
    },
    unblockUser(userId: number) {
        return apiService.patch(`${urls.user.base}/${userId}/unblock`);
    },
    AdminDeactivate(userId: number) {
        return apiService.patch(`${urls.user.base}/${userId}/deactivate`);
    },
    AdminActivate(userId: number) {
        return apiService.patch(`${urls.user.base}/${userId}/activate`);
    },
    getCurrentUser() {
        return apiService.get(urls.user.currentUser);
    },
};

export { userService };
