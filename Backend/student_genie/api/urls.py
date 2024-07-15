from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('quiz/', views.generate_quiz, name='quiz'),

]