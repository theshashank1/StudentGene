from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.

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
