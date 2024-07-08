
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.cars.models import CarModel
from core.services.currency_service import update_car_price_for_instance


@receiver(post_save, sender=CarModel)
def set_initial_prices(sender, instance, created, **kwargs):
    if created:
        update_car_price_for_instance(instance.id)
