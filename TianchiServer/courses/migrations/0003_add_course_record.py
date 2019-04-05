import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0002_auto_20190323_0232'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student', models.ForeignKey(null=False, on_delete=django.db.models.deletion.CASCADE, to='students.Student')),
                ('course', models.ForeignKey(null=False, on_delete=django.db.models.deletion.CASCADE, to='courses.Course'))
            ],
        ),
    ]
