# -*- coding: utf-8 -*-
from django.db import models

class Airline(models.Model):
  name = models.CharField(max_length=255)
  icao = models.CharField(max_length=3)
  country = models.CharField(max_length=255)
  website = models.URLField()
  hasLogo = models.BooleanField()
  
  def __unicode__(self):
    return unicode("%s %s" % (self.icao, self.name))
  