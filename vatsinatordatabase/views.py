from annoying.decorators import render_to

from airlines.models import Airline
from airports.models import Airport
from commits.models import Commit


@render_to('index.html')
def index(request):
    """
    Render the main page.
    @param request: The HttpRequest
    @return: The HttpResponse
    """
    try:
        last_commit = Commit.objects.filter(status='AC').order_by('-timestamp')[0]
    except IndexError:  # no commits
        last_commit = None

    return {
        'airport_count': Airport.objects.count(),
        'airline_count': Airline.objects.count(),
        'last_commit': last_commit
    }
