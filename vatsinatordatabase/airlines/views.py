from django.shortcuts import get_object_or_404, render
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.utils.datastructures import MultiValueDictKeyError
from django.db.models import Q
from annoying.decorators import ajax_request, render_to

from vatsinatordatabase.commits.models import Commit, CommitData

from forms import LogoUploadForm
from models import Airline, Logo


@render_to('airlines/search.html')
def index(request):
    """
    Render the search field.
    @param request: The HttpRequest.
    @return: The HttpResponse.
    """
    return {}


@render_to('airlines/search.html')
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

    return {
        'q': q,
        'airline_list': airline_list,
    }


@ensure_csrf_cookie
@render_to('airlines/details.html')
def details(request, icao):
    """
    Render airline details.
    @param request: The HttpRequest.
    @param icao: The airline ICAO code.
    @return: The HttpResponse.
    """
    a = get_object_or_404(Airline, icao=icao)

    # TODO Move airline logos to django application
    if a.logo and not a.logo.startswith('/upload/'):
        a.logo = 'http://repo.vatsinator.eu.org/airline-logos/' + a.logo

    changes = Commit.objects.filter(content_type=ContentType.objects.get_for_model(a), object_id=a.id,
                                    status='AC').order_by('-timestamp')

    max_logo_width = LogoUploadForm.max_width
    max_logo_height = LogoUploadForm.max_height

    return {
        'a': a,
        'changes': changes,
        'max_logo_width': max_logo_width,
        'max_logo_height': max_logo_height
    }


@require_POST
@ajax_request
def save(request, icao):
    """
    Create airline commit.
    @param request: The HttpRequest; has to store new airline values in POST.
    @param icao: The airline ICAO code.
    @return: The JsonResponse.
    """
    try:
        airline = Airline.objects.get(icao=icao)
        commit = Commit.create(airline)
        commit.email = request.POST['email']
        commit.description = request.POST['description']
        commit.url = '/airlines/details/' + airline.icao
        commit.save()

        fields = ['name', 'country', 'website', 'logo']
        for f in fields:
            try:
                old = unicode(getattr(airline, f))
                new = request.POST[f].strip()
            except AttributeError:
                return {'result': 0, 'reason': 'Invalid request'}

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
    @param request: The HttpRequest; has to store new airline logo in FILES, under 'file' key.
    @param icao: The airline ICAO code.
    @return: The JsonResponse.
    """
    form = LogoUploadForm(request.POST, request.FILES)
    if form.is_valid():
        try:
            a = Airline.objects.get(icao=icao)
        except Airline.DoesNotExist:
            return {'result': 0, 'reason': 'No such airport.'}

        logo = Logo(airline=a, file=request.FILES['file'])
        logo.save()

        return {'result': 1, 'url': logo.file.url}
    else:
        return {'result': 0, 'reason': 'The logo image is invalid; please read the instruction.'}
