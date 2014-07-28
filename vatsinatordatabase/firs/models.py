from django.db import models


class Fir(models.Model):
    """
    The Fir model describes a single Flight Information Region.
    """
    icao = models.CharField(max_length=4, unique=True)
    oceanic = models.BooleanField()
    text_position_x = models.DecimalField(decimal_places=6, max_digits=10)
    text_position_y = models.DecimalField(decimal_places=6, max_digits=10)


class Point(models.Model):
    """
    The Point model is used to describe one point in FIR border.
    """
    fir = models.ForeignKey(Fir)
    longitude = models.DecimalField(decimal_places=6, max_digits=10)
    latitude = models.DecimalField(decimal_places=6, max_digits=10)

    def __unicode__(self):
        return unicode("(%s, %s)" % (self.longitude, self.latitude))
