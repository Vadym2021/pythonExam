from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cars.models import CarBrand, CarBrandModel, CarModel
from apps.cars.serizlizers import CarBrandSerializer, CarBrandModelSerializer, PremiumCarSerializer, BasicCarSerializer
from core.services.currency_service import update_car_price_for_instance
from core.services.email_service import EmailService
from core.services.stat_service import StatService

import logging

logger = logging.getLogger(__name__)

UserModel = get_user_model()


class CarBrandListView(generics.ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = CarBrand.objects.all()
    serializer_class = CarBrandSerializer


class CarBrandModelListView(generics.ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = CarBrandModelSerializer

    def get_queryset(self):
        brand_id = self.request.query_params.get('brand')
        if brand_id is not None:
            return CarBrandModel.objects.filter(brand_id=brand_id)
        return CarBrandModel.objects.all()


class CarActivateView(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CarModel.objects.all()

    def patch(self, request, pk):
        car = get_object_or_404(CarModel, pk=pk)
        if not car.is_active:
            car.is_active = True
            car.save()
        serializer = BasicCarSerializer(car)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CarDeactivateView(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CarModel.objects.all()

    def patch(self, request, pk):
        car = get_object_or_404(CarModel, pk=pk)
        if car.is_active:
            car.is_active = False
            car.save()
        serializer = BasicCarSerializer(car)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CarListCreateView(ListCreateAPIView):
    queryset = CarModel.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = None

    def get_serializer_class(self):
        user = self.request.user if self.request.user.is_authenticated else None

        if user and user.account_type == 'premium':
            return PremiumCarSerializer
        return BasicCarSerializer

    def perform_create(self, serializer):
        seller = self.request.user if self.request.user.is_authenticated else None

        if not seller:
            return Response({'detail': 'Пользователь должен быть аутентифицирован.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if seller.account_type == 'basic' and CarModel.objects.filter(seller=seller).count() >= 1:
            raise ValidationError('Базовый аккаунт может выставить на продажу только одно авто.',
                                  code=status.HTTP_403_FORBIDDEN)

        instance = serializer.save(seller=seller)
        instance.is_active = True

        logger.info(f"Созданный экземпляр: {instance}")

        update_car_price_for_instance(instance)

        StatService.increment_view_count(instance)
        instance.save()

        return Response({'message': 'Автомобиль успешно добавлен'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def send_brand_request_email(request):
    brand_name = request.data.get('brand', '')
    seller_email = request.user.email

    try:
        EmailService.send_brand_request_email(seller_email, brand_name)
        return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def car_details(request, car_id):
    user = request.user
    if user.account_type != 'premium':
        return Response({'error': 'Доступно только для аккаунтов типа "Премиум".'}, status=status.HTTP_403_FORBIDDEN)

    car = get_object_or_404(CarModel, id=car_id)
    StatService.increment_view_count(car)
    views = {
        'view_count': car.view_count,
        'view_count_day': car.view_count_day,
        'view_count_week': car.view_count_week,
        'view_count_month': car.view_count_month,
    }
    prices = {
        'average_price_region': StatService.average_price_by_region(car.region),
        'average_price_ukraine': StatService.average_price_in_ukraine(),
    }
    response = {
        'car': PremiumCarSerializer(car).data,
        'views': views,
        'prices': prices,
    }

    return Response(response, status=status.HTTP_200_OK)
