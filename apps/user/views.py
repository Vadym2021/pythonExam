import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template


from rest_framework import status
from rest_framework.generics import GenericAPIView, ListCreateAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from apps.cars.models import CarModel
from apps.cars.serizlizers import PremiumCarSerializer, BasicCarSerializer
from apps.user.serializer import UserSerializer

UserModel = get_user_model()


class UserListCreateView(ListCreateAPIView):
    """
    get:
        get All users
    post:
        create new user
    """
    serializer_class = UserSerializer
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    # permission_classes = (IsAuthentificatedOrWriteOnly,)

    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return (IsAuthenticated(),)
    #     return (AllowAny(),)


# class UserListView(ListAPIView):
#     serializer_class = UserSerializer
#     queryset = UserModel.objects.all()
#     permission_classes = [IsAuthenticated]


class UserCarsListView(ListAPIView):
    pagination_class = None
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and user.account_type == 'premium':
            return PremiumCarSerializer
        return BasicCarSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return CarModel.objects.filter(seller_id=user_id)


class UserBlockView(GenericAPIView):
    serializer_class = UserSerializer
    # queryset = UserModel.objects.all()
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        return UserModel.objects.exclude(id=self.request.user.id)

    def patch(self, *args, **kwargs):
        print(self.request.user.__dict__)
        user = self.get_object()
        if user.is_active:
            user.is_active = False
            user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class UserUnBlockView(GenericAPIView):
    serializer_class = UserSerializer
    # queryset = UserModel.objects.all()
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        return UserModel.objects.exclude(id=self.request.user.id)

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.is_active:
            user.is_active = True
            user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


# class UserAddAvatarView(UpdateAPIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = ProfileAvatarSerializer
#     http_method_names = ('put',)
#
#     def get_object(self):
#         return self.request.user.profile
#
#     def perform_update(self, serializer):
#         profile: ProfileModel = self.get_object()
#         profile.avatar.delete()
#         super().perform_update(serializer)


class TestEmailView(GenericAPIView):
    """
    Test Email Endpoint
    """
    permission_classes = [AllowAny]

    def get_serializer(self, *args, **kwargs):
        pass

    def get(self, *args, **kwargs):
        template = get_template('test_email.html')
        html_content = template.render({'user': 'Max'})
        msg = EmailMultiAlternatives('Test', from_email=os.environ.get('EMAIL_HOST'), to=['aisclass@ukr.net'])
        msg.attach_alternative(html_content, 'text/html')
        msg.send()
        return Response(status=status.HTTP_200_OK)
