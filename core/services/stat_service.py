from django.db.models import Avg
from apps.cars.models import CarModel


class StatService:
    @staticmethod
    def increment_view_count(car):
        car.view_count += 1
        car.view_count_day += 1
        car.view_count_week += 1
        car.view_count_month += 1
        car.save()

    @staticmethod
    def average_price_by_region(region):
        return CarModel.objects.filter(region=region).aggregate(Avg('price'))['price__avg']

    @staticmethod
    def average_price_in_ukraine():
        return CarModel.objects.aggregate(Avg('price'))['price__avg']
