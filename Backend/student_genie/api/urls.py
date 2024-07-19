from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')

app_name = 'api'
urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('quiz/', views.generate_quiz, name='quiz'),
    path('summarize/', views.summarize, name='summarize'),
    path('chat/', views.chat, name='chat'),
    path('api/', include(router.urls)),
]