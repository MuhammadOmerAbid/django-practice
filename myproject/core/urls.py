from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, PostViewSet



router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)  # new

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
]

urlpatterns += router.urls
