from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as DefaultTokenObtainPairSerializer

UserModel = get_user_model()


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('password',)


class CustomTokenObtainPairSerializer(DefaultTokenObtainPairSerializer):
    user_id = serializers.IntegerField(read_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        data['id'] = user.id

        return data
