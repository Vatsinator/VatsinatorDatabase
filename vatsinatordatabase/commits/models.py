from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.generic import GenericForeignKey
from django.core.mail import mail_admins
from datetime import datetime
from uuid import uuid1

class Commit(models.Model):
  email = models.EmailField(max_length=255)
  description = models.TextField()
  timestamp = models.DateTimeField()
  token = models.CharField(max_length=64)
  
  content_type = models.ForeignKey(ContentType)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')
  
  def __notify(self):
    mail_admins('New commit',
              'A new commit has been added.\nToken: %s/commits/%s' % (settings.DOMAIN_NAME, self.token))
  
  def save(self):
    super(Commit, self).save()
    self.__notify()
  
  def __unicode__(self):
    return self.timestamp
  
  @classmethod
  def create(cls, content_object):
    commit = cls(content_object=content_object)
    commit.timestamp = datetime.utcnow()
    commit.token = uuid1().hex
    return commit
  
  class Meta:
    unique_together = ('token', 'timestamp', 'content_type', 'object_id',)

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
