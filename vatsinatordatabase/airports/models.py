from django.db import models

# Create your models here.

class Airport(models.Model):
  name = models.CharField(max_length=255)
  city = models.CharField(max_length=255)
  country = models.CharField(max_length=255)
  iata = models.CharField(max_length=3)
  icao = models.CharField(max_length=4)
  latitude = models.FloatField()
  longitude = models.FloatField()
  altitude = models.IntegerField()
  
  def __unicode__(self):
      return self.icao
  
class Modification(models.Model):
  airport = models.ForeignKey(Airport)
  field_name = models.CharField(max_length=64)
  original_value = models.CharField(max_length=255)
  new_value = models.CharField(max_length=255)
  timestamp = models.DateTimeField('commit time')
  token = models.CharField(max_length=64)
  
  def __unicode__(self):
      return self.timestamp

