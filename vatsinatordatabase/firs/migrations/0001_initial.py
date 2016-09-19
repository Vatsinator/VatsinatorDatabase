# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Fir',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('icao', models.CharField(unique=True, max_length=4)),
                ('oceanic', models.BooleanField()),
                ('text_position_x', models.DecimalField(max_digits=10, decimal_places=6)),
                ('text_position_y', models.DecimalField(max_digits=10, decimal_places=6)),
            ],
        ),
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('longitude', models.DecimalField(max_digits=10, decimal_places=6)),
                ('latitude', models.DecimalField(max_digits=10, decimal_places=6)),
                ('fir', models.ForeignKey(to='firs.Fir')),
            ],
        ),
    ]
