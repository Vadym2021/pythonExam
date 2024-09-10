import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from configs.celery import app
from core.dataclasses.user_dataclass import UserDataClass
from core.services.jwt_service import JWTService, ActivateToken, RecoveryToken

UserModel = get_user_model()


class EmailService:
    @staticmethod
    @app.task
    def __send_email(to: str, template_name: str, context: dict, subject='') -> None:
        template = get_template(template_name)
        html_content = template.render(context)
        msg = EmailMultiAlternatives(subject, from_email=os.environ.get('EMAIL_HOST_USER'), to=[to])
        msg.attach_alternative(html_content, 'text/html')
        msg.send()

    @classmethod
    def register(cls, user: UserDataClass):
        token = JWTService.create_token(user, ActivateToken)
        url = f'http://localhost:8000/api/auth/confirm/{token}'
        cls.__send_email.delay(
            user.email,
            'register.html',
            {'name': user.profile.name, 'url': url},
            'Register'
        )

    @classmethod
    def recovery_password(cls, user: UserDataClass):
        token = JWTService.create_token(user, RecoveryToken)
        url = f'http://localhost:8000/api/auth/recovery/{token}'
        cls.__send_email.delay(user.email, 'recovery.html', {'url': url}, 'Recovery password')

    @staticmethod
    @app.task
    def spam():
        for user in UserModel.objects.all():
            user: UserDataClass = user
            EmailService.__send_email(user.email, 'spam.html', {'name': user.profile.name}, 'Spam')

    @classmethod
    def send_brand_request_email(cls, seller_email: str, brand_name: str):
        subject = 'Request for New Car Brand Addition'
        message = f'Dear Admin,\n\nThe seller {seller_email} has requested to add a new car brand: {brand_name}.\n\nPlease take necessary actions.\n\nBest regards,\nYour Website Team'

        template = get_template('brand_request.html')
        html_content = template.render({'message': message})

        try:
            cls.__send_email(
                'aisclass2012@gmail.com',
                'brand_request.html',
                {'message': message},
                subject
            )
            return True
        except Exception as e:
            print(f'Ошибка при отправке письма: {str(e)}')
            return False
