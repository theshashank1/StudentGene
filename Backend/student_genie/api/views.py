from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pathlib import Path
from rest_framework import viewsets
from .serializers import FilesSerializer
from .models import Files
from .services.rag.chat import ChatService
from .services.rag.quiz import QuizService
from .services.rag.summarize import SummarizeService
import pickle
import os
import shutil
from django.views.decorators.csrf import csrf_exempt


# Create your views here.

chat_service=None
pdfs=Files.objects.all()
pdf_path=Path("C:/Users/chand/OneDrive/Desktop/GitHub/StudentGenie/StudentGenie/Backend/student_genie/media/"+str(pdfs.first()))
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

@csrf_exempt
def generate_quiz(request):
    try:
        shutil.rmtree("C:/Users/chand/OneDrive/Desktop/GitHub/StudentGenie/StudentGenie/Backend/student_genie/api/services/rag/chroma_db")
    except Exception as e:
        # handle the exception or log it
        print(f"Error deleting directory: {e}")
    if request.method=='POST':
        quiz_service=QuizService(request.POST['url'], True)
        questions=quiz_service.quiz()
        return JsonResponse({'data': questions})
    else:
        quiz_service=QuizService(pdf_path)
        questions=quiz_service.quiz()
        return JsonResponse({'data': questions})

def summarize(request):
    print("summarize")
    return HttpResponse("Summarize", status=200)

def init_chat(request):
    global pdf_path
    global chat_service
    chat_service=ChatService(pdf_path)
    print(chat_service)
    # request.session['chat_service'] = ChatService(pdf_path)
    # request.session['chat_service'] = pickle.dumps(chat_service)
    return HttpResponse("Model Trained on Data", status=200)

@csrf_exempt
def chat(request):
    global chat_service
    if chat_service is None:
            global pdf_path
            chat_service=ChatService(pdf_path)
    if request.method=='POST':
        question=request.POST['question']
        # chat_service = pickle.loads(request.session.get('chat_service'))
        res = chat_service.chat(question)
    # return HttpResponse(res, status=200)
    return JsonResponse({'data': res})

def summarize_doc(request):
    global pdf_path
    service=SummarizeService(pdf_path)
    summary=service.summarize()
    return JsonResponse({'data': summary})

@csrf_exempt
def summarize_youtube(request):
    if request.method=='POST':
        service=SummarizeService(request.POST['url'], 1)
        summary=service.summarize()
        return JsonResponse({'data': summary})