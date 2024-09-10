from django.contrib.auth import get_user_model
from django.db.transaction import atomic
from rest_framework import serializers
from apps.user.models import ProfileModel
from core.services.email_service import EmailService

UserModel = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileModel
        fields = ('id', 'name', 'surname', 'age')

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    is_superuser = serializers.BooleanField(required=False, default=False)
    is_staff = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = UserModel
        fields = (
            'id', 'email', 'password', 'is_active', 'is_staff', 'account_type', 'is_superuser', 'last_login',
            'created_at', 'updated_at', 'profile'
        )
        read_only_fields = ('id', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'created_at', 'updated_at')
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    @atomic
    def create(self, validated_data: dict):
        profile = validated_data.pop('profile', None)
        user = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            is_staff=validated_data.get('is_staff', False),
            is_superuser=validated_data.get('is_superuser', False)
        )
        if profile:
            ProfileModel.objects.create(**profile, user=user)
        EmailService.register(user)
        return user
