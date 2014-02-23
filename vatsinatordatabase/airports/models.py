from django.db import models
from datetime import datetime
from uuid import uuid1

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
  
class Commit(models.Model):
  airport = models.ForeignKey(Airport)
  email = models.EmailField(max_length=255)
  description = models.TextField()
  timestamp = models.DateTimeField()
  token = models.CharField(max_length=64)
  
  def __unicode__(self):
    return self.timestamp
  
  @classmethod
  def create(cls, airport):
    commit = cls(airport=airport)
    commit.timestamp = datetime.utcnow()
    commit.token = uuid1().hex
    return commit

class CommitData(models.Model):
  commit = models.ForeignKey(Commit)
  field_name = models.CharField(max_length=255)
  old_value = models.CharField(max_length=255)
  new_value = models.CharField(max_length=255)
  
  def __unicode__(self):
    return self.field_name
  
  @classmethod
  def create(cls, commit, field_name, old_value, new_value):
    data = cls(commit=commit)
    data.field_name = field_name
    data.old_value = old_value
    data.new_value = new_value
    return data
