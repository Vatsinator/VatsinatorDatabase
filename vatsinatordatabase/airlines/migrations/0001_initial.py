# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Airline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('icao', models.CharField(unique=True, max_length=3)),
                ('country', models.CharField(max_length=255)),
                ('website', models.URLField()),
                ('logo', models.CharField(max_length=127)),
            ],
        ),
        migrations.CreateModel(
            name='Logo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file', models.ImageField(upload_to=b'airline-logos')),
                ('created', models.DateTimeField()),
                ('airline', models.ForeignKey(related_name='r', to='airlines.Airline')),
            ],
        ),
    ]
