# Generated by Django 5.0.6 on 2024-07-07 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0007_carmodel_view_count_carmodel_view_count_day_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='carmodel',
            name='region',
            field=models.CharField(default='Kiev', max_length=20),
            preserve_default=False,
        ),
    ]
