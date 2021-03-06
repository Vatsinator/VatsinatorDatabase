from django.conf.urls import patterns, url

from views import *


urlpatterns = patterns('',
                       url(
                           regex=r'^accept/(?P<token>.+)$',
                           view=accept,
                           name='accept'
                           , ),
                       url(
                           regex=r'^reject/(?P<token>.+)$',
                           view=reject,
                           name='reject'
                           , ),
                       url(
                           regex=r'(?P<token>.+)$',
                           view=review,
                           name='review'
                           , ),
)
