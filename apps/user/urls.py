from django.urls import path

from .views import TestEmailView, UserBlockView, UserListCreateView, UserUnBlockView, UserCarsListView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='users_list_create'),


    path('/<int:pk>/block', UserBlockView.as_view()),
    path('/<int:pk>/unblock', UserUnBlockView.as_view()),
    path('/test', TestEmailView.as_view()),
    path('/<int:pk>', UserCarsListView.as_view(), name='user_cars_list')
]
