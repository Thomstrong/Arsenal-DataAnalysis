from rest_framework import routers

from consumptions.api.views import ConsumptionViewSet
from students.api.views import StudentViewSet

router = routers.SimpleRouter()

router.register(r'students', StudentViewSet)
router.register(r'consumption', ConsumptionViewSet)

urlpatterns = router.urls
