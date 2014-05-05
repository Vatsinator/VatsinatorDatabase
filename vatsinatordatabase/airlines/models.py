from django.db import models


class Airline(models.Model):
    """
    This model describes a single Airline.
    """
    name = models.CharField(max_length=255)
    icao = models.CharField(max_length=3)
    country = models.CharField(max_length=255)
    website = models.URLField()
    logo = models.CharField(max_length=127)

    def __unicode__(self):
        return unicode("%s %s" % (self.icao, self.name))
