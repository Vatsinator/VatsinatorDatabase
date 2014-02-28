from django.shortcuts import get_object_or_404, render
from commits.models import Commit, CommitData

def review(request, token):
  commit = get_object_or_404(Commit, token=token)
  data = commit.commitdata_set.all()
  return render(request, 'commits/review.html', {
    'commit' : commit,
    'data'   : data
  })
