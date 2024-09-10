import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {AuthResponse, LoginFormData} from "../interfaces/user.interface";


const authService = {
    async login(user: LoginFormData): Promise<AuthResponse> {
        const {data: { access, refresh, id }} = await apiService.post(urls.auth.login, user);
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        return { access, refresh, id };
    },
    getSocketToken() {
        return apiService.get(urls.auth.socket)
    }
}
export {
    authService
}