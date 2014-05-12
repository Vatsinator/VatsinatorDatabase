from django.conf.urls import patterns, url
from django.conf import settings
from django.conf.urls.static import static

from views import *


urlpatterns = patterns('',
                       url(
                           regex=r'^$',
                           view=index,
                           name='airlines.index'
                           , ),
                       url(
                           regex=r'^search/?$',
                           view=search,
                           name='airlines.search'
                           , ),
                       url(
                           regex=r'^details/(?P<icao>.+)$',
                           view=details,
                           name='airlines.details'
                           , ),
                       url(
                           regex=r'^save/(?P<icao>.+)$',
                           view=save,
                           name='airlines.save'
                           , ),
                       url(
                           regex=r'^upload-logo/(?P<icao>.+)$',
                           view=upload_logo,
                           name='airlines.upload-logo'
                           , ),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)