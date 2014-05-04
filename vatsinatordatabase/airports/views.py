import json

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
from django.db.models import Q

from vatsinatordatabase.commits.models import Commit, CommitData

from models import Airport


def index(request):
    """
    Default view, render search field only.

    Args:
        request: the request.
    """
    return render(request, 'airports/search.html')


def search(request):
    """
    Search results view.

    Args:
        request: the request.
    """
    q = request.GET['q']
    results = Airport.objects.filter(Q(icao__istartswith=q) | Q(name__icontains=q))
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
    """
    Airport details view.

    Args:
        request: the request.
        icao: the airport ICAO code.
    """
    ap = get_object_or_404(Airport, icao=icao)
    return render(request, 'airports/details.html', {
        'ap': ap,
    })


def save(request, icao):
    """
    Ajax view.

    Args:
        request: the request.
        icao: the airport ICAO code.
    """

    try:
        airport = Airport.objects.get(icao=icao)
        commit = Commit.create(airport)
        commit.email = request.POST['email']
        commit.description = request.POST['description']
        commit.url = '/airports/details/' + airport.icao
        commit.save()
        commit.notify()

        fields = ['iata', 'name', 'city', 'country', 'latitude', 'longitude', 'altitude']
        for f in fields:
            old = unicode(getattr(airport, f))
            new = request.POST[f].strip()
            if old != new:
                data = CommitData.create(commit, f, old, new)
                data.save()

        return HttpResponse(json.dumps(
            {
                'result': 1
            }
        ), content_type='application/json')
    except KeyError:
        return HttpResponse(json.dumps(
            {
                'result': 0,
                'reason': 'Invalid request'
            }
        ), content_type='application/json')
