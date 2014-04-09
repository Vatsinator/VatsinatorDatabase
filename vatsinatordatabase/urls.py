from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
  url(r'^/?$', index),
  url(r'^airlines/', include('airlines.urls')),
  url(r'^airports/', include('airports.urls')),
  url(r'^commits/', include('commits.urls')),
)
