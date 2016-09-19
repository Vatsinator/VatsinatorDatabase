# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Airport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('iata', models.CharField(max_length=3)),
                ('icao', models.CharField(unique=True, max_length=4)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('altitude', models.IntegerField()),
            ],
        ),
    ]
