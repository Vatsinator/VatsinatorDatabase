import json

from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

from commits.models import Commit, CommitData

@ensure_csrf_cookie
def review(request, token):
  commit = get_object_or_404(Commit, token=token)
  data = commit.commitdata_set.all()
  return render(request, 'commits/review.html', {
    'commit' : commit,
    'data'   : data
  })

def accept(request):
  if not 'token' in request.POST:
    return HttpResponse(json.dumps({'result': 0}), content_type="application/json")
  
  token = request.POST['token']
  commit = Commit.objects.get(token=token)
  commit.merge()
  
  return HttpResponse(json.dumps({'result': 1, 'url': commit.url}), content_type="application/json")
