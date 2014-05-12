from annoying.decorators import render_to


@render_to('index.html')
def index(request):
    """
    Render the main page.
    @param request: The HttpRequest
    @return: The HttpResponse
    """
    return {}
