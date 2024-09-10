export interface IUserCreate {
    email: string;
    password: string;
    account_type: string;
    profile: Profile;
}

interface Profile {
    name: string;
    surname: string;
    age: number;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    id: number;
}