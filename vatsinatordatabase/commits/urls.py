from django.conf.urls import patterns, url
from commits.views import *

urlpatterns = patterns('',
  url(
    regex = r'(?P<token>.+)$',
    view  = review,
    name  = 'review'
  ,),
)
