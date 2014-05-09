from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from annoying.decorators import ajax_request

from models import Commit


@login_required
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


@require_POST
@ajax_request
def accept(request, token):
    """
    Accept the commit.

    Args:
        request: the request.
        token: the commit token.
    """
    if not request.user.is_authenticated():
        return {'result': 0, 'reason': 'Not authenticated'}

    try:
        commit = Commit.objects.get(token=token)
        commit.merge()

        return {'result': 1, 'url': commit.url}
    except KeyError:
        return {'result': 0, 'reason': 'Invalid request'}


@require_POST
@ajax_request
def reject(request, token):
    """
    Reject the commit.

    Args:
        request: the request.
        token: the commit token.
    """
    if not request.user.is_authenticated():
        return {'result': 0, 'reason': 'Not authenticated'}

    try:
        commit = Commit.objects.get(token=token)
        commit.reject()

        return {'result': 1, 'url': commit.url}
    except KeyError:
        return {'result': 0, 'reason': 'Invalid request'}

