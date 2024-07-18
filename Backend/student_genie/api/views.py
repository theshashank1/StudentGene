from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets
from .serializers import FilesSerializer
from .models import Files
# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

def login(request):
    print("login")
    return HttpResponse("logined", status=200)
    pass

def register(request):
    return HttpResponse("registered")
    pass

def generate_quiz(request):
    print("generate_quiz")
    return HttpResponse("quiz Generated", status=200)

    pass

def summarize(request):
    print("summarize")
    return HttpResponse("Summarize", status=200)
