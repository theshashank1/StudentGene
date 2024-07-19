from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pathlib import Path
from rest_framework import viewsets
from .serializers import FilesSerializer
from .models import Files
from .services.rag.chat import ChatService
from .services.rag.quiz import QuizService
import pickle
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

def generate_quiz(request):
    global chat_service, pdf_path
    if chat_service is None:
         chat_service=ChatService(pdf_path)
    quiz_service=QuizService(pdf_path)
    questions=quiz_service.quiz()
    return JsonResponse({'data': questions})

def summarize(request):
    print("summarize")
    return HttpResponse("Summarize", status=200)

# def init_chat(request):
#     global pdf_path
#     global chat_service
#     chat_service=ChatService(pdf_path)
#     print(chat_service)
#     # request.session['chat_service'] = ChatService(pdf_path)
#     # request.session['chat_service'] = pickle.dumps(chat_service)
#     return HttpResponse("Model Trained on Data", status=200)

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
