from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.utils.datastructures import MultiValueDictKeyError
from django.db.models import Q
from annoying.decorators import ajax_request, render_to

from vatsinatordatabase.commits.models import Commit, CommitData
from models import Airport


@render_to('airports/search.html')
def index(request):
    """
    Default view, render search field only.
    @param request: The HttpRequest.
    @return: The HttpResponse.
    """
    return {}


@render_to('airports/search.html')
def search(request):
    """
    Render search results.
    @param request: The HttpRequest.
    @return: The HttpResponse.
    """
    try:
        q = request.GET['q']
    except MultiValueDictKeyError:
        # return default view on no query
        return index(request)

    results = Airport.objects.filter(Q(icao__istartswith=q) | Q(name__icontains=q))
    if len(results) == 0:
        return {
            'q': q,
            'error_message': "Sorry, could not find any airport.",
            'create_new': len(q) == 4
        }

    paginator = Paginator(results, 25)

    page = request.GET.get('page')
    try:
        airport_list = paginator.page(page)
    except PageNotAnInteger:
        airport_list = paginator.page(1)
    except EmptyPage:
        airport_list = paginator.page(paginator.num_pages)

    return {
        'q': q,
        'airport_list': airport_list,
    }


@ensure_csrf_cookie
@render_to('airports/details.html')
def details(request, icao):
    """
    Render airport details.
    @param request: The HttpRequest.
    @param icao: The airport ICAO code.
    @return: The HttpResponse.
    """
    ap = get_object_or_404(Airport, icao=icao)
    changes = Commit.objects.filter(content_type=ContentType.objects.get_for_model(ap), object_id=ap.id,
                                    status='AC').order_by('-timestamp')

    return {
        'ap': ap,
        'changes': changes
    }


@ensure_csrf_cookie
@render_to('airports/details.html')
def new(request, icao):
    """
    Render "create new airport" page.
    The page itself is handled by details.html template. At the beginning, all details are empty and the edit mode
    is enabled. User has to fill in necessary data in order to confirm changes.
    :param request: The HttpRequest.
    :param icao: The new airport ICAO code.
    :return: The HttpResponse.
    """
    try:
        Airport.objects.get(icao=icao)
        return redirect('airports.details', icao=icao)
    except Airport.DoesNotExist:  # OK, the airport does not exist, we can create a new one
        ap = Airport(icao=icao)
        return {
            'is_new': True,
            'ap': ap
        }


@require_POST
@ajax_request
def save(request, icao):
    """
    Create airport commit.
    @param request: The HttpRequest; it has to contain new airport data.
    @param icao: The airport ICAO code.
    @return: The JsonResponse.
    """
    try:
        airport = Airport.objects.get(icao=icao)
        commit = Commit.create(airport)
        commit.email = request.POST['email']
        commit.description = request.POST['description']
        commit.url = '/airports/details/' + airport.icao
        commit.save()

        fields = ['iata', 'name', 'city', 'country', 'latitude', 'longitude', 'altitude']
        for f in fields:
            try:
                old = unicode(getattr(airport, f))
                new = request.POST[f].strip()
            except AttributeError:
                return {'result': 0, 'reason': 'Invalid request'}

            if old != new:
                data = CommitData.create(commit, f, old, new)
                data.save()

        return {'result': 1}
    except KeyError:
        return {'result': 0, 'reason': 'Invalid request'}

