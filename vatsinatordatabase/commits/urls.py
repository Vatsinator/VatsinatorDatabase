from django.conf.urls import patterns, url

from commits.views import *


urlpatterns = patterns('',
                       url(
                           regex=r'^accept/?$',
                           view=accept,
                           name='accept'
                           , ),
                       url(
                           regex=r'^reject/?$',
                           view=reject,
                           name='reject'
                           , ),
                       url(
                           regex=r'(?P<token>.+)$',
                           view=review,
                           name='review'
                           , ),
)
