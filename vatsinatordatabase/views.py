from django.apps import apps
from annoying.decorators import render_to


@render_to('index.html')
def index(request):
    """
    Render the main page.
    @param request: The HttpRequest
    @return: The HttpResponse
    """
    commits = apps.get_model('commits.Commit')

    try:
        last_commit = commits.objects.filter(status='AC').order_by('-timestamp')[0]
    except IndexError:  # no commits
        last_commit = None

    airports = apps.get_model('airports.Airport')
    airlines = apps.get_model('airlines.Airline')

    return {
        'airport_count': airports.objects.count(),
        'airline_count': airlines.objects.count(),
        'last_commit': last_commit
    }
