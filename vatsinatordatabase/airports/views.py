import json

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

from airports.models import Airport
from commits.models import Commit, CommitData

def index(request):
  ''' Default view, only the search input field '''
  return render(request, 'airports/search.html')

def search(request):
  q = request.GET['q']
  results = Airport.objects.filter(icao__istartswith=q)
  if len(results) == 0:
    return render(request, 'airports/search.html', {
      'q': q,
      'error_message': "Sorry, could not find any matching airport.",
    })
  
  paginator = Paginator(results, 25)
  
  page = request.GET.get('page')
  try:
    airport_list = paginator.page(page)
  except PageNotAnInteger:
    airport_list = paginator.page(1)
  except EmptyPage:
    airport_list = paginator.page(paginator.num_pages)
  
  return render(request, 'airports/search.html', {
    'q': q,
    'airport_list': airport_list,
  })

@ensure_csrf_cookie
def details(request, icao):
  ap = get_object_or_404(Airport, icao=icao)
  return render(request, 'airports/details.html', {
    'ap': ap,
  })

def save(request):
  result = 1
  
  if not 'id' in request.POST:
    result = 0
  else:
    id = request.POST['id']
    
    airport = Airport.objects.get(pk=id)
    commit = Commit.create(airport)
    commit.email = request.POST['email']
    commit.description = request.POST['description']
    commit.url = "/airports/details/" + airport.icao
    commit.save()
    commit.notify()
    
    fields = ["icao", "iata", "name", "city", "country", "latitude", "longitude", "altitude"]
    for f in fields:
      old = getattr(airport, f)
      new = request.POST[f].strip()
      if old != new:
        data = CommitData.create(commit, f, old, new)
        data.save()
  
  return HttpResponse(json.dumps({'result': result}), content_type="application/json")
