from django.conf.urls import patterns, include, url
from staticpages import views as staticpages

urlpatterns = patterns('',
  url(r'^/?$', staticpages.index),
  url(r'^airports/', include('airports.urls')),
)
