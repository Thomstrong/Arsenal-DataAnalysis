from rest_framework import routers

from consumptions.api.views import ConsumptionViewSet
from courses.api.views import CourseRecordViewSet
from exams.api.views import ClassExamViewSet
from kaoqins.api.views import KaoqinRecordViewSet
from students.api.views import StudentViewSet
from terms.api.views import TermViewSet

router = routers.SimpleRouter()

router.register(r'students', StudentViewSet)
router.register(r'consumption', ConsumptionViewSet)
router.register(r'course_record', CourseRecordViewSet)
router.register(r'kaoqin_record', KaoqinRecordViewSet)
router.register(r'terms', TermViewSet)
router.register(r'class_exam', ClassExamViewSet)

urlpatterns = router.urls
