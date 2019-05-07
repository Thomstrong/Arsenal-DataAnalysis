import os

from progress.bar import Bar

from TianchiServer import settings
from courses.models.course import Course
from wordcloud.constants import TagType
from wordcloud.models.tag_record import CourseTag
from wordcloud.models.word_cloud_tag import WordCloudTag


# python manage.py generate_course_tags
def run():
    CourseTag.objects.all().delete()
    course_map = []
    for course_id in [4, 5, 6, 7, 8, 17, 59]:
        course_map.append(Course.objects.get(id=course_id))

    no_limit_course, _ = Course.objects.get_or_create(
        id=61,
        name='不限'
    )
    course_map.append(no_limit_course)

    root = settings.BASE_DIR
    file_name = 'subject'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    with open(file_path, encoding='utf-8') as data_file:
        # 读取表头
        data_file.readline()

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            bar.next()
            split_line = line.replace('"', '').split(',')
            major_name = split_line[0].strip()
            tag, _ = WordCloudTag.objects.get_or_create(
                title=major_name,
                type=TagType.Course
            )

            for i in range(8):
                try:
                    if split_line[i + 1]:
                        value = int(split_line[i + 1].strip())

                        tag_record, _ = CourseTag.objects.get_or_create(
                            tag=tag,
                            course=course_map[i]
                        )
                        tag_record.value += value
                        tag_record.save()
                except Exception as e:
                    print(repr(e))
                    err_record_file.write('{},{}\n'.format(line, repr(e)))
                    continue
        bar.finish()
