from decimal import Decimal
import requests
from celery import shared_task

from apps.cars.models import CarModel


def update_car_price_for_instance(car):
    response = requests.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    rates = response.json()

    rates_dict = {rate['ccy']: Decimal(rate['sale']) for rate in rates if rate['ccy'] in ['USD', 'EUR']}

    rates_dict['UAH'] = Decimal('1.0')

    initial_currency = car.currency
    initial_price = Decimal(car.price)

    if initial_currency == 'USD':
        car.price_usd = initial_price
        car.price_eur = (initial_price * (rates_dict['USD'] / rates_dict['EUR'])).quantize(Decimal('0.01'))
        car.price_uah = (initial_price * rates_dict['USD']).quantize(Decimal('0.01'))

    elif initial_currency == 'EUR':
        car.price_eur = initial_price
        car.price_usd = (initial_price * (rates_dict['EUR'] / rates_dict['USD'])).quantize(Decimal('0.01'))
        car.price_uah = (initial_price * rates_dict['EUR']).quantize(Decimal('0.01'))

    elif initial_currency == 'UAH':
        car.price_uah = initial_price
        car.price_usd = (initial_price / rates_dict['USD']).quantize(Decimal('0.01'))
        car.price_eur = (initial_price / rates_dict['EUR']).quantize(Decimal('0.01'))

    car.exchange_rate_usd = rates_dict['USD']
    car.exchange_rate_eur = rates_dict['EUR']

    car.save()


@shared_task
def update_car_prices():
    cars = CarModel.objects.all()

    response = requests.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    rates = response.json()
    rates_dict = {rate['ccy']: Decimal(rate['sale']) for rate in rates if rate['ccy'] in ['USD', 'EUR']}
    rates_dict['UAH'] = Decimal('1.0')

    for car in cars:

        initial_currency = car.currency
        initial_price = Decimal(car.price)

        if initial_currency == 'USD':
            car.price_usd = initial_price
            car.price_eur = (initial_price * (rates_dict['USD'] / rates_dict['EUR'])).quantize(Decimal('0.01'))
            car.price_uah = (initial_price * rates_dict['USD']).quantize(Decimal('0.01'))
        elif initial_currency == 'EUR':
            car.price_eur = initial_price
            car.price_usd = (initial_price * (rates_dict['EUR'] / rates_dict['USD'])).quantize(Decimal('0.01'))
            car.price_uah = (initial_price * rates_dict['EUR']).quantize(Decimal('0.01'))
        elif initial_currency == 'UAH':
            car.price_uah = initial_price
            car.price_usd = (initial_price / rates_dict['USD']).quantize(Decimal('0.01'))
            car.price_eur = (initial_price / rates_dict['EUR']).quantize(Decimal('0.01'))

        car.exchange_rate_usd = rates_dict['USD']
        car.exchange_rate_eur = rates_dict['EUR']

        car.save()
