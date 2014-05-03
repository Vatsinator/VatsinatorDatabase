import json

from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

from models import Commit

@ensure_csrf_cookie
def review(request, token):
    """
    Render the commit data.

    Args:
        request: the request.
        token: the requested Commit token.
    """
    commit = get_object_or_404(Commit, token=token)
    data = commit.commitdata_set.all()
    return render(request, 'commits/review.html', {
        'commit': commit,
        'data': data
    })


def accept(request):
    """
    Accept the commit.

    Args:
        request: the request.
    """
    try:
        token = request.POST['token']
        commit = Commit.objects.get(token=token)
        commit.merge()

        return HttpResponse(json.dumps(
            {
                'result': 1,
                'url': commit.url
            }
        ), content_type='application/json')
    except KeyError:
        return HttpResponse(json.dumps(
            {
                'result': 0,
                'reason': 'Invalid request'
            }
        ), content_type='application/json')


def reject(request):
    """
    Reject the commit.

    Args:
        request: the request.
    """
    try:
        token = request.POST['token']
        commit = Commit.objects.get(token=token)
        commit.reject()

        return HttpResponse(json.dumps(
            {
                'result': 1,
                'url': commit.url
            }
        ), content_type='application/json')
    except KeyError:
        return HttpResponse(json.dumps(
            {
                'result': 0,
                'reason': 'Invalid request'
            }
        ), content_type='application/json')
