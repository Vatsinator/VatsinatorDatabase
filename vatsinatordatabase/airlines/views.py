from django.shortcuts import get_object_or_404, render
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.db.models import Q
from annoying.decorators import ajax_request

from vatsinatordatabase.commits.models import Commit, CommitData

from forms import LogoUploadForm
from models import Airline, Logo


def index(request):
    """
    Default view, the search field only.
    @param request: the HttpRequest.
    @return: The HttpResponse.
    """
    return render(request, 'airlines/search.html')


def search(request):
    """
    Search results view.
    @param request: the HttpRequest.
    @return: The HttpResponse.
    """
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
    """
    Airline details view.
    @param request: the HttpRequest.
    @param icao: the airline ICAO code.
    @return: the HttpResponse.
    """
    a = get_object_or_404(Airline, icao=icao)
    if a.logo and not a.logo.startswith('/upload/'):
        a.logo = 'http://repo.vatsinator.eu.org/airline-logos/' + a.logo

    changes = Commit.objects.filter(content_type=ContentType.objects.get_for_model(a), object_id=a.id,
                                    status='AC').order_by('-timestamp')

    return render(request, 'airlines/details.html', {
        'a': a,
        'changes': changes,
    })


@require_POST
@ajax_request
def save(request, icao):
    """
    Create airline commit.
    @param request: the HttpRequest; has to store new airline values in POST.
    @param icao: the airline ICAO code.
    @return: the JsonResponse.
    """
    try:
        airline = Airline.objects.get(icao=icao)
        commit = Commit.create(airline)
        commit.email = request.POST['email']
        commit.description = request.POST['description']
        commit.url = '/airlines/details/' + airline.icao
        commit.save()
        commit.notify()

        fields = ['name', 'country', 'website', 'logo']
        for f in fields:
            old = unicode(getattr(airline, f))
            new = request.POST[f].strip()
            if old != new:
                data = CommitData.create(commit, f, old, new)
                data.save()

        return {'result': 1}
    except KeyError:
        return {'result': 0, 'reason': 'Invalid request'}


@require_POST
@ajax_request
def upload_logo(request, icao):
    """
    Upload the new airline logo.
    @param request: the HttpRequest; has to store new airline logo in FILES, under 'file' key.
    @param icao: the airline ICAO code.
    @return: the JsonResponse.
    """
    form = LogoUploadForm(request.POST, request.FILES)
    if form.is_valid():
        try:
            a = Airline.objects.get(icao=icao)
        except Airline.DoesNotExist:
            return {'result': 0, 'reason': 'Invalid request'}

        logo = Logo(airline=a, file=request.FILES['file'])
        logo.save()

        return {'result': 1, 'url': logo.file.url}
    else:
        return {'result': 0, 'reason': 'Invalid request'}
