from django.shortcuts import render
from django.http import HttpResponse
import mongo.MongoOp as MongoOp

# Create your views here.

def GetAnswer(request):
    MongoOp.insertAnswer({"a":12345})
    return HttpResponse("This is the answer.")