from django.conf.urls import patterns, url
from airlines.views import *

urlpatterns = patterns('',
  url(
    regex = r'^$',
    view  = index,
    name  = 'airlines.index'
  ,),
  url(
    regex = r'^search/?$',
    view  = search,
    name  = 'airlines.search'
  ,),
  url(
    regex = r'^details/(?P<icao>.+)$',
    view  = details,
    name  = 'airlines.details'
  ,),
)