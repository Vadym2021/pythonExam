export interface ICarCreate {
    brand: number;
    model: number;
    year: number;
    price: number;
    description?: string;
    currency: string;
    photo?: string | null;
    seller: number;
    region: string;
}

export interface ICar {
    id: number;
    brand: number;
    model: number;
    price: number;
    price_usd?: number | null;
    price_eur?: number | null;
    price_uah?: number | null;
    exchange_rate_usd?: number | null;
    exchange_rate_eur?: number | null;
    year: number;
    currency: 'USD' | 'EUR' | 'UAH';
    created_at: string;
    updated_at: string;
    seller: number;
    is_active: boolean;
    photo?: string | null;
    region: string;
    description?: string;
    edit_count: number;
    view_count: number;
    view_count_day: number;
    view_count_week: number;
    view_count_month: number;
}

export interface Brand {
    id: number;
    name: string;
}

export interface Model {
    id: number;
    name: string;
    brand: number;
}