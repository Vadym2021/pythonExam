from django.db import models


class BaseModel(models.Model):
    class Meta:
        abstract = True

    # ROLE_CHOICES = [
    #     ('buyer', 'Покупець'),
    #     ('seller', 'Продавець'),
    #     ('manager', 'Менеджер'),
    #     ('admin', 'Адміністратор'),
    # ]
    # role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    #
    # TYPE_CHOICES = [
    #     ('basic', 'Базовий'),
    #     ('premium', 'Преміум'),
    # ]
    # account_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
