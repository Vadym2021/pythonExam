from django.db import models
from django.core import validators as V
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from core.models import BaseModel
from core.enums.regex_enum import RegexEnum
from apps.user.managers import UserManager


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta:
        db_table = 'auth_user'

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, validators=[
        V.RegexValidator(*RegexEnum.PASSWORD.value)
    ])
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    TYPE_CHOICES = [
        ('basic', 'Базовий'),
        ('premium', 'Преміум'),
    ]
    account_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='basic')

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def is_premium(self):
        return self.account_type == 'premium'





class ProfileModel(BaseModel):
    class Meta:
        db_table = 'profile'

    name = models.CharField(max_length=20, validators=[
        V.RegexValidator(*RegexEnum.NAME.value)
    ])
    surname = models.CharField(max_length=20, validators=[
        V.RegexValidator(*RegexEnum.NAME.value)
    ])
    age = models.IntegerField(validators=[
        V.MinValueValidator(15),
        V.MaxValueValidator(150)
    ])
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='profile')
