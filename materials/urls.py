from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'materials', MaterialViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]