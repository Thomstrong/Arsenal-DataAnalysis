from django.conf.urls import url, include
from rest_framework import routers

from consumptions.api.views import ConsumptionViewSet

router = routers.DefaultRouter()
router.register(r'consumption', ConsumptionViewSet)

urlpatterns = [
    url(r'api/', include(router.urls))
]
