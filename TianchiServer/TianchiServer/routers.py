from rest_framework import routers

from classes.api.views import ClassViewSet
from consumptions.api.views import ConsumptionViewSet
from courses.api.views import CourseRecordViewSet, CourseViewSet
from exams.api.views import ClassExamViewSet
from kaoqins.api.views import KaoqinRecordViewSet
from students.api.views import StudentViewSet
from terms.api.views import TermViewSet
from wordcloud.api.views import WordCloudTagViewSet

router = routers.SimpleRouter()

router.register(r'students', StudentViewSet)
router.register(r'consumption', ConsumptionViewSet)
router.register(r'course_record', CourseRecordViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'kaoqin_record', KaoqinRecordViewSet)
router.register(r'terms', TermViewSet)
router.register(r'class_exam', ClassExamViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'word_cloud_tag', WordCloudTagViewSet)

urlpatterns = router.urls
