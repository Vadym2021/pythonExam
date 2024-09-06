from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from rest_framework.permissions import AllowAny

from drf_yasg import openapi
from drf_yasg.views import get_schema_view

schema_view = get_schema_view(
    openapi.Info(
        title='AutoParks',
        default_version='v1',
        description='About Cars',
        contact=openapi.Contact(email='admin@gmail.com')
    ),
    public=True,
    permission_classes=[AllowAny],
)

urlpatterns = [
    path('api/user', include('apps.user.urls')),
    path('api/auth', include('apps.auth.urls')),
    path('api/cars', include('apps.cars.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
