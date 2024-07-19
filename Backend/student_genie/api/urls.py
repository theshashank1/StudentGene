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
    path('summarize/doc/', views.summarize_doc, name='summarize_doc'),
    path('summarize/youtube/', views.summarize_youtube, name='summarize_youtube'),
    path('init_chat/', views.init_chat, name='init_chat'),
    path('chat/', views.chat, name='chat'),
    path('api/', include(router.urls)),
]