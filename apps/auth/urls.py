from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from apps.auth.views import RecoveryPasswordView, RecoveryRequestView, SocketView, TokenPairView, UserActivateView, \
    ActivationConfirmationView

urlpatterns = [
    path('', TokenPairView.as_view(), name='auth_login'),
    path('/refresh', TokenRefreshView.as_view(), name='auth_refresh'),
    path('/activate/<str:token>', UserActivateView.as_view()),
    path('/recovery', RecoveryRequestView.as_view()),
    path('/recovery/<str:token>', RecoveryPasswordView.as_view()),
    path('/socket', SocketView.as_view()),
    path('/confirm/<str:token>', ActivationConfirmationView.as_view(), name='activation_confirm'),
]
