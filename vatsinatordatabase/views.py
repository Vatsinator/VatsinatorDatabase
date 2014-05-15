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
    return {
        'airport_count': Airport.objects.count(),
        'airline_count': Airline.objects.count(),
        'last_commit': Commit.objects.filter(status='AC').order_by('-timestamp')[0]
    }
