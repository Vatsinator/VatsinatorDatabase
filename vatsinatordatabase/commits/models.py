from datetime import datetime
from uuid import uuid1

from django.db import models
from django.dispatch import Signal
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.generic import GenericForeignKey


# The post_merge signal is sent after the commit is merged with the database.
post_merge = Signal(providing_args=["instance"])


class Commit(models.Model):
    """
    Generic class for all commits made by users.
    """
    COMMIT_STATUS_CHOICES = (
        ('PE', 'Pending review'),
        ('AC', 'Accepted'),
        ('RE', 'Rejected')
    )

    email = models.EmailField(max_length=255)
    description = models.TextField()
    timestamp = models.DateTimeField()
    token = models.CharField(max_length=64)
    url = models.URLField()
    status = models.CharField(max_length=2,
                              choices=COMMIT_STATUS_CHOICES,
                              default='PE')

    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def get_commit_url(self):
        """
        Generate url for the commit. Requires DOMAIN_NAME to be defined in settings.py.
        @return: The absolute url of the commit.
        """
        return "http://%s/commits/%s" % (settings.DOMAIN_NAME, self.token)

    def merge(self):
        """
        Merge the commit with the database.
        """
        my_object = self.content_object
        data = self.commitdata_set.all()

        for d in data:
            setattr(my_object, d.field_name, d.new_value)

        my_object.save()

        self.status = 'AC'
        self.save()

        post_merge.send(sender=self.__class__, instance=self)

    def reject(self):
        """
        Reject the commit.
        """
        self.status = 'RE'
        self.save()

    def status_nice(self):
        """
        Return commit status in nice, human-readable form.
        """
        return dict(Commit.COMMIT_STATUS_CHOICES)[self.status]

    def __unicode__(self):
        return self.timestamp

    @classmethod
    def create(cls, content_object):
        """
        Create the new commit.
        @param content_object: The object that is being modified.
        @return: The commit object.
        """
        commit = cls(content_object=content_object)
        commit.timestamp = datetime.utcnow()
        commit.token = uuid1().hex
        return commit

    class Meta:
        unique_together = ('token', 'timestamp', 'content_type', 'object_id',)


class CommitData(models.Model):
    """
    The CommitData class handles data for a single commit.
    """
    commit = models.ForeignKey(Commit)
    field_name = models.CharField(max_length=255)
    old_value = models.CharField(max_length=255)
    new_value = models.CharField(max_length=255)

    def __unicode__(self):
        return self.field_name

    @classmethod
    def create(cls, commit, field_name, old_value, new_value):
        """
        Create the new data row.
        @param commit: The commit.
        @param field_name: The name of the field that is being modified.
        @param old_value: The old value of the field.
        @param new_value: The new value of the field.
        @return: The CommitData object.
        """
        data = cls(commit=commit)
        data.field_name = field_name
        data.old_value = old_value
        data.new_value = new_value
        return data
