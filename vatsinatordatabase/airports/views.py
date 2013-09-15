from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404, render

from airports.models import Airport


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

def details(request, icao):
  ap = get_object_or_404(Airport, icao=icao)
  return render(request, 'airports/details.html', {
    'ap': ap,
  })
