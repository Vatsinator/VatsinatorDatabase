from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q

from airlines.models import Airline

def index(request):
  ''' Default view, only the search input field '''
  return render(request, 'airlines/search.html')

def search(request):
  q = request.GET['q']
  results = Airline.objects.filter(Q(icao__istartswith=q) | Q(name__icontains=q))
  if len(results) == 0:
    return render(request, 'airlines/search.html', {
      'q': q,
      'error_message': "Sorry, could not find any matching airlines.",
    })
  
  paginator = Paginator(results, 25)
  
  page = request.GET.get('page')
  try:
    airline_list = paginator.page(page)
  except PageNotAnInteger:
    airline_list = paginator.page(1)
  except EmptyPage:
    airline_list = paginator.page(paginator.num_pages)
  
  return render(request, 'airlines/search.html', {
    'q': q,
    'airline_list': airline_list,
  })

@ensure_csrf_cookie
def details(request, icao):
  a = get_object_or_404(Airline, icao=icao)
  return render(request, 'airlines/details.html', {
    'a': a,
  })
