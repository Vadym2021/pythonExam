
from decimal import Decimal
import requests
from apps.cars.models import CarModel

def update_car_price_for_instance(car_id):
    car = CarModel.objects.get(id=car_id)
    response = requests.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    rates = response.json()

    rates_dict = {rate['ccy']: Decimal(rate['sale']) for rate in rates if rate['ccy'] in ['USD', 'EUR']}
    rates_dict['UAH'] = Decimal('1.0')

    initial_currency = car.currency
    initial_price = Decimal(car.price)

    if initial_currency == 'USD':
        car.price_usd = initial_price
        car.price_eur = initial_price * (rates_dict['USD'] / rates_dict['EUR'])
        car.price_uah = initial_price * rates_dict['USD']
    elif initial_currency == 'EUR':
        car.price_eur = initial_price
        car.price_usd = initial_price * (rates_dict['EUR'] / rates_dict['USD'])
        car.price_uah = initial_price * rates_dict['EUR']
    elif initial_currency == 'UAH':
        car.price_uah = initial_price
        car.price_usd = initial_price / rates_dict['USD']
        car.price_eur = initial_price / rates_dict['EUR']

    car.exchange_rate_usd = rates_dict['USD']
    car.exchange_rate_eur = rates_dict['EUR']

    car.save()
