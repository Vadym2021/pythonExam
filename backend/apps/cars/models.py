from datetime import datetime

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.core import validators as V

from apps.user.models import UserModel
from core.services.upload_photo import upload_photo


class CarBrand(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'car_brands'

    def __str__(self):
        return self.name


class CarBrandModel(models.Model):
    brand = models.ForeignKey(CarBrand, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'car_models'
        unique_together = ('brand', 'name')

    def __str__(self):
        return f'{self.brand.name} {self.name}'


class CarModel(models.Model):
    class Meta:
        db_table = 'cars'

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('UAH', 'UAH'),
    ]

    brand = models.ForeignKey(CarBrand, on_delete=models.CASCADE)
    model = models.ForeignKey(CarBrandModel, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_eur = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_uah = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    exchange_rate_usd = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    exchange_rate_eur = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.now().year)
        ]
    )
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    seller = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    photo = models.ImageField(upload_to=upload_photo, blank=True, validators=[
        V.FileExtensionValidator(['gif', 'jpeg', 'png', 'jpg'])
    ], max_length=255)
    region = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    edit_count = models.PositiveIntegerField(default=0)

    view_count = models.PositiveIntegerField(default=0)
    view_count_day = models.PositiveIntegerField(default=0)
    view_count_week = models.PositiveIntegerField(default=0)
    view_count_month = models.PositiveIntegerField(default=0)
