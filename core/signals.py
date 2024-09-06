# @receiver(post_save, sender=CarModel)
# def set_initial_prices(sender, instance, created, **kwargs):
#     if created:
#         update_car_price_for_instance(instance.id)
