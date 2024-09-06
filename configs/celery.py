import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')

app = Celery('configs')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'send_spam_every_minutes': {
        'task': 'core.services.email_service.spam',
        # 'schedule': crontab(minute='*/1'),
        'schedule': crontab(hour='0', minute='0'),
        # 'args':()
    },
    'update_car_prices_daily': {
        'task': 'core.services.currency_service.update_car_prices',
        'schedule': crontab(hour='0', minute='0'),
        # 'schedule': crontab(minute='*'),
    },
}
