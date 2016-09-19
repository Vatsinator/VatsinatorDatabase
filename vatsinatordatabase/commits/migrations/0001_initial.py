# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Commit',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=255)),
                ('description', models.TextField()),
                ('timestamp', models.DateTimeField()),
                ('token', models.CharField(max_length=64)),
                ('url', models.URLField()),
                ('status', models.CharField(default=b'PE', max_length=2, choices=[(b'PE', b'Pending review'), (b'AC', b'Accepted'), (b'RE', b'Rejected')])),
                ('type', models.CharField(default=b'MOD', max_length=3, choices=[(b'MOD', b'Modification'), (b'NEW', b'Creation'), (b'DEL', b'Deletion')])),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
        ),
        migrations.CreateModel(
            name='CommitData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('field_name', models.CharField(max_length=255)),
                ('old_value', models.CharField(max_length=255)),
                ('new_value', models.CharField(max_length=255)),
                ('commit', models.ForeignKey(to='commits.Commit')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='commit',
            unique_together=set([('token', 'timestamp', 'content_type', 'object_id')]),
        ),
    ]
