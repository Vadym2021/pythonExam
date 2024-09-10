from dataclasses import dataclass
from datetime import datetime

@dataclass
class CarDataClass:
    id: int
    brand: str
    model: str
    price: float
    price_usd: float
    price_eur: float
    price_uah: float
    exchange_rate_usd: float
    exchange_rate_eur: float
    year: int
    currency: str
    created_at: datetime
    updated_at: datetime
    seller: str
    is_active: bool
    photo: str
    region: str
    description: str
    edit_count: int
    view_count: int
    view_count_day: int
    view_count_week: int
    view_count_month: int

@dataclass
class ProfileDataClass:
    id: int
    name: str
    surname: str
    age: int
    user: str
    avatar: str
    created_at: datetime
    updated_at: datetime


@dataclass
class UserDataClass:
    id: int
    email: str
    password: str
    role: str
    is_active: bool
    is_superuser: bool
    is_staff: bool
    created_at: datetime
    updated_at: datetime
    profile: ProfileDataClass
