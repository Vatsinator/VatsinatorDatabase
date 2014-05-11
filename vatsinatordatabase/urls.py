from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

from views import *


urlpatterns = patterns('',
                       url(r'^/?$', index),
                       url(r'^airlines/', include('airlines.urls')),
                       url(r'^airports/', include('airports.urls')),
                       url(r'^commits/', include('commits.urls')),
                       url(r'^accounts/login/$', 'django.contrib.auth.views.login'),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
