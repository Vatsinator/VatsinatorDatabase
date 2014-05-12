from django.conf.urls import patterns, url

from views import *


urlpatterns = patterns('',
                       url(
                           regex=r'^$',
                           view=index,
                           name='airports.index'
                           , ),
                       url(
                           regex=r'^search/?$',
                           view=search,
                           name='airports.search'
                           , ),
                       url(
                           regex=r'^details/(?P<icao>.+)$',
                           view=details,
                           name='airports.details'
                           , ),
                       url(
                           regex=r'^save/(?P<icao>.+)$',
                           view=save,
                           name='airports.save'
                           , )
)
