from django.urls import path

from apps.cars.views import CarListCreateView, car_details, CarBrandListView, CarBrandModelListView, \
    send_brand_request_email

urlpatterns = [
    path('', CarListCreateView.as_view(), name='car_list_create'),
    path('/<int:car_id>', car_details, name='car_details'),
    path('/brands', CarBrandListView.as_view(), name='car-brand-list'),
    path('/models', CarBrandModelListView.as_view(), name='car-brand-model-list'),
    path('/send_brand_request_email', send_brand_request_email, name='send_brand_request_email'),
]
