from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from accounts import views as UserViews
from .views import StockPlotsAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('register/',UserViews.RegisterView.as_view()), 

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/',UserViews.ProtectedView.as_view()),

    path("plots/", StockPlotsAPIView.as_view(), name="stock_plots"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)