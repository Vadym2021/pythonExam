from rest_framework import serializers
from better_profanity import profanity

from django.core.mail import send_mail

from apps.cars.models import CarBrand, CarBrandModel, CarModel
from core.services.stat_service import StatService


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrand
        fields = ['id', 'name']


class CarBrandModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrandModel
        fields = ['id', 'brand', 'name']


class BasicCarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = ['id', 'brand', 'model', 'price', 'price_usd', 'price_eur', 'price_uah', 'year', 'created_at',
                  'updated_at', 'photo', 'description']


class PremiumCarSerializer(serializers.ModelSerializer):
    average_price_region = serializers.SerializerMethodField()
    average_price_ukraine = serializers.SerializerMethodField()

    class Meta:
        model = CarModel
        fields = ['id', 'brand', 'model', 'price', 'price_usd', 'price_eur', 'price_uah', 'exchange_rate_usd',
                  'exchange_rate_eur', 'year',
                  'currency',
                  'created_at', 'updated_at', 'photo',
                  'view_count', 'view_count_day', 'view_count_week', 'view_count_month',
                  'average_price_region', 'average_price_ukraine', 'region', 'description']

    def get_average_price_region(self, obj):
        return StatService.average_price_by_region(obj.region)

    def get_average_price_ukraine(self, obj):
        return StatService.average_price_in_ukraine()

    def validate_description(self, value):
        instance = self.instance

        if instance:
            if instance.edit_count >= 3:
                raise serializers.ValidationError("Превышено количество попыток редактирования.")
            if profanity.contains_profanity(value):
                instance.edit_count += 1
                instance.save()

                if instance.edit_count >= 3:
                    instance.is_active = False
                    instance.save()
                    send_mail(
                        'Требуется проверка объявления',
                        'Объявление с ID {} требует проверки.'.format(instance.id),
                        'admin@example.com',
                        ['manager@example.com'],
                        fail_silently=False,
                    )
                    raise serializers.ValidationError(
                        "Описание содержит нецензурную лексику. Количество попыток редактирования исчерпано. Объявление отправлено на проверку менеджеру.")
                else:
                    raise serializers.ValidationError(
                        "Описание содержит нецензурную лексику. Пожалуйста, отредактируйте описание. Осталось попыток: {}".format(
                            3 - instance.edit_count))

        return value

    @staticmethod
    def validate_year(value):
        from datetime import datetime
        current_year = datetime.now().year
        if value < 1900 or value > current_year:
            raise serializers.ValidationError(f"Год должен быть между 1900 и {current_year}.")
        return value
