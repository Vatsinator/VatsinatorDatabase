from django.db import models


class Airline(models.Model):
    """
    This model describes a single Airline.
    """
    name = models.CharField(max_length=255)
    icao = models.CharField(max_length=3, unique=True)
    country = models.CharField(max_length=255)
    website = models.URLField()
    logo = models.CharField(max_length=127)

    def __unicode__(self):
        return unicode("%s %s" % (self.icao, self.name))


class Logo(models.Model):
    """
    Logo upload field.
    This is not what Airline model uses. This model is used only during the logo file upload and
    by repo-sync script, as a reference.
    """
    airline = models.ForeignKey(Airline, related_name='r')
    file = models.ImageField(upload_to='airline-logos')
    created = models.DateTimeField()
