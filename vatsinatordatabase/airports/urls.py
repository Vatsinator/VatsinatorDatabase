from django.conf.urls import patterns, url
from airports.views import *

urlpatterns = patterns('',
  url(
    regex = r'^$',
    view  = index,
    name  = 'index'
  ,),
  url(
    regex = r'^search/?$',
    view  = search,
    name  = 'search'
  ,),
  url(
    regex = r'^details/(?P<icao>.+)$',
    view  = details,
    name  = 'details'
  ,),
  url(
    regex = r'^save/?$',
    view  = save,
    name  = 'save'
  ,)
)
