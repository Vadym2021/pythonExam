from django.urls import path

from .views import TestEmailView, UserBlockView, UserListCreateView, UserUnBlockView, UserCarsListView, \
    CreateSuperuserView, CreateAdminView, CurrentUserView, AdminActivateView, AdminDeactivateView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='users_list_create'),

    path('/current-user', CurrentUserView.as_view(), name='current_user'),
    path('/<int:pk>/block', UserBlockView.as_view()),
    path('/<int:pk>/unblock', UserUnBlockView.as_view()),
    path('/<int:pk>/activate', AdminActivateView.as_view(), name='admin_activate'),
    path('/<int:pk>/deactivate', AdminDeactivateView.as_view(), name='admin_deactivate'),
    path('/test', TestEmailView.as_view()),
    path('/<int:pk>', UserCarsListView.as_view(), name='user_cars_list'),
    path('/create-superuser', CreateSuperuserView.as_view(), name='create_superuser'),
    path('/create-admin', CreateAdminView.as_view(), name='create_admin'),
]
