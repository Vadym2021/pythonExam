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
    price: string;
    price_usd?: string | null;
    price_eur?: string | null;
    price_uah?: string | null;
    exchange_rate_usd?: string;
    exchange_rate_eur?: string;
    year: number;
    currency?: 'USD' | 'EUR' | 'UAH';
    created_at: string;
    updated_at: string;
    photo: string;
    view_count?: number;
    view_count_day?: number;
    view_count_week?: number;
    view_count_month?: number;
    average_price_region?: number;
    average_price_ukraine?: number;
    region?: string;
    description: string;
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